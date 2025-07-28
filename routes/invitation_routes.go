package routes

import (
	"log"
	"net/http"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupInvitationRoutes(r *gin.RouterGroup) {
	r.POST("/mark-opened", handleMarkOpened)
}

func handleMarkOpened(c *gin.Context) {
	username := c.MustGet("username").(string)

	if err := models.MarkInvitationOpened(database.DB, username); err != nil {
		log.Printf("Error marking invitation opened: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to track opening"})
		return
	}

	log.Printf("Successfully recorded invitation opening for: %s", username)
	c.JSON(http.StatusOK, gin.H{"status": "Invitation opening recorded"})
}
