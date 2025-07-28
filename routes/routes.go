package routes

import (
	"net/http"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/middleware/apikey"
	"wedding-invitation-backend/middleware/auth"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Setup auth routes (health check and login)
	SetupAuthRoutes(r)

	// Setup RSVP routes
	rsvpGroup := r.Group("/")
	rsvpGroup.Use(auth.JWTMiddleware())
	SetupRSVPRoutes(rsvpGroup)

	// Protected routes
	protected := r.Group("/")
	protected.Use(auth.JWTMiddleware())
	{
		protected.GET("/protected", func(c *gin.Context) {
			username := c.MustGet("username").(string)
			c.JSON(http.StatusOK, gin.H{
				"message": username,
				"status":  "protected",
			})
		})

		// Setup guest management routes
		SetupGuestManagementRoutes(protected)

		// Setup comment routes
		SetupCommentRoutes(protected)

		// Setup Spotify routes
		SetupSpotifyRoutes(protected)

		// Setup invitation routes
		SetupInvitationRoutes(protected)
	}

	// Admin routes with API key authentication
	admin := r.Group("/admin")
	admin.Use(apikey.APIKeyMiddleware())
	SetupGuestRoutes(admin)
	admin.GET("/rsvps", handleGetAllRSVPs)
}

func handleGetAllRSVPs(c *gin.Context) {
	guests, err := models.GetAllGuests(database.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch RSVPs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": len(guests),
		"rsvps": guests,
	})
}
