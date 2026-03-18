package container

import (
	"database/sql"
	"wedding-invitation-backend/cache"
	"wedding-invitation-backend/config"
	"wedding-invitation-backend/ratelimit"
	"wedding-invitation-backend/repositories"
	"wedding-invitation-backend/services"
)

// Container holds all application dependencies
type Container struct {
	GuestService   services.GuestServiceInterface
	CommentService services.CommentServiceInterface

	// Rate limiters
	AuthLimiter    *ratelimit.SlidingWindowLimiter
	RSVPLimiter    *ratelimit.SlidingWindowLimiter
	CommentLimiter *ratelimit.SlidingWindowLimiter

	// Cache references for shutdown
	guestCache   cache.GuestCacheInterface
	commentCache cache.CacheInterface
}

// NewContainer creates and wires all dependencies
func NewContainer(db *sql.DB) *Container {
	// Create repositories
	guestRepo := repositories.NewSQLGuestRepository(db)
	commentRepo := repositories.NewSQLCommentRepository(db)

	// Create caches with config TTL
	guestCache := cache.NewGuestCache(guestRepo)
	commentCache := cache.NewMemoryCache(config.CacheCommentTTL)

	// Create services
	guestService := services.NewGuestService(guestRepo)
	commentService := services.NewCommentService(commentRepo, guestService)

	// Create rate limiters with config
	authLimiter := ratelimit.NewSlidingWindowLimiter(
		config.RateLimitAuthMax,
		config.RateLimitAuthWindow,
	)
	rsvpLimiter := ratelimit.NewSlidingWindowLimiter(
		config.RateLimitRSVPMax,
		config.RateLimitRSVPWindow,
	)
	commentLimiter := ratelimit.NewSlidingWindowLimiter(
		config.RateLimitCommentMax,
		config.RateLimitCommentWindow,
	)

	return &Container{
		GuestService:   guestService,
		CommentService: commentService,
		AuthLimiter:    authLimiter,
		RSVPLimiter:    rsvpLimiter,
		CommentLimiter: commentLimiter,
		guestCache:     guestCache,
		commentCache:   commentCache,
	}
}

// Shutdown gracefully shuts down the container
func (c *Container) Shutdown() {
	if c.guestCache != nil {
		c.guestCache.Stop()
	}
	if c.commentCache != nil {
		c.commentCache.Stop()
	}
}
