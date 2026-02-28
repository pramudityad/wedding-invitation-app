package routes

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"wedding-invitation-backend/models"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestRSVPSubmission_Attending(t *testing.T) {
	setupTestConfig()

	testGuest := &models.Guest{
		Name:      "John Doe",
		Attending: sql.NullBool{Bool: false, Valid: true},
		PlusOnes:  1,
	}

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return testGuest, nil
		},
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "John Doe", name)
			return testGuest, nil
		},
		UpdateGuestFunc: func(guest *models.Guest) error {
			assert.True(t, guest.Attending.Bool)
			return nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil)
	c := setupTestContainer(mockGuest, nil)
	SetupRSVPRoutes(router.Group("/"), c)

	token := generateTestToken("John Doe")
	body := map[string]interface{}{"name": "John Doe", "attending": true}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/rsvp", bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Thank you for confirming your attendance")
}

func TestRSVPSubmission_NotAttending(t *testing.T) {
	setupTestConfig()

	testGuest := &models.Guest{
		Name:      "Jane Doe",
		Attending: sql.NullBool{Bool: true, Valid: true},
		PlusOnes:  0,
	}

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return testGuest, nil
		},
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "Jane Doe", name)
			return testGuest, nil
		},
		UpdateGuestFunc: func(guest *models.Guest) error {
			assert.False(t, guest.Attending.Bool)
			return nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil)
	c := setupTestContainer(mockGuest, nil)
	SetupRSVPRoutes(router.Group("/"), c)

	token := generateTestToken("Jane Doe")
	body := map[string]interface{}{"name": "Jane Doe", "attending": false}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/rsvp", bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Thank you for letting us know")
}

func TestRSVPSubmission_GuestNotFound(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return createTestGuest("testuser"), nil
		},
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return nil, nil // Guest not found
		},
	}

	router, _ := setupTestRouter(mockGuest, nil)
	c := setupTestContainer(mockGuest, nil)
	SetupRSVPRoutes(router.Group("/"), c)

	token := generateTestToken("testuser")
	body := map[string]interface{}{"name": "Unknown Person", "attending": true}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/rsvp", bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "couldn't find your guest information")
}

func TestRSVPSubmission_InvalidRequest(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return createTestGuest("testuser"), nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil)
	c := setupTestContainer(mockGuest, nil)
	SetupRSVPRoutes(router.Group("/"), c)

	token := generateTestToken("testuser")
	body := map[string]interface{}{} // Missing required 'name' field
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/rsvp", bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Please provide valid RSVP information")
}
