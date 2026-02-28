package container

import (
	"database/sql"
	"time"
	"wedding-invitation-backend/cache"
	"wedding-invitation-backend/repositories"
	"wedding-invitation-backend/services"
)

// Container holds all application dependencies
type Container struct {
	GuestService   services.GuestServiceInterface
	CommentService services.CommentServiceInterface

	// Cache references for shutdown
	guestCache   cache.GuestCacheInterface
	commentCache cache.CacheInterface
}

// NewContainer creates and wires all dependencies
func NewContainer(db *sql.DB) *Container {
	// Create repositories
	guestRepo := repositories.NewSQLGuestRepository(db)
	commentRepo := repositories.NewSQLCommentRepository(db)

	// Create caches
	guestCache := cache.NewGuestCache(guestRepo)
	commentCache := cache.NewMemoryCache(2 * time.Minute)

	// Create services
	guestService := services.NewGuestService(guestRepo)
	commentService := services.NewCommentService(commentRepo, guestService)

	return &Container{
		GuestService:   guestService,
		CommentService: commentService,
		guestCache:     guestCache,
		commentCache:   commentCache,
	}
}

// Shutdown gracefully shuts down the container and releases resources
func (c *Container) Shutdown() {
	// Stop caches if they implement Stop()
	if c.guestCache != nil {
		c.guestCache.Stop()
	}
	if c.commentCache != nil {
		c.commentCache.Stop()
	}
}
