package routes

import (
	"net/http"
	"wedding-invitation-backend/container"
	"wedding-invitation-backend/errors"
	"wedding-invitation-backend/middleware/apikey"
	"wedding-invitation-backend/middleware/auth"
	"wedding-invitation-backend/middleware/errorhandler"
	ratelimitmw "wedding-invitation-backend/middleware/ratelimit"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, c *container.Container) {
	// Global error handler (must be first)
	r.Use(errorhandler.ErrorHandler())

	// Setup auth routes with rate limiting
	SetupAuthRoutes(r, c)

	// Setup RSVP routes with rate limiting
	rsvpGroup := r.Group("/")
	rsvpGroup.Use(auth.JWTMiddlewareWithService(c.GuestService))
	rsvpGroup.Use(ratelimitmw.MiddlewareWithKeyFunc(
		c.RSVPLimiter,
		ratelimitmw.UserKeyFunc(),
	))
	SetupRSVPRoutes(rsvpGroup, c)

	// Protected routes
	protected := r.Group("/")
	protected.Use(auth.JWTMiddlewareWithService(c.GuestService))
	{
		protected.GET("/protected", func(ctx *gin.Context) {
			username := ctx.MustGet("username").(string)
			ctx.JSON(http.StatusOK, gin.H{
				"message": username,
				"status":  "protected",
			})
		})

		// Setup guest management routes
		SetupGuestManagementRoutes(protected, c)

		// Setup comment routes with rate limiting
		commentGroup := protected.Group("/")
		commentGroup.Use(ratelimitmw.MiddlewareWithKeyFunc(
			c.CommentLimiter,
			ratelimitmw.UserKeyFunc(),
		))
		SetupCommentRoutes(commentGroup, c)

		// Setup invitation routes
		SetupInvitationRoutes(protected, c)
	}

	// Admin routes with API key authentication
	admin := r.Group("/admin")
	admin.Use(apikey.APIKeyMiddleware())
	SetupGuestRoutes(admin, c)
	admin.GET("/rsvps", handleGetAllRSVPs(c))
}

func handleGetAllRSVPs(container *container.Container) gin.HandlerFunc {
	return func(c *gin.Context) {
		guests, err := container.GuestService.GetAllGuests()
		if err != nil {
			c.Error(errors.WrapError(err, "Failed to retrieve RSVPs"))
			c.Abort()
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"count": len(guests),
			"rsvps": guests,
		})
	}
}
