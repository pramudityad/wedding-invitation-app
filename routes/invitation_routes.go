package routes

import (
	"log"
	"net/http"
	"wedding-invitation-backend/container"

	"github.com/gin-gonic/gin"
)

func SetupInvitationRoutes(r *gin.RouterGroup, c *container.Container) {
	r.POST("/mark-opened", handleMarkOpened(c))
}

func handleMarkOpened(container *container.Container) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.MustGet("username").(string)

		if err := container.GuestService.MarkInvitationOpened(username); err != nil {
			log.Printf("Error marking invitation opened: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "We're having trouble tracking your invitation. This won't affect your access.",
			})
			return
		}

		log.Printf("Successfully recorded invitation opening for: %s", username)
		c.JSON(http.StatusOK, gin.H{
			"status": "Welcome! Your invitation has been opened.",
		})
	}
}
