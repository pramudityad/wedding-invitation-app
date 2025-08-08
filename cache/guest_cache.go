package cache

import (
	"time"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/repositories"
)

// GuestCache provides caching for guest operations
type GuestCache struct {
	cache      *MemoryCache
	repository repositories.GuestRepository
}

// NewGuestCache creates a new guest cache
func NewGuestCache(repository repositories.GuestRepository) *GuestCache {
	return &GuestCache{
		cache:      NewMemoryCache(5 * time.Minute), // 5 minute TTL
		repository: repository,
	}
}

// GetByName retrieves a guest by name, using cache if available
func (gc *GuestCache) GetByName(name string) (*models.Guest, error) {
	// Try cache first
	if cached, found := gc.cache.Get("guest_" + name); found {
		if guest, ok := cached.(*models.Guest); ok {
			return guest, nil
		}
	}
	
	// Cache miss, get from repository
	guest, err := gc.repository.GetByName(name)
	if err != nil {
		return nil, err
	}
	
	// Cache the result (including nil for not found)
	gc.cache.Set("guest_"+name, guest)
	
	return guest, nil
}

// GetAll retrieves all guests, using cache if available
func (gc *GuestCache) GetAll() ([]models.Guest, error) {
	// Try cache first
	if cached, found := gc.cache.Get("all_guests"); found {
		if guests, ok := cached.([]models.Guest); ok {
			return guests, nil
		}
	}
	
	// Cache miss, get from repository
	guests, err := gc.repository.GetAll()
	if err != nil {
		return nil, err
	}
	
	// Cache the result
	gc.cache.Set("all_guests", guests)
	
	return guests, nil
}

// Create creates a new guest and invalidates relevant caches
func (gc *GuestCache) Create(guest *models.Guest) error {
	err := gc.repository.Create(guest)
	if err != nil {
		return err
	}
	
	// Invalidate caches
	gc.cache.Delete("all_guests")
	gc.cache.Delete("guest_" + guest.Name)
	
	return nil
}

// Update updates a guest and invalidates relevant caches
func (gc *GuestCache) Update(guest *models.Guest) error {
	err := gc.repository.Update(guest)
	if err != nil {
		return err
	}
	
	// Invalidate caches
	gc.cache.Delete("all_guests")
	gc.cache.Delete("guest_" + guest.Name)
	
	return nil
}

// BulkCreate creates multiple guests and clears all caches
func (gc *GuestCache) BulkCreate(guests []models.Guest) error {
	err := gc.repository.BulkCreate(guests)
	if err != nil {
		return err
	}
	
	// Clear all caches after bulk operation
	gc.cache.Clear()
	
	return nil
}

// BulkUpdate updates multiple guests and clears all caches
func (gc *GuestCache) BulkUpdate(guests []models.Guest) error {
	err := gc.repository.BulkUpdate(guests)
	if err != nil {
		return err
	}
	
	// Clear all caches after bulk operation
	gc.cache.Clear()
	
	return nil
}

// MarkInvitationOpened marks invitation as opened and invalidates caches
func (gc *GuestCache) MarkInvitationOpened(name string) error {
	err := gc.repository.MarkInvitationOpened(name)
	if err != nil {
		return err
	}
	
	// Invalidate relevant caches
	gc.cache.Delete("guest_" + name)
	gc.cache.Delete("all_guests")
	
	return nil
}