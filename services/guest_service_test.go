package services

import (
	"errors"
	"testing"
	"wedding-invitation-backend/models"

	"github.com/stretchr/testify/assert"
)

// mockGuestCache implements cache.GuestCacheInterface using function fields
type mockGuestCache struct {
	GetByNameFunc            func(name string) (*models.Guest, error)
	GetAllFunc               func() ([]models.Guest, error)
	CreateFunc               func(guest *models.Guest) error
	UpdateFunc               func(guest *models.Guest) error
	BulkCreateFunc           func(guests []models.Guest) error
	BulkUpdateFunc           func(guests []models.Guest) error
	MarkInvitationOpenedFunc func(name string) error
	StopFunc                 func()
}

func (m *mockGuestCache) GetByName(name string) (*models.Guest, error) {
	if m.GetByNameFunc != nil {
		return m.GetByNameFunc(name)
	}
	return nil, nil
}

func (m *mockGuestCache) GetAll() ([]models.Guest, error) {
	if m.GetAllFunc != nil {
		return m.GetAllFunc()
	}
	return nil, nil
}

func (m *mockGuestCache) Create(guest *models.Guest) error {
	if m.CreateFunc != nil {
		return m.CreateFunc(guest)
	}
	return nil
}

func (m *mockGuestCache) Update(guest *models.Guest) error {
	if m.UpdateFunc != nil {
		return m.UpdateFunc(guest)
	}
	return nil
}

func (m *mockGuestCache) BulkCreate(guests []models.Guest) error {
	if m.BulkCreateFunc != nil {
		return m.BulkCreateFunc(guests)
	}
	return nil
}

func (m *mockGuestCache) BulkUpdate(guests []models.Guest) error {
	if m.BulkUpdateFunc != nil {
		return m.BulkUpdateFunc(guests)
	}
	return nil
}

func (m *mockGuestCache) MarkInvitationOpened(name string) error {
	if m.MarkInvitationOpenedFunc != nil {
		return m.MarkInvitationOpenedFunc(name)
	}
	return nil
}

func (m *mockGuestCache) Stop() {
	if m.StopFunc != nil {
		m.StopFunc()
	}
}

// newGuestServiceWithCache creates a GuestService with a mock cache for testing
func newGuestServiceWithCache(mockCache *mockGuestCache) *GuestService {
	return &GuestService{guestCache: mockCache}
}

func TestGuestService_GetGuestByName_Found(t *testing.T) {
	expectedGuest := &models.Guest{
		ID:   1,
		Name: "john-doe",
	}
	mockCache := &mockGuestCache{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "john-doe", name)
			return expectedGuest, nil
		},
	}
	service := newGuestServiceWithCache(mockCache)

	guest, err := service.GetGuestByName("john-doe")

	assert.NoError(t, err)
	assert.Equal(t, expectedGuest, guest)
}

func TestGuestService_GetGuestByName_NotFound(t *testing.T) {
	mockCache := &mockGuestCache{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			return nil, nil
		},
	}
	service := newGuestServiceWithCache(mockCache)

	guest, err := service.GetGuestByName("unknown")

	assert.NoError(t, err)
	assert.Nil(t, guest)
}

func TestGuestService_GetGuestByName_Error(t *testing.T) {
	expectedErr := errors.New("database error")
	mockCache := &mockGuestCache{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			return nil, expectedErr
		},
	}
	service := newGuestServiceWithCache(mockCache)

	guest, err := service.GetGuestByName("john-doe")

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, guest)
}

func TestGuestService_GetAllGuests(t *testing.T) {
	expectedGuests := []models.Guest{
		{ID: 1, Name: "john-doe"},
		{ID: 2, Name: "jane-doe"},
	}
	mockCache := &mockGuestCache{
		GetAllFunc: func() ([]models.Guest, error) {
			return expectedGuests, nil
		},
	}
	service := newGuestServiceWithCache(mockCache)

	guests, err := service.GetAllGuests()

	assert.NoError(t, err)
	assert.Equal(t, expectedGuests, guests)
}

func TestGuestService_ValidateGuestAccess_Found(t *testing.T) {
	expectedGuest := &models.Guest{
		ID:   1,
		Name: "john-doe",
	}
	mockCache := &mockGuestCache{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			assert.Equal(t, "john-doe", name)
			return expectedGuest, nil
		},
	}
	service := newGuestServiceWithCache(mockCache)

	guest, err := service.ValidateGuestAccess("john-doe")

	assert.NoError(t, err)
	assert.Equal(t, expectedGuest, guest)
}

func TestGuestService_ValidateGuestAccess_NotFound(t *testing.T) {
	mockCache := &mockGuestCache{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			return nil, nil
		},
	}
	service := newGuestServiceWithCache(mockCache)

	guest, err := service.ValidateGuestAccess("unknown")

	assert.NoError(t, err)
	assert.Nil(t, guest)
}

func TestGuestService_ValidateGuestAccess_Error(t *testing.T) {
	expectedErr := errors.New("database error")
	mockCache := &mockGuestCache{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			return nil, expectedErr
		},
	}
	service := newGuestServiceWithCache(mockCache)

	guest, err := service.ValidateGuestAccess("john-doe")

	assert.Error(t, err)
	assert.Equal(t, expectedErr, err)
	assert.Nil(t, guest)
}
