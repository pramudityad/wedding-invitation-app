package routes

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"
	"wedding-invitation-backend/config"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestBulkGuestUpload_Success(t *testing.T) {
	setupTestConfig()
	config.AdminAPIKey = "test-api-key"

	mockGuest := &mockGuestService{
		BulkCreateGuestsFunc: func(guests []models.Guest) error {
			assert.Equal(t, 2, len(guests))
			assert.Equal(t, "Alice", guests[0].Name)
			assert.Equal(t, "Bob", guests[1].Name)
			return nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil, nil)
	c := setupTestContainer(mockGuest, nil, nil)
	SetupGuestRoutes(router.Group("/admin"), c)

	// Create multipart form with CSV file
	csvContent := "name,attending,plus_ones,dietary_restrictions\nAlice,true,1,None\nBob,false,0,Vegetarian\n"
	body := &bytes.Buffer{}
	writer := createMultipartForm(body, "file", "guests.csv", csvContent)

	req := httptest.NewRequest("POST", "/admin/guests/bulk", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("X-API-Key", "test-api-key")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Successfully uploaded")
}

func TestBulkGuestUpload_MissingFile(t *testing.T) {
	setupTestConfig()
	config.AdminAPIKey = "test-api-key"

	router, _ := setupTestRouter(nil, nil, nil)
	c := setupTestContainer(nil, nil, nil)
	SetupGuestRoutes(router.Group("/admin"), c)

	req := httptest.NewRequest("POST", "/admin/guests/bulk", nil)
	req.Header.Set("Content-Type", "multipart/form-data")
	req.Header.Set("X-API-Key", "test-api-key")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Please select a CSV file")
}

func TestBulkGuestUpload_EmptyCSV(t *testing.T) {
	setupTestConfig()
	config.AdminAPIKey = "test-api-key"

	mockGuest := &mockGuestService{}

	router, _ := setupTestRouter(mockGuest, nil, nil)
	c := setupTestContainer(mockGuest, nil, nil)
	SetupGuestRoutes(router.Group("/admin"), c)

	// CSV with only header, no data rows
	csvContent := "name,attending,plus_ones,dietary_restrictions\n"
	body := &bytes.Buffer{}
	writer := createMultipartForm(body, "file", "guests.csv", csvContent)

	req := httptest.NewRequest("POST", "/admin/guests/bulk", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("X-API-Key", "test-api-key")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "empty")
}

func TestBulkGuestUpdate_Success(t *testing.T) {
	setupTestConfig()
	config.AdminAPIKey = "test-api-key"

	mockGuest := &mockGuestService{
		BulkUpdateGuestsFunc: func(guests []models.Guest) error {
			assert.Equal(t, 2, len(guests))
			return nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil, nil)
	c := setupTestContainer(mockGuest, nil, nil)
	SetupGuestRoutes(router.Group("/admin"), c)

	guests := []models.Guest{
		{ID: 1, Name: "Alice", Attending: sql.NullBool{Bool: true, Valid: true}, PlusOnes: 1},
		{ID: 2, Name: "Bob", Attending: sql.NullBool{Bool: false, Valid: true}, PlusOnes: 0},
	}
	jsonBody, _ := json.Marshal(guests)

	req := httptest.NewRequest("PUT", "/admin/guests/bulk", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", "test-api-key")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Successfully updated")
}

func TestBulkGuestUpdate_EmptyData(t *testing.T) {
	setupTestConfig()
	config.AdminAPIKey = "test-api-key"

	router, _ := setupTestRouter(nil, nil, nil)
	c := setupTestContainer(nil, nil, nil)
	SetupGuestRoutes(router.Group("/admin"), c)

	jsonBody, _ := json.Marshal([]models.Guest{})

	req := httptest.NewRequest("PUT", "/admin/guests/bulk", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", "test-api-key")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "No guest data provided")
}

func TestGetAllRSVPs_Success(t *testing.T) {
	setupTestConfig()
	config.AdminAPIKey = "test-api-key"

	mockGuest := &mockGuestService{
		GetAllGuestsFunc: func() ([]models.Guest, error) {
			return []models.Guest{
				{Name: "Alice", Attending: sql.NullBool{Bool: true, Valid: true}},
				{Name: "Bob", Attending: sql.NullBool{Bool: false, Valid: true}},
			}, nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil, nil)
	c := setupTestContainer(mockGuest, nil, nil)
	SetupGuestRoutes(router.Group("/admin"), c)
	router.GET("/admin/rsvps", handleGetAllRSVPs(c))

	req := httptest.NewRequest("GET", "/admin/rsvps", nil)
	req.Header.Set("X-API-Key", "test-api-key")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "rsvps")
	assert.Contains(t, w.Body.String(), "count")
}

// Helper function to create multipart form data
func createMultipartForm(body *bytes.Buffer, fieldName, filename, content string) *multipart.Writer {
	writer := multipart.NewWriter(body)
	part, _ := writer.CreateFormFile(fieldName, filename)
	part.Write([]byte(content))
	writer.Close()
	return writer
}
