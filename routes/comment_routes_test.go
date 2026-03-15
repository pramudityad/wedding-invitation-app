package routes

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"wedding-invitation-backend/models"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestCreateComment_Success(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return createTestGuest("testuser"), nil
		},
	}

	mockComment := &mockCommentService{
		CreateCommentFunc: func(guestName, content string) (*models.CommentWithGuest, error) {
			assert.Equal(t, "testuser", guestName)
			assert.Equal(t, "This is a great wedding!", content)
			return createTestComment(1, "testuser", content), nil
		},
	}

	router, _ := setupTestRouter(mockGuest, mockComment, nil)
	c := setupTestContainer(mockGuest, mockComment, nil)
	SetupCommentRoutes(router.Group("/"), c)

	token := generateTestToken("testuser")
	body := map[string]string{"content": "This is a great wedding!"}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/comments", bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "Comment created successfully")
}

func TestCreateComment_EmptyContent(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return createTestGuest("testuser"), nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil, nil)
	c := setupTestContainer(mockGuest, nil, nil)
	SetupCommentRoutes(router.Group("/"), c)

	token := generateTestToken("testuser")
	body := map[string]string{"content": "   "} // Whitespace only
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/comments", bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "cannot be empty")
}

func TestCreateComment_CommentLimitReached(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return createTestGuest("testuser"), nil
		},
	}

	mockComment := &mockCommentService{
		CreateCommentFunc: func(guestName, content string) (*models.CommentWithGuest, error) {
			return nil, models.ErrCommentLimitReached
		},
	}

	router, _ := setupTestRouter(mockGuest, mockComment, nil)
	c := setupTestContainer(mockGuest, mockComment, nil)
	SetupCommentRoutes(router.Group("/"), c)

	token := generateTestToken("testuser")
	body := map[string]string{"content": "Another comment"}
	jsonBody, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/comments", bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Maximum comment limit reached")
}

func TestGetCommentsByGuest_Success(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return createTestGuest("testuser"), nil
		},
	}

	mockComment := &mockCommentService{
		GetCommentsByGuestFunc: func(guestName string) ([]models.Comment, error) {
			assert.Equal(t, "testuser", guestName)
			return []models.Comment{
				{ID: 1, GuestID: 1, Content: "First comment", CreatedAt: time.Now()},
				{ID: 2, GuestID: 1, Content: "Second comment", CreatedAt: time.Now()},
			}, nil
		},
	}

	router, _ := setupTestRouter(mockGuest, mockComment, nil)
	c := setupTestContainer(mockGuest, mockComment, nil)
	SetupCommentRoutes(router.Group("/"), c)

	token := generateTestToken("testuser")
	req := httptest.NewRequest("GET", "/comments/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "comments")
}

func TestGetAllComments_Success(t *testing.T) {
	setupTestConfig()

	mockComment := &mockCommentService{
		GetAllCommentsWithGuestsFunc: func(limit int, cursor string) (*models.PaginatedComments, error) {
			assert.Equal(t, 10, limit)
			assert.Equal(t, "", cursor)
			return &models.PaginatedComments{
				Comments: []models.CommentWithGuest{
					*createTestComment(1, "Alice", "Beautiful wedding!"),
					*createTestComment(2, "Bob", "Congrats!"),
				},
				TotalCount: 2,
			}, nil
		},
	}

	router, _ := setupTestRouter(nil, mockComment, nil)
	c := setupTestContainer(nil, mockComment, nil)
	SetupCommentRoutes(router.Group("/"), c)

	req := httptest.NewRequest("GET", "/comments", nil)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "comments")
	assert.Contains(t, w.Body.String(), "total_count")
}

func TestGetAllComments_WithPagination(t *testing.T) {
	setupTestConfig()

	mockComment := &mockCommentService{
		GetAllCommentsWithGuestsFunc: func(limit int, cursor string) (*models.PaginatedComments, error) {
			assert.Equal(t, 5, limit)
			assert.Equal(t, "2024-01-01T00:00:00Z", cursor)
			return &models.PaginatedComments{
				Comments: []models.CommentWithGuest{
					*createTestComment(3, "Charlie", "Amazing!"),
				},
				TotalCount: 10,
				NextCursor: "2023-12-31T00:00:00Z",
			}, nil
		},
	}

	router, _ := setupTestRouter(nil, mockComment, nil)
	c := setupTestContainer(nil, mockComment, nil)
	SetupCommentRoutes(router.Group("/"), c)

	req := httptest.NewRequest("GET", "/comments?limit=5&cursor=2024-01-01T00:00:00Z", nil)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "next_cursor")
}

func TestGetGuestByName_Success(t *testing.T) {
	setupTestConfig()

	mockGuest := &mockGuestService{
		ValidateGuestAccessFunc: func(name string) (*models.Guest, error) {
			return createTestGuest("testuser"), nil
		},
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "John Doe", name)
			return &models.Guest{
				Name:      "John Doe",
				Attending: sql.NullBool{Bool: true, Valid: true},
				PlusOnes:  2,
			}, nil
		},
	}

	router, _ := setupTestRouter(mockGuest, nil, nil)
	c := setupTestContainer(mockGuest, nil, nil)
	SetupGuestManagementRoutes(router.Group("/"), c)

	token := generateTestToken("testuser")
	req := httptest.NewRequest("GET", "/guests?name=John+Doe", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "John Doe")
}
