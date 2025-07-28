package routes

import (
	"net/http"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/middleware/auth"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(r *gin.Engine) {
	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// Login endpoint
	r.POST("/login", func(c *gin.Context) {
		var login struct {
			Name string `json:"name" binding:"required"`
		}
		if err := c.ShouldBindJSON(&login); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Name is required"})
			return
		}

		// Check if user is on guest list
		guest, err := models.GetGuestByName(database.DB, login.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error checking guest list",
			})
			return
		}

		if guest == nil {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "You are not on the guest list",
			})
			return
		}

		token, err := auth.GenerateToken(guest.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
	})
}
