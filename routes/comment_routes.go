package routes

import (
	"net/http"
	"strings"
	"wedding-invitation-backend/container"
	"wedding-invitation-backend/middleware/auth"

	"github.com/gin-gonic/gin"
)

type CreateCommentRequest struct {
	Content string `json:"content" binding:"required,min=1,max=1000"`
}

func SetupCommentRoutes(r *gin.RouterGroup, c *container.Container) {
	// Protected routes that require authentication
	authenticated := r.Group("")
	authenticated.Use(auth.JWTMiddleware())

	// POST /comments - Create a new comment
	authenticated.POST("/comments", func(ctx *gin.Context) {
		var req CreateCommentRequest
		if err := ctx.ShouldBindJSON(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request data",
				"details": err.Error(),
			})
			return
		}

		// Sanitize content
		content := strings.TrimSpace(req.Content)
		if len(content) == 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Comment content cannot be empty",
			})
			return
		}

		username, exists := ctx.Get("username")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		// Create comment using the service
		comment, err := c.CommentService.CreateComment(username.(string), content)
		if err != nil {
			// Check for specific maximum comment limit error
			if strings.Contains(err.Error(), "maximum comment limit reached") {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"error": "Maximum comment limit reached",
					"details": "Each guest can only have 2 comments maximum",
				})
				return
			}
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error creating comment",
				"details": err.Error(),
			})
			return
		}

		if comment == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Guest not found",
			})
			return
		}

		ctx.JSON(http.StatusCreated, gin.H{
			"message": "Comment created successfully",
			"comment": comment,
		})
	})

	// GET /comments/me - Get comments for authenticated user
	authenticated.GET("/comments/me", func(ctx *gin.Context) {
		username, exists := ctx.Get("username")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		// Get comments for this guest using the service
		comments, err := c.CommentService.GetCommentsByGuest(username.(string))
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error retrieving comments",
				"details": err.Error(),
			})
			return
		}

		if comments == nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Guest not found",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"comments": comments,
		})
	})

	// GET /comments - Get all comments
	r.GET("/comments", func(ctx *gin.Context) {
		// Get all comments using the service
		comments, err := c.CommentService.GetAllComments()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error retrieving comments",
				"details": err.Error(),
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"comments": comments,
		})
	})
}