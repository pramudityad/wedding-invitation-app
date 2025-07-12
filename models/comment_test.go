package models

import (
	"testing"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
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
	assert.Equal(t, "Author1", paginated.Comments[1].GuestName)
	assert.Equal(t, "Author2", paginated.Comments[0].GuestName)
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
