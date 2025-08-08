package routes

import (
	"net/http"
	"net/url"
	"wedding-invitation-backend/container"
	"wedding-invitation-backend/middleware/auth"

	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(r *gin.Engine, c *container.Container) {
	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// Login endpoint
	r.GET("/login/:name", func(ctx *gin.Context) {
		name := ctx.Param("name")
		decodedName, err := url.PathUnescape(name)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid name encoding"})
			return
		}

		// Check if user is on guest list using service
		guest, err := c.GuestService.GetGuestByName(decodedName)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "We're having trouble accessing the guest list right now. Please try again in a moment.",
			})
			return
		}

		if guest == nil {
			ctx.JSON(http.StatusForbidden, gin.H{
				"error": "We couldn't find your name on our guest list. Please check the spelling or contact us if you believe this is an error.",
			})
			return
		}

		token, err := auth.GenerateToken(guest.Name)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "We're experiencing technical difficulties. Please try logging in again.",
			})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{
			"token": token,
			"message": "Welcome! You're successfully logged in.",
		})
	})
}
