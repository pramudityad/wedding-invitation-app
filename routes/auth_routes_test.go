package routes

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"wedding-invitation-backend/models"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestHealthEndpoint(t *testing.T) {
	router, w := setupTestRouter(nil, nil)
	c := setupTestContainer(nil, nil)
	SetupAuthRoutes(router, c)

	req := httptest.NewRequest("GET", "/health", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "ok")
}

func TestLoginEndpoint_ValidGuest(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "John Doe", name)
			return createTestGuest("John Doe"), nil
		},
	}

	router, w := setupTestRouter(mockGuest, nil)
	c := setupTestContainer(mockGuest, nil)
	SetupAuthRoutes(router, c)

	encodedName := url.PathEscape("John Doe")
	req := httptest.NewRequest("GET", "/login/"+encodedName, nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "token")
	assert.Contains(t, w.Body.String(), "Welcome")
}

func TestLoginEndpoint_GuestNotFound(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return nil, nil // Guest not found
		},
	}

	router, w := setupTestRouter(mockGuest, nil)
	c := setupTestContainer(mockGuest, nil)
	SetupAuthRoutes(router, c)

	req := httptest.NewRequest("GET", "/login/UnknownPerson", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "couldn't find your name")
}

func TestLoginEndpoint_ServiceError(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return nil, assert.AnError
		},
	}

	router, w := setupTestRouter(mockGuest, nil)
	c := setupTestContainer(mockGuest, nil)
	SetupAuthRoutes(router, c)

	req := httptest.NewRequest("GET", "/login/TestUser", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.Contains(t, w.Body.String(), "trouble accessing the guest list")
}
