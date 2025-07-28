package routes

import (
	"log"
	"net/http"
	"strconv"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupCommentRoutes(r *gin.RouterGroup) {
	r.POST("/comments", handleCommentSubmission)
	r.GET("/comments/me", handleGetMyComments)
	r.GET("/comments", handleGetAllComments)
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
