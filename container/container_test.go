package container

import (
	"database/sql"
	"testing"

	_ "modernc.org/sqlite"
	"wedding-invitation-backend/services"
)

// TestNewContainer_ReturnsNonNilServices verifies that NewContainer creates
// a container with non-nil services
func TestNewContainer_ReturnsNonNilServices(t *testing.T) {
	// Create in-memory database for testing
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	// Create container
	container := NewContainer(db)

	// Verify services are non-nil
	if container.GuestService == nil {
		t.Error("GuestService should not be nil")
	}
	if container.CommentService == nil {
		t.Error("CommentService should not be nil")
	}
	if container.guestCache == nil {
		t.Error("guestCache should not be nil")
	}
	if container.commentCache == nil {
		t.Error("commentCache should not be nil")
	}
}

// TestContainerServices_SatisfyInterfaces verifies that container services
// implement the expected interfaces
func TestContainerServices_SatisfyInterfaces(t *testing.T) {
	// Create in-memory database for testing
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	// Create container
	container := NewContainer(db)

	// Verify GuestService implements GuestServiceInterface
	var _ services.GuestServiceInterface = container.GuestService

	// Verify CommentService implements CommentServiceInterface
	var _ services.CommentServiceInterface = container.CommentService
}

// TestShutdown_DoesNotPanic verifies that Shutdown() doesn't panic
func TestShutdown_DoesNotPanic(t *testing.T) {
	// Create in-memory database for testing
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	// Create container
	container := NewContainer(db)

	// Call Shutdown and verify it doesn't panic
	func() {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("Shutdown() panicked: %v", r)
			}
		}()
		container.Shutdown()
	}()
}
