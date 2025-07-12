package routes

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/middleware/apikey"
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
				"message": username,
				"status":  "protected",
			})
		})

		// Guest management routes
		protected.GET("/guests", handleGetGuestByName)

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

		protected.POST("/mark-opened", handleMarkOpened)
	}

	// Admin routes with API key authentication
	admin := r.Group("/admin")
	admin.Use(apikey.APIKeyMiddleware())
	SetupGuestRoutes(admin)
	admin.GET("/rsvps", handleGetAllRSVPs)
}

type rsvpRequest struct {
	Name      string `json:"name" binding:"required"`
	Attending bool   `json:"attending"`
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

func handleGetGuestByName(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name parameter is required"})
		return
	}

	guest, err := models.GetGuestByName(database.DB, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch guest"})
		return
	}

	if guest == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
		return
	}

	c.JSON(http.StatusOK, guest)
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

func handleCommentSubmission(c *gin.Context) {
	type commentRequest struct {
		Content string `json:"content" binding:"required"`
	}
	var request commentRequest
	if err := c.ShouldBindJSON(&request); err != nil {
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

	// Check existing comment count
	count, err := models.GetCommentCountByGuestID(database.DB, guest.ID)
	if err != nil {
		log.Printf("Error checking comment count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check comment quota"})
		return
	}

	if count >= 2 {
		log.Printf("Guest %s has reached comment limit (2)", guest.Name)
		c.JSON(http.StatusForbidden, gin.H{"error": "Maximum of 2 comments allowed per guest"})
		return
	}

	comment := models.Comment{
		GuestID: guest.ID,
		Content: request.Content,
	}
	if err := comment.Create(database.DB); err != nil {
		log.Printf("Failed to create comment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	log.Printf("Successfully created comment for guest %s", username)

	// Get guest name for the response
	guest, err = models.GetGuestByName(database.DB, username)
	if err != nil {
		log.Printf("Error getting guest for comment response: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get guest info"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment created successfully",
		"comment": gin.H{
			"ID":        comment.ID,
			"Content":   comment.Content,
			"CreatedAt": comment.CreatedAt,
			"GuestID":   comment.GuestID,
			"GuestName": guest.Name,
		},
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
	// Parse limit from query, default 20, max 100
	limitStr := c.DefaultQuery("limit", "20")
	cursor := c.Query("cursor")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 20
	} else if limit > 100 {
		limit = 100
	}

	paginatedComments, err := models.GetAllCommentsWithGuests(database.DB, limit, cursor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, paginatedComments)
}
