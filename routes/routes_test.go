package routes

import (
	"database/sql"
	"net/http/httptest"
	"wedding-invitation-backend/config"
	"wedding-invitation-backend/container"
	"wedding-invitation-backend/middleware/auth"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/services"

	"github.com/gin-gonic/gin"
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

// mockCommentService implements services.CommentServiceInterface for testing
type mockCommentService struct {
	CreateCommentFunc            func(guestName, content string) (*models.CommentWithGuest, error)
	GetCommentsByGuestFunc       func(guestName string) ([]models.Comment, error)
	GetAllCommentsFunc           func() ([]models.Comment, error)
	GetAllCommentsWithGuestsFunc func(limit int, cursor string) (*models.PaginatedComments, error)
}

func (m *mockCommentService) CreateComment(guestName, content string) (*models.CommentWithGuest, error) {
	if m.CreateCommentFunc != nil {
		return m.CreateCommentFunc(guestName, content)
	}
	return nil, nil
}

func (m *mockCommentService) GetCommentsByGuest(guestName string) ([]models.Comment, error) {
	if m.GetCommentsByGuestFunc != nil {
		return m.GetCommentsByGuestFunc(guestName)
	}
	return nil, nil
}

func (m *mockCommentService) GetAllComments() ([]models.Comment, error) {
	if m.GetAllCommentsFunc != nil {
		return m.GetAllCommentsFunc()
	}
	return nil, nil
}

func (m *mockCommentService) GetAllCommentsWithGuests(limit int, cursor string) (*models.PaginatedComments, error) {
	if m.GetAllCommentsWithGuestsFunc != nil {
		return m.GetAllCommentsWithGuestsFunc(limit, cursor)
	}
	return nil, nil
}

// Compile-time checks to ensure mocks implement interfaces
var _ services.GuestServiceInterface = (*mockGuestService)(nil)
var _ services.CommentServiceInterface = (*mockCommentService)(nil)

// setupTestRouter creates a gin router with mocked services for testing
func setupTestRouter(mockGuest *mockGuestService, mockComment *mockCommentService) (*gin.Engine, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	_, router := gin.CreateTestContext(w)
	return router, w
}

// setupTestContainer creates a test container with mocked services
func setupTestContainer(mockGuest *mockGuestService, mockComment *mockCommentService) *container.Container {
	return &container.Container{
		GuestService:   mockGuest,
		CommentService: mockComment,
	}
}

// setupTestConfig sets up config for JWT token generation
func setupTestConfig() {
	config.JWTSecret = "test-secret-key"
	config.JWTExpiry = 3600
}

// generateTestToken generates a valid JWT token for the given username
func generateTestToken(username string) string {
	token, err := auth.GenerateToken(username)
	if err != nil {
		panic("failed to generate test token: " + err.Error())
	}
	return token
}

// createTestGuest creates a Guest model for testing
func createTestGuest(name string) *models.Guest {
	return &models.Guest{
		Name:      name,
		Attending: sql.NullBool{Bool: true, Valid: true},
		PlusOnes:  1,
	}
}

// createTestComment creates a CommentWithGuest for testing
func createTestComment(id int64, guestName, content string) *models.CommentWithGuest {
	return &models.CommentWithGuest{
		Comment: models.Comment{
			ID:      id,
			Content: content,
		},
		GuestName: guestName,
	}
}
