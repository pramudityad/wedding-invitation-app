package auth

import (
	"database/sql"
	"net/http/httptest"
	"testing"
	"time"
	"wedding-invitation-backend/config"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/services"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

// mockGuestService implements services.GuestServiceInterface for testing
type mockGuestService struct {
	GetGuestByNameFunc       func(name string) (*models.Guest, error)
	GetAllGuestsFunc         func() ([]models.Guest, error)
	CreateGuestFunc          func(guest *models.Guest) error
	UpdateGuestFunc          func(guest *models.Guest) error
	BulkCreateGuestsFunc     func(guests []models.Guest) error
	BulkUpdateGuestsFunc     func(guests []models.Guest) error
	MarkInvitationOpenedFunc func(name string) error
	ValidateGuestAccessFunc  func(name string) (*models.Guest, error)
}

func (m *mockGuestService) GetGuestByName(name string) (*models.Guest, error) {
	if m.GetGuestByNameFunc != nil {
		return m.GetGuestByNameFunc(name)
	}
	return nil, nil
}

func (m *mockGuestService) GetAllGuests() ([]models.Guest, error) {
	if m.GetAllGuestsFunc != nil {
		return m.GetAllGuestsFunc()
	}
	return nil, nil
}

func (m *mockGuestService) CreateGuest(guest *models.Guest) error {
	if m.CreateGuestFunc != nil {
		return m.CreateGuestFunc(guest)
	}
	return nil
}

func (m *mockGuestService) UpdateGuest(guest *models.Guest) error {
	if m.UpdateGuestFunc != nil {
		return m.UpdateGuestFunc(guest)
	}
	return nil
}

func (m *mockGuestService) BulkCreateGuests(guests []models.Guest) error {
	if m.BulkCreateGuestsFunc != nil {
		return m.BulkCreateGuestsFunc(guests)
	}
	return nil
}

func (m *mockGuestService) BulkUpdateGuests(guests []models.Guest) error {
	if m.BulkUpdateGuestsFunc != nil {
		return m.BulkUpdateGuestsFunc(guests)
	}
	return nil
}

func (m *mockGuestService) MarkInvitationOpened(name string) error {
	if m.MarkInvitationOpenedFunc != nil {
		return m.MarkInvitationOpenedFunc(name)
	}
	return nil
}

func (m *mockGuestService) ValidateGuestAccess(name string) (*models.Guest, error) {
	if m.ValidateGuestAccessFunc != nil {
		return m.ValidateGuestAccessFunc(name)
	}
	return nil, nil
}

func init() {
	gin.SetMode(gin.TestMode)
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	m.Run()
}

func TestJWTMiddlewareWithService_ValidToken(t *testing.T) {
	// Setup config
	config.JWTSecret = "test-secret"
	config.JWTExpiry = 3600

	// Create mock service
	mockSvc := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "testuser", name)
			return &models.Guest{Name: name}, nil
		},
	}

	// Generate valid token
	token, err := GenerateToken("testuser")
	assert.NoError(t, err)

	// Setup router
	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(JWTMiddlewareWithService(mockSvc))
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	// Make request
	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
}

func TestJWTMiddlewareWithService_MissingToken(t *testing.T) {
	config.JWTSecret = "test-secret"

	mockSvc := &mockGuestService{}

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(JWTMiddlewareWithService(mockSvc))
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
	assert.Contains(t, w.Body.String(), "Authorization header required")
}

func TestJWTMiddlewareWithService_MalformedToken(t *testing.T) {
	config.JWTSecret = "test-secret"

	mockSvc := &mockGuestService{}

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(JWTMiddlewareWithService(mockSvc))
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer invalid_token_here")
	router.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
	assert.Contains(t, w.Body.String(), "verifying your login")
}

func TestJWTMiddlewareWithService_ExpiredToken(t *testing.T) {
	config.JWTSecret = "test-secret"

	mockSvc := &mockGuestService{}

	// Create an expired token manually
	claims := &Claims{
		Username: "testuser",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-24 * time.Hour)), // Expired yesterday
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(JWTMiddlewareWithService(mockSvc))
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)
	router.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
	assert.Contains(t, w.Body.String(), "verifying your login")
}

func TestJWTMiddlewareWithService_GuestNotFound(t *testing.T) {
	config.JWTSecret = "test-secret"
	config.JWTExpiry = 3600

	// Mock returns nil guest (access revoked)
	mockSvc := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return nil, nil
		},
	}

	token, err := GenerateToken("testuser")
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(JWTMiddlewareWithService(mockSvc))
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(w, req)

	assert.Equal(t, 403, w.Code)
	assert.Contains(t, w.Body.String(), "access has been revoked")
}

func TestJWTMiddlewareWithService_ValidateGuestAccessError(t *testing.T) {
	config.JWTSecret = "test-secret"
	config.JWTExpiry = 3600

	// Mock returns error
	mockSvc := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return nil, assert.AnError
		},
	}

	token, err := GenerateToken("testuser")
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(JWTMiddlewareWithService(mockSvc))
	router.GET("/test", func(c *gin.Context) {
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(w, req)

	assert.Equal(t, 500, w.Code)
	assert.Contains(t, w.Body.String(), "verifying your access")
}

func TestGenerateToken(t *testing.T) {
	config.JWTSecret = "test-secret"
	config.JWTExpiry = 3600

	token, err := GenerateToken("alice")
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Verify token is parseable
	claims := &Claims{}
	parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JWTSecret), nil
	})
	assert.NoError(t, err)
	assert.True(t, parsedToken.Valid)
	assert.Equal(t, "alice", claims.Username)
}

// Compile-time check to ensure mock implements interface
var _ services.GuestServiceInterface = (*mockGuestService)(nil)

// Test with sql.NullBool for completeness
func TestJWTMiddlewareWithService_ValidTokenWithFullGuest(t *testing.T) {
	config.JWTSecret = "test-secret"
	config.JWTExpiry = 3600

	mockSvc := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return &models.Guest{
				Name:      name,
				Attending: sql.NullBool{Bool: true, Valid: true},
				PlusOnes:  2,
			}, nil
		},
	}

	token, err := GenerateToken("testuser")
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	router.Use(JWTMiddlewareWithService(mockSvc))
	router.GET("/test", func(c *gin.Context) {
		username := c.MustGet("username").(string)
		assert.Equal(t, "testuser", username)
		c.Status(200)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
}
