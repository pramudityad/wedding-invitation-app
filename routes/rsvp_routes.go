package routes

import (
	"database/sql"
	"log"
	"net/http"
	"wedding-invitation-backend/container"

	"github.com/gin-gonic/gin"
)

type rsvpRequest struct {
	Name      string `json:"name" binding:"required"`
	Attending bool   `json:"attending"`
}

func SetupRSVPRoutes(r *gin.RouterGroup, c *container.Container) {
	r.POST("/rsvp", handleRSVPSubmission(c))
}

func handleRSVPSubmission(container *container.Container) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request rsvpRequest
		if err := c.ShouldBindJSON(&request); err != nil {
			log.Printf("Invalid request data: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Please provide valid RSVP information.",
			})
			return
		}

		log.Printf("Processing RSVP for %s", request.Name)

		// Check if guest exists using service
		existingGuest, err := container.GuestService.GetGuestByName(request.Name)
		if err != nil {
			log.Printf("Database error checking guest: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "We're having trouble processing your RSVP. Please try again.",
			})
			return
		}

		if existingGuest == nil {
			log.Printf("Guest %s not found in database", request.Name)
			c.JSON(http.StatusNotFound, gin.H{
				"error": "We couldn't find your guest information. Please contact support.",
			})
			return
		}

		// Update only the attending status
		existingGuest.Attending = sql.NullBool{Bool: request.Attending, Valid: true}
		log.Printf("Updating RSVP for %s to %t", request.Name, request.Attending)
		if err := container.GuestService.UpdateGuest(existingGuest); err != nil {
			log.Printf("Failed to update RSVP: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Unable to save your RSVP. Please try again.",
			})
			return
		}
		log.Printf("Successfully updated RSVP for %s", request.Name)

		var statusMessage string
		if request.Attending {
			statusMessage = "Thank you for confirming your attendance! We can't wait to celebrate with you."
		} else {
			statusMessage = "Thank you for letting us know. We'll miss you but understand."
		}

		c.JSON(http.StatusOK, gin.H{
			"message": statusMessage,
			"guest":   existingGuest,
		})
	}
}
