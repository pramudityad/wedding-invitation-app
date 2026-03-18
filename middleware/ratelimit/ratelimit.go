package ratelimit

import (
	"fmt"
	"net/http"
	"wedding-invitation-backend/ratelimit"

	"github.com/gin-gonic/gin"
)

// KeyFunc extracts a rate limit key from the request
type KeyFunc func(c *gin.Context) string

// Middleware creates a rate limiting middleware with default IP-based key
func Middleware(limiter *ratelimit.SlidingWindowLimiter) gin.HandlerFunc {
	return MiddlewareWithKeyFunc(limiter, func(c *gin.Context) string {
		return c.ClientIP()
	})
}

// MiddlewareWithKeyFunc creates a rate limiting middleware with custom key function
func MiddlewareWithKeyFunc(limiter *ratelimit.SlidingWindowLimiter, keyFunc KeyFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := keyFunc(c)

		// Set rate limit headers
		c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", limiter.MaxRequests()))
		c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", limiter.Remaining(key)))

		if !limiter.Allow(key) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"code":    http.StatusTooManyRequests,
				"message": "Too many requests. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// UserKeyFunc creates a key function based on authenticated user
func UserKeyFunc() KeyFunc {
	return func(c *gin.Context) string {
		if username, exists := c.Get("username"); exists {
			return fmt.Sprintf("user:%s", username)
		}
		return fmt.Sprintf("ip:%s", c.ClientIP())
	}
}
