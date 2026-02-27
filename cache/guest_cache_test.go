package cache

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/repositories"
)

// mockGuestRepo is a function-field mock for GuestRepository
type mockGuestRepo struct {
	GetByNameFunc            func(name string) (*models.Guest, error)
	GetAllFunc               func() ([]models.Guest, error)
	CreateFunc               func(guest *models.Guest) error
	UpdateFunc               func(guest *models.Guest) error
	BulkCreateFunc           func(guests []models.Guest) error
	BulkUpdateFunc           func(guests []models.Guest) error
	MarkInvitationOpenedFunc func(name string) error
}

// Implement GuestRepository interface

func (m *mockGuestRepo) GetByName(name string) (*models.Guest, error) {
	if m.GetByNameFunc != nil {
		return m.GetByNameFunc(name)
	}
	return nil, nil
}

func (m *mockGuestRepo) GetAll() ([]models.Guest, error) {
	if m.GetAllFunc != nil {
		return m.GetAllFunc()
	}
	return nil, nil
}

func (m *mockGuestRepo) Create(guest *models.Guest) error {
	if m.CreateFunc != nil {
		return m.CreateFunc(guest)
	}
	return nil
}

func (m *mockGuestRepo) Update(guest *models.Guest) error {
	if m.UpdateFunc != nil {
		return m.UpdateFunc(guest)
	}
	return nil
}

func (m *mockGuestRepo) BulkCreate(guests []models.Guest) error {
	if m.BulkCreateFunc != nil {
		return m.BulkCreateFunc(guests)
	}
	return nil
}

func (m *mockGuestRepo) BulkUpdate(guests []models.Guest) error {
	if m.BulkUpdateFunc != nil {
		return m.BulkUpdateFunc(guests)
	}
	return nil
}

func (m *mockGuestRepo) MarkInvitationOpened(name string) error {
	if m.MarkInvitationOpenedFunc != nil {
		return m.MarkInvitationOpenedFunc(name)
	}
	return nil
}

// Verify mock implements interface at compile time
var _ repositories.GuestRepository = (*mockGuestRepo)(nil)

func TestGuestCache_GetByName_CacheMiss(t *testing.T) {
	callCount := 0
	expectedGuest := &models.Guest{
		ID:   1,
		Name: "John Doe",
	}

	mock := &mockGuestRepo{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			callCount++
			assert.Equal(t, "John Doe", name)
			return expectedGuest, nil
		},
	}

	gc := NewGuestCache(mock)
	t.Cleanup(func() { gc.Stop() })

	// First call should hit the repository (cache miss)
	guest, err := gc.GetByName("John Doe")
	assert.NoError(t, err)
	assert.Equal(t, expectedGuest, guest)
	assert.Equal(t, 1, callCount, "repository should be called once")
}

func TestGuestCache_GetByName_CacheHit(t *testing.T) {
	callCount := 0
	expectedGuest := &models.Guest{
		ID:   1,
		Name: "Jane Smith",
	}

	mock := &mockGuestRepo{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			callCount++
			return expectedGuest, nil
		},
	}

	gc := NewGuestCache(mock)
	t.Cleanup(func() { gc.Stop() })

	// First call - cache miss, hits repository
	guest, err := gc.GetByName("Jane Smith")
	assert.NoError(t, err)
	assert.Equal(t, expectedGuest, guest)
	assert.Equal(t, 1, callCount, "repository should be called once after first GetByName")

	// Second call - cache hit, should NOT hit repository
	guest, err = gc.GetByName("Jane Smith")
	assert.NoError(t, err)
	assert.Equal(t, expectedGuest, guest)
	assert.Equal(t, 1, callCount, "repository should still be called only once (cache hit)")
}

func TestGuestCache_GetAll_CacheMiss(t *testing.T) {
	callCount := 0
	expectedGuests := []models.Guest{
		{ID: 1, Name: "Guest1"},
		{ID: 2, Name: "Guest2"},
	}

	mock := &mockGuestRepo{
		GetAllFunc: func() ([]models.Guest, error) {
			callCount++
			return expectedGuests, nil
		},
	}

	gc := NewGuestCache(mock)
	t.Cleanup(func() { gc.Stop() })

	// First call should hit the repository (cache miss)
	guests, err := gc.GetAll()
	assert.NoError(t, err)
	assert.Equal(t, expectedGuests, guests)
	assert.Equal(t, 1, callCount, "repository should be called once")
}

func TestGuestCache_Create_InvalidatesCache(t *testing.T) {
	getByNameCallCount := 0
	expectedGuest := &models.Guest{
		ID:   1,
		Name: "New Guest",
	}

	mock := &mockGuestRepo{
		GetByNameFunc: func(name string) (*models.Guest, error) {
			getByNameCallCount++
			return expectedGuest, nil
		},
		CreateFunc: func(guest *models.Guest) error {
			return nil
		},
	}

	gc := NewGuestCache(mock)
	t.Cleanup(func() { gc.Stop() })

	// First GetByName - cache miss, hits repository
	_, err := gc.GetByName("New Guest")
	assert.NoError(t, err)
	assert.Equal(t, 1, getByNameCallCount, "repository should be called once after first GetByName")

	// Create should invalidate the cache
	err = gc.Create(&models.Guest{Name: "New Guest"})
	assert.NoError(t, err)

	// Second GetByName - cache should be invalidated, hits repository again
	_, err = gc.GetByName("New Guest")
	assert.NoError(t, err)
	assert.Equal(t, 2, getByNameCallCount, "repository should be called twice (cache invalidated by Create)")
}
