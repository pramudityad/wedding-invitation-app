package cache

import (
	"wedding-invitation-backend/models"
)

// CacheInterface defines the interface for in-memory cache operations
type CacheInterface interface {
	Set(key string, value interface{})
	Get(key string) (interface{}, bool)
	Delete(key string)
	Clear()
	Size() int
	Stop()
}

// GuestCacheInterface defines the interface for guest cache operations
type GuestCacheInterface interface {
	GetByName(name string) (*models.Guest, error)
	GetAll() ([]models.Guest, error)
	Create(guest *models.Guest) error
	Update(guest *models.Guest) error
	BulkCreate(guests []models.Guest) error
	BulkUpdate(guests []models.Guest) error
	MarkInvitationOpened(name string) error
	Stop()
}

// Compile-time checks to ensure implementations satisfy interfaces
var _ CacheInterface = (*MemoryCache)(nil)
var _ GuestCacheInterface = (*GuestCache)(nil)
