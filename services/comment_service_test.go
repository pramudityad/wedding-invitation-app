package services

import (
	"errors"
	"testing"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/repositories"

	"github.com/stretchr/testify/assert"
)

// mockCommentRepo implements repositories.CommentRepository using function fields
type mockCommentRepo struct {
	CreateFunc           func(comment *models.Comment) error
	GetByGuestIDFunc     func(guestID int64) ([]models.Comment, error)
	GetAllFunc           func() ([]models.Comment, error)
	GetAllWithGuestsFunc func(limit int, cursor string) (*models.PaginatedComments, error)
}

func (m *mockCommentRepo) Create(comment *models.Comment) error {
	if m.CreateFunc != nil {
		return m.CreateFunc(comment)
	}
	return nil
}

func (m *mockCommentRepo) GetByGuestID(guestID int64) ([]models.Comment, error) {
	if m.GetByGuestIDFunc != nil {
		return m.GetByGuestIDFunc(guestID)
	}
	return nil, nil
}

func (m *mockCommentRepo) GetAll() ([]models.Comment, error) {
	if m.GetAllFunc != nil {
		return m.GetAllFunc()
	}
	return nil, nil
}

func (m *mockCommentRepo) GetAllWithGuests(limit int, cursor string) (*models.PaginatedComments, error) {
	if m.GetAllWithGuestsFunc != nil {
		return m.GetAllWithGuestsFunc(limit, cursor)
	}
	return nil, nil
}

// Compile-time check
var _ repositories.CommentRepository = (*mockCommentRepo)(nil)

// mockGuestService implements GuestServiceInterface using function fields
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

// Compile-time check
var _ GuestServiceInterface = (*mockGuestService)(nil)

func TestCommentService_CreateComment_Success(t *testing.T) {
	guest := &models.Guest{
		ID:   1,
		Name: "john-doe",
	}
	mockGuestService := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "john-doe", name)
			return guest, nil
		},
	}
	mockRepo := &mockCommentRepo{
		CreateFunc: func(comment *models.Comment) error {
			assert.Equal(t, int64(1), comment.GuestID)
			assert.Equal(t, "Hello world", comment.Content)
			comment.ID = 100 // Simulate DB assigning ID
			return nil
		},
	}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	result, err := service.CreateComment("john-doe", "Hello world")

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, int64(100), result.ID)
	assert.Equal(t, int64(1), result.GuestID)
	assert.Equal(t, "Hello world", result.Content)
	assert.Equal(t, "john-doe", result.GuestName)
}

func TestCommentService_CreateComment_GuestNotFound(t *testing.T) {
	mockGuestService := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return nil, nil // Guest not found
		},
	}
	mockRepo := &mockCommentRepo{}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	result, err := service.CreateComment("unknown", "Hello world")

	assert.NoError(t, err)
	assert.Nil(t, result)
}

func TestCommentService_CreateComment_GuestServiceError(t *testing.T) {
	expectedErr := errors.New("database error")
	mockGuestService := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return nil, expectedErr
		},
	}
	mockRepo := &mockCommentRepo{}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	result, err := service.CreateComment("john-doe", "Hello world")

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, result)
}

func TestCommentService_CreateComment_RepoError(t *testing.T) {
	guest := &models.Guest{
		ID:   1,
		Name: "john-doe",
	}
	expectedErr := errors.New("insert failed")
	mockGuestService := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return guest, nil
		},
	}
	mockRepo := &mockCommentRepo{
		CreateFunc: func(comment *models.Comment) error {
			return expectedErr
		},
	}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	result, err := service.CreateComment("john-doe", "Hello world")

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, result)
}

func TestCommentService_GetCommentsByGuest_CacheMiss(t *testing.T) {
	guest := &models.Guest{
		ID:   1,
		Name: "john-doe",
	}
	expectedComments := []models.Comment{
		{ID: 1, GuestID: 1, Content: "First comment"},
		{ID: 2, GuestID: 1, Content: "Second comment"},
	}
	repoCallCount := 0
	mockGuestService := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return guest, nil
		},
	}
	mockRepo := &mockCommentRepo{
		GetByGuestIDFunc: func(guestID int64) ([]models.Comment, error) {
			repoCallCount++
			assert.Equal(t, int64(1), guestID)
			return expectedComments, nil
		},
	}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	comments, err := service.GetCommentsByGuest("john-doe")

	assert.NoError(t, err)
	assert.Equal(t, expectedComments, comments)
	assert.Equal(t, 1, repoCallCount, "Repository should be called once on cache miss")
}

func TestCommentService_GetCommentsByGuest_CacheHit(t *testing.T) {
	guest := &models.Guest{
		ID:   1,
		Name: "john-doe",
	}
	expectedComments := []models.Comment{
		{ID: 1, GuestID: 1, Content: "First comment"},
	}
	repoCallCount := 0
	mockGuestService := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return guest, nil
		},
	}
	mockRepo := &mockCommentRepo{
		GetByGuestIDFunc: func(guestID int64) ([]models.Comment, error) {
			repoCallCount++
			return expectedComments, nil
		},
	}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	// First call - cache miss
	comments1, err := service.GetCommentsByGuest("john-doe")
	assert.NoError(t, err)
	assert.Equal(t, expectedComments, comments1)

	// Second call - cache hit
	comments2, err := service.GetCommentsByGuest("john-doe")
	assert.NoError(t, err)
	assert.Equal(t, expectedComments, comments2)

	// Repository should only be called once (first call)
	assert.Equal(t, 1, repoCallCount, "Repository should only be called once due to caching")
}

func TestCommentService_GetCommentsByGuest_GuestNotFound(t *testing.T) {
	mockGuestService := &mockGuestService{
		GetGuestByNameFunc: func(name string) (*models.Guest, error) {
			return nil, nil
		},
	}
	mockRepo := &mockCommentRepo{}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	comments, err := service.GetCommentsByGuest("unknown")

	assert.NoError(t, err)
	assert.Nil(t, comments)
}

func TestCommentService_GetAllCommentsWithGuests(t *testing.T) {
	expectedResult := &models.PaginatedComments{
		Comments: []models.CommentWithGuest{
			{Comment: models.Comment{ID: 1, GuestID: 1, Content: "Hello"}, GuestName: "john-doe"},
		},
		TotalCount: 1,
	}
	mockGuestService := &mockGuestService{}
	mockRepo := &mockCommentRepo{
		GetAllWithGuestsFunc: func(limit int, cursor string) (*models.PaginatedComments, error) {
			assert.Equal(t, 10, limit)
			assert.Equal(t, "", cursor)
			return expectedResult, nil
		},
	}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	result, err := service.GetAllCommentsWithGuests(10, "")

	assert.NoError(t, err)
	assert.Equal(t, expectedResult, result)
}

func TestCommentService_GetAllCommentsWithGuests_WithCursor(t *testing.T) {
	expectedResult := &models.PaginatedComments{
		Comments: []models.CommentWithGuest{
			{Comment: models.Comment{ID: 2, GuestID: 2, Content: "Second"}, GuestName: "jane-doe"},
		},
		TotalCount: 2,
	}
	cursor := "2024-01-01T00:00:00Z"
	mockGuestService := &mockGuestService{}
	mockRepo := &mockCommentRepo{
		GetAllWithGuestsFunc: func(limit int, cursorStr string) (*models.PaginatedComments, error) {
			assert.Equal(t, 5, limit)
			assert.Equal(t, cursor, cursorStr)
			return expectedResult, nil
		},
	}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	result, err := service.GetAllCommentsWithGuests(5, cursor)

	assert.NoError(t, err)
	assert.Equal(t, expectedResult, result)
}

func TestCommentService_GetAllComments(t *testing.T) {
	expectedComments := []models.Comment{
		{ID: 1, GuestID: 1, Content: "First"},
		{ID: 2, GuestID: 2, Content: "Second"},
	}
	mockGuestService := &mockGuestService{}
	mockRepo := &mockCommentRepo{
		GetAllFunc: func() ([]models.Comment, error) {
			return expectedComments, nil
		},
	}
	service := NewCommentService(mockRepo, mockGuestService)
	t.Cleanup(func() {
		service.commentCache.Stop()
	})

	comments, err := service.GetAllComments()

	assert.NoError(t, err)
	assert.Equal(t, expectedComments, comments)
}
