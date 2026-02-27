package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	_ "modernc.org/sqlite"
)

func TestCommentCreate(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	// Create guest
	g := &Guest{Name: "Commenter"}
	err := g.Create(db)
	assert.NoError(t, err)

	// Create comment
	comment := &Comment{
		GuestID: g.ID,
		Content: "Great event!",
	}
	err = comment.Create(db)
	assert.NoError(t, err)
	assert.NotZero(t, comment.ID)
}

func TestGetCommentsByGuestID(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	// Create guest and comments
	g := &Guest{Name: "Guest"}
	err := g.Create(db)
	assert.NoError(t, err)

	c1 := &Comment{GuestID: g.ID, Content: "First"}
	err = c1.Create(db)
	assert.NoError(t, err)
	c2 := &Comment{GuestID: g.ID, Content: "Second"}
	err = c2.Create(db)
	assert.NoError(t, err)

	// Test retrieval
	comments, err := GetCommentsByGuestID(db, g.ID)
	assert.NoError(t, err)
	assert.Len(t, comments, 2)
}

func TestGetCommentCountByGuestID(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	g := &Guest{Name: "Counter"}
	err := g.Create(db)
	assert.NoError(t, err)

	count, err := GetCommentCountByGuestID(db, g.ID)
	assert.NoError(t, err)
	assert.Equal(t, 0, count)

	// Add comment
	comment := &Comment{GuestID: g.ID, Content: "Test"}
	err = comment.Create(db)
	assert.NoError(t, err)

	count, err = GetCommentCountByGuestID(db, g.ID)
	assert.NoError(t, err)
	assert.Equal(t, 1, count)
}

func TestGetAllCommentsWithGuests(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	// Create guests and comments
	g1 := &Guest{Name: "Author1"}
	err := g1.Create(db)
	assert.NoError(t, err)
	g2 := &Guest{Name: "Author2"}
	err = g2.Create(db)
	assert.NoError(t, err)

	c1 := &Comment{GuestID: g1.ID, Content: "C1"}
	err = c1.Create(db)
	assert.NoError(t, err)
	time.Sleep(10 * time.Millisecond) // Ensure different timestamps
	c2 := &Comment{GuestID: g2.ID, Content: "C2"}
	err = c2.Create(db)
	assert.NoError(t, err)

	// Test retrieval
	paginated, err := GetAllCommentsWithGuests(db, 2, "")
	assert.NoError(t, err)
	assert.Len(t, paginated.Comments, 2)
	assert.Equal(t, "Author1", paginated.Comments[0].GuestName)
	assert.Equal(t, "Author2", paginated.Comments[1].GuestName)
}

func TestGetCommentCount(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	count, err := GetCommentCount(db)
	assert.NoError(t, err)
	assert.Equal(t, 0, count)

	// Add comment
	g := &Guest{Name: "CommentGuest"}
	err = g.Create(db)
	assert.NoError(t, err)
	c := &Comment{GuestID: g.ID, Content: "Testing"}
	err = c.Create(db)
	assert.NoError(t, err)

	count, err = GetCommentCount(db)
	assert.NoError(t, err)
	assert.Equal(t, 1, count)
}

func TestCommentMaximumLimit(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	// Create guest
	g := &Guest{Name: "LimitTester"}
	err := g.Create(db)
	assert.NoError(t, err)

	// Create first comment - should succeed
	c1 := &Comment{GuestID: g.ID, Content: "First comment"}
	err = c1.Create(db)
	assert.NoError(t, err)

	// Create second comment - should succeed
	c2 := &Comment{GuestID: g.ID, Content: "Second comment"}
	err = c2.Create(db)
	assert.NoError(t, err)

	// Create third comment - should fail with maximum limit error
	c3 := &Comment{GuestID: g.ID, Content: "Third comment"}
	err = c3.Create(db)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "maximum comment limit reached")

	// Verify only 2 comments exist for this guest
	count, err := GetCommentCountByGuestID(db, g.ID)
	assert.NoError(t, err)
	assert.Equal(t, 2, count)
}

func TestCommentCreate_InvalidGuestID(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Try to create comment with non-existent guest_id
	comment := &Comment{
		GuestID: 99999,
		Content: "Orphan comment",
	}
	err := comment.Create(db)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "FOREIGN KEY constraint")
}

func TestGetAllCommentsWithGuests_EmptyCursor(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Create guest and comment
	g := &Guest{Name: "CursorTester"}
	err := g.Create(db)
	assert.NoError(t, err)

	c := &Comment{GuestID: g.ID, Content: "Test comment"}
	err = c.Create(db)
	assert.NoError(t, err)

	// Test with empty cursor (first page)
	paginated, err := GetAllCommentsWithGuests(db, 10, "")
	assert.NoError(t, err)
	assert.Len(t, paginated.Comments, 1)
	assert.Equal(t, 1, paginated.TotalCount)
	assert.Equal(t, "", paginated.NextCursor) // No next page
}

func TestGetAllCommentsWithGuests_LargeCursor(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Create guest and comment
	g := &Guest{Name: "LargeCursorTester"}
	err := g.Create(db)
	assert.NoError(t, err)

	c := &Comment{GuestID: g.ID, Content: "Test comment"}
	err = c.Create(db)
	assert.NoError(t, err)

	// Use a far future cursor (all comments are before this)
	farFuture := "2999-12-31T23:59:59Z"
	paginated, err := GetAllCommentsWithGuests(db, 10, farFuture)
	assert.NoError(t, err)
	assert.Len(t, paginated.Comments, 1)
	assert.Equal(t, 1, paginated.TotalCount)
}

func TestGetAllComments_EmptyTable(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Test on empty comments table
	comments, err := GetAllComments(db)
	assert.NoError(t, err)
	assert.Len(t, comments, 0)
}

func TestGetCommentCountByGuestID_NonExistent(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Test with non-existent guest ID
	count, err := GetCommentCountByGuestID(db, 99999)
	assert.NoError(t, err)
	assert.Equal(t, 0, count)
}
