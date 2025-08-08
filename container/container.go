package container

import (
	"database/sql"
	"wedding-invitation-backend/repositories"
	"wedding-invitation-backend/services"
)

// Container holds all application dependencies
type Container struct {
	GuestService   *services.GuestService
	CommentService *services.CommentService
}

// NewContainer creates and wires all dependencies
func NewContainer(db *sql.DB) *Container {
	// Create repositories
	guestRepo := repositories.NewSQLGuestRepository(db)
	commentRepo := repositories.NewSQLCommentRepository(db)
	
	// Create services
	guestService := services.NewGuestService(guestRepo)
	commentService := services.NewCommentService(commentRepo, guestService)
	
	return &Container{
		GuestService:   guestService,
		CommentService: commentService,
	}
}