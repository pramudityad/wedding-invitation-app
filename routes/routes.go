package routes

import (
	"database/sql"
	"log"
	"net/http"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/middleware/auth"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/spotify"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Public routes
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

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

	// RSVP routes
	r.POST("/rsvp", handleRSVPSubmission)

	// Protected routes
	protected := r.Group("/")
	protected.Use(auth.JWTMiddleware())
	{
		protected.GET("/protected", func(c *gin.Context) {
			username := c.MustGet("username").(string)
			c.JSON(http.StatusOK, gin.H{
				"message": "Hello " + username,
				"status":  "protected",
			})
		})

		protected.GET("/admin/rsvps", handleGetAllRSVPs)

		// Guest management routes
		guestRoutes := protected.Group("/admin/guests")
		SetupGuestRoutes(guestRoutes)

		// Comment routes
		protected.POST("/comments", handleCommentSubmission)
		protected.GET("/comments/me", handleGetMyComments)
		protected.GET("/comments", handleGetAllComments)

		// Spotify routes
		protected.GET("/spotify/auth", spotify.AuthHandler)
		protected.GET("/spotify/callback", spotify.CallbackHandler)
		protected.GET("/spotify/playlists", func(c *gin.Context) {
			client := spotify.GetClient()
			if client == nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated with Spotify"})
				return
			}

			playlists, err := client.CurrentUsersPlaylists(c)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get playlists"})
				return
			}

			c.JSON(http.StatusOK, playlists)
		})

		protected.POST("/spotify/play", func(c *gin.Context) {
			client := spotify.GetClient()
			if client == nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated with Spotify"})
				return
			}

			err := client.Play(c)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start playback"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"status": "playback started"})
		})

		protected.POST("/spotify/pause", func(c *gin.Context) {
			client := spotify.GetClient()
			if client == nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated with Spotify"})
				return
			}

			err := client.Pause(c)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to pause playback"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"status": "playback paused"})
		})
	}
}

func handleRSVPSubmission(c *gin.Context) {
	var guest models.Guest
	if err := c.ShouldBindJSON(&guest); err != nil {
		log.Printf("Invalid request data: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	log.Printf("Processing RSVP for %s", guest.Name)

	// Check if guest exists
	existingGuest, err := models.GetGuestByName(database.DB, guest.Name)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("Database error checking guest: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if existingGuest == nil {
		// New RSVP
		log.Printf("Creating new RSVP for %s", guest.Name)
		if err := guest.Create(database.DB); err != nil {
			log.Printf("Failed to create RSVP: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create RSVP"})
			return
		}
		log.Printf("Successfully created RSVP for %s", guest.Name)
	} else {
		// Update existing RSVP
		log.Printf("Updating existing RSVP for %s (ID: %d)", guest.Name, existingGuest.ID)
		guest.ID = existingGuest.ID
		if err := guest.Update(database.DB); err != nil {
			log.Printf("Failed to update RSVP: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update RSVP"})
			return
		}
		log.Printf("Successfully updated RSVP for %s", guest.Name)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "RSVP recorded successfully",
		"guest":   guest,
	})
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

func handleCommentSubmission(c *gin.Context) {
	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		log.Printf("Invalid comment data: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Get guest ID from JWT claims
	username := c.MustGet("username").(string)
	guest, err := models.GetGuestByName(database.DB, username)
	if err != nil {
		log.Printf("Error finding guest %s: %v", username, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find guest"})
		return
	}
	if guest == nil {
		log.Printf("No guest found with name %s", username)
		c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
		return
	}

	comment.GuestID = guest.ID
	if err := comment.Create(database.DB); err != nil {
		log.Printf("Failed to create comment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	log.Printf("Successfully created comment for guest %s", username)
	c.JSON(http.StatusOK, gin.H{
		"message": "Comment created successfully",
		"comment": comment,
	})
}

func handleGetMyComments(c *gin.Context) {
	username := c.MustGet("username").(string)
	guest, err := models.GetGuestByName(database.DB, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find guest"})
		return
	}
	if guest == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
		return
	}

	comments, err := models.GetCommentsByGuestID(database.DB, guest.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count":    len(comments),
		"comments": comments,
	})
}

func handleGetAllComments(c *gin.Context) {
	comments, err := models.GetAllComments(database.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count":    len(comments),
		"comments": comments,
	})
}
