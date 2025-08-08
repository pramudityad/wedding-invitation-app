package auth

import (
	"net/http"
	"strings"
	"wedding-invitation-backend/config"
	"wedding-invitation-backend/services"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWTMiddlewareWithService creates JWT middleware that uses the guest service for validation
func JWTMiddlewareWithService(guestService *services.GuestService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		// Remove "Bearer " prefix if present
		if len(tokenString) > 7 && strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = tokenString[7:]
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.JWTSecret), nil
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "We're having trouble verifying your login. Please try logging in again.",
			})
			return
		}

		if !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Your session has expired. Please log in again.",
			})
			return
		}

		c.Set("username", claims.Username)

		// Check if user is on guest list using cached service
		guest, err := guestService.ValidateGuestAccess(claims.Username)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "We're having trouble verifying your access. Please try again.",
			})
			return
		}

		if guest == nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "Your access has been revoked. Please contact support if you believe this is an error.",
			})
			return
		}

		c.Next()
	}
}