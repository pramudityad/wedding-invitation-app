package routes

import (
	"net/http"
	"wedding-invitation-backend/container"
	"wedding-invitation-backend/middleware/apikey"
	"wedding-invitation-backend/middleware/auth"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, c *container.Container) {
	// Setup auth routes (health check and login)
	SetupAuthRoutes(r, c)

	// Setup RSVP routes
	rsvpGroup := r.Group("/")
	rsvpGroup.Use(auth.JWTMiddlewareWithService(c.GuestService))
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

		// Setup comment routes
		SetupCommentRoutes(protected, c)

		// Setup Spotify routes
		// SetupSpotifyRoutes(protected)

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
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Unable to retrieve RSVP information. Please try again.",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"count": len(guests),
			"rsvps": guests,
		})
	}
}
