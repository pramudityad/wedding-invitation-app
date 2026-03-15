package errorhandler

import (
	"log"
	"net/http"
	"wedding-invitation-backend/errors"

	"github.com/gin-gonic/gin"
)

// ErrorHandler creates a middleware that catches errors and returns consistent JSON responses
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Add panic recovery
		defer func() {
			if recovered := recover(); recovered != nil {
				log.Printf("Panic recovered: %v", recovered)
				c.JSON(http.StatusInternalServerError, gin.H{
					"code":    http.StatusInternalServerError,
					"message": "Internal server error",
				})
				c.Abort()
			}
		}()

		c.Next()

		// Process any errors collected during request handling
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// Check if it's our AppError type
			if appErr, ok := errors.IsAppError(err); ok {
				response := gin.H{
					"code":    appErr.Code,
					"message": appErr.Message,
				}
				if appErr.Details != nil {
					response["details"] = appErr.Details
				}
				c.JSON(appErr.Code, response)
				return
			}

			// Generic error response
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    http.StatusInternalServerError,
				"message": "Internal server error",
			})
		}
	}
}
