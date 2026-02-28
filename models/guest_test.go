package models

import (
	"database/sql"
	"testing"

	"github.com/stretchr/testify/assert"
	"wedding-invitation-backend/database"
	_ "modernc.org/sqlite"
)

func setupDB(t *testing.T) *sql.DB {
	t.Helper()
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatal(err)
	}
	// Enable foreign keys (must be set before creating tables)
	_, err = db.Exec(`PRAGMA foreign_keys = ON;`)
	if err != nil {
		t.Fatal(err)
	}

	// Create tables using shared schema
	if err := database.CreateSchema(db); err != nil {
		t.Fatal(err)
	}

	return db
}

func TestGuestCreate(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	guest := &Guest{
		Name:     "John Doe",
		PlusOnes: 2,
	}

	err := guest.Create(db)
	assert.NoError(t, err)
	assert.NotEqual(t, 0, guest.ID)
}

func TestGetGuestByName(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	// Create test guest
	g := &Guest{Name: "Jane Smith"}
	err := g.Create(db)
	assert.NoError(t, err)

	// Test retrieval
	guest, err := GetGuestByName(db, "Jane Smith")
	assert.NoError(t, err)
	assert.Equal(t, "Jane Smith", guest.Name)
}

func TestGuestUpdate(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	guest := &Guest{Name: "Original"}
	err := guest.Create(db)
	assert.NoError(t, err)

	guest.Name = "Updated"
	err = guest.Update(db)
	assert.NoError(t, err)

	updatedGuest, err := GetGuestByName(db, "Updated")
	assert.NoError(t, err)
	assert.Equal(t, "Updated", updatedGuest.Name)
}

func TestBulkOperations(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	// BulkCreate
	guests := []Guest{
		{Name: "Bulk1"},
		{Name: "Bulk2"},
	}
	err := BulkCreate(db, guests)
	assert.NoError(t, err)
	assert.NotZero(t, guests[0].ID)
	assert.NotZero(t, guests[1].ID)

	// BulkUpdate
	guests[0].Name = "UpdatedBulk1"
	err = BulkUpdate(db, guests)
	assert.NoError(t, err)
}

func TestGetAllGuests(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	guests, err := GetAllGuests(db)
	assert.NoError(t, err)
	assert.Len(t, guests, 0)

	// Add guest and test
	g := &Guest{Name: "Test"}
	err = g.Create(db)
	assert.NoError(t, err)

	guests, err = GetAllGuests(db)
	assert.NoError(t, err)
	assert.Len(t, guests, 1)
}

func TestMarkInvitationOpened(t *testing.T) {
	db := setupDB(t)
	defer db.Close()

	// Create unopened guest
	g := &Guest{Name: "Unopened"}
	err := g.Create(db)
	assert.NoError(t, err)

	// Mark opened
	err = MarkInvitationOpened(db, "Unopened")
	assert.NoError(t, err)

	// Should fail if already opened
	err = MarkInvitationOpened(db, "Unopened")
	assert.NoError(t, err)

	// Verify record
	guest, err := GetGuestByName(db, "Unopened")
	assert.NoError(t, err)
	assert.True(t, guest.FirstOpenedAt.Valid)
}

func TestGetGuestByName_NotFound(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Test retrieval of non-existent guest
	guest, err := GetGuestByName(db, "NonExistent")
	assert.NoError(t, err)
	assert.Nil(t, guest)
}



func TestGuestUpdate_NonExistent(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Try to update a guest with non-existent ID
	guest := &Guest{ID: 99999, Name: "Ghost"}
	err := guest.Update(db)
	assert.Error(t, err)
	assert.Equal(t, sql.ErrNoRows, err)
}

func TestGetAllGuests_Empty(t *testing.T) {
	db := setupDB(t)
	t.Cleanup(func() { db.Close() })

	// Test on empty database
	guests, err := GetAllGuests(db)
	assert.NoError(t, err)
	assert.Len(t, guests, 0)
}
