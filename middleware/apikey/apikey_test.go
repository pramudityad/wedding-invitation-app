package apikey

import (
	"net/http/httptest"
	"testing"
	"wedding-invitation-backend/config"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	m.Run()
}

func TestAPIKeyMiddleware_ValidKey(t *testing.T) {
	config.AdminAPIKey = "test-api-key"

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(APIKeyMiddleware())
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("X-API-Key", "test-api-key")
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
}

func TestAPIKeyMiddleware_MissingKey(t *testing.T) {
	config.AdminAPIKey = "test-api-key"

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(APIKeyMiddleware())
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
	assert.Contains(t, w.Body.String(), "API key required")
}

func TestAPIKeyMiddleware_InvalidKey(t *testing.T) {
	config.AdminAPIKey = "correct-api-key"

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(APIKeyMiddleware())
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("X-API-Key", "wrong-api-key")
	router.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid API key")
}

func TestAPIKeyMiddleware_EmptyKey(t *testing.T) {
	config.AdminAPIKey = "test-api-key"

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(APIKeyMiddleware())
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("X-API-Key", "")
	router.ServeHTTP(w, req)

	// Empty key should be treated as missing
	assert.Equal(t, 401, w.Code)
	assert.Contains(t, w.Body.String(), "API key required")
}
