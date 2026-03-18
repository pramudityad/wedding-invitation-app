package routes

import (
	"net/http"
	"wedding-invitation-backend/container"
	"wedding-invitation-backend/middleware/auth"
	ratelimitmw "wedding-invitation-backend/middleware/ratelimit"

	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(r *gin.Engine, c *container.Container) {
	// Health check (public, no rate limit)
	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// Login route with rate limiting
	r.GET("/login/:name",
		ratelimitmw.Middleware(c.AuthLimiter),
		handleLogin(c),
	)
}

func handleLogin(c *container.Container) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		name := ctx.Param("name")

		if name == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Name is required"})
			return
		}

		// Check if user is on guest list using service
		guest, err := c.GuestService.GetGuestByName(name)
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
			"token":   token,
			"message": "Welcome! You're successfully logged in.",
		})
	}
}
