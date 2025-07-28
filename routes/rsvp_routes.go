package routes

import (
	"database/sql"
	"log"
	"net/http"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

type rsvpRequest struct {
	Name      string `json:"name" binding:"required"`
	Attending bool   `json:"attending"`
}

func SetupRSVPRoutes(r *gin.RouterGroup) {
	r.POST("/rsvp", handleRSVPSubmission)
}

func handleRSVPSubmission(c *gin.Context) {
	var request rsvpRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Printf("Invalid request data: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	log.Printf("Processing RSVP for %s", request.Name)

	// Check if guest exists
	existingGuest, err := models.GetGuestByName(database.DB, request.Name)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("Database error checking guest: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if existingGuest == nil {
		// Guest doesn't exist - not expecting this since login requires guest to exist
		log.Printf("Guest %s not found in database", request.Name)
		c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
		return
	}

	// Update only the attending status
	existingGuest.Attending = sql.NullBool{Bool: request.Attending, Valid: true}
	log.Printf("Updating RSVP for %s to %t", request.Name, request.Attending)
	if err := existingGuest.Update(database.DB); err != nil {
		log.Printf("Failed to update RSVP: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update RSVP"})
		return
	}
	log.Printf("Successfully updated RSVP for %s", request.Name)

	c.JSON(http.StatusOK, gin.H{
		"message": "RSVP recorded successfully",
		"guest":   existingGuest,
	})
}
