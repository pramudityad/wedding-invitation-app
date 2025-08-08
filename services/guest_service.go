package services

import (
	"wedding-invitation-backend/cache"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/repositories"
)

// GuestService handles guest business logic
type GuestService struct {
	guestCache *cache.GuestCache
}

// NewGuestService creates a new guest service
func NewGuestService(guestRepo repositories.GuestRepository) *GuestService {
	return &GuestService{
		guestCache: cache.NewGuestCache(guestRepo),
	}
}

// GetGuestByName retrieves a guest by name (cached)
func (gs *GuestService) GetGuestByName(name string) (*models.Guest, error) {
	return gs.guestCache.GetByName(name)
}

// GetAllGuests retrieves all guests (cached)
func (gs *GuestService) GetAllGuests() ([]models.Guest, error) {
	return gs.guestCache.GetAll()
}

// CreateGuest creates a new guest
func (gs *GuestService) CreateGuest(guest *models.Guest) error {
	return gs.guestCache.Create(guest)
}

// UpdateGuest updates an existing guest
func (gs *GuestService) UpdateGuest(guest *models.Guest) error {
	return gs.guestCache.Update(guest)
}

// BulkCreateGuests creates multiple guests
func (gs *GuestService) BulkCreateGuests(guests []models.Guest) error {
	return gs.guestCache.BulkCreate(guests)
}

// BulkUpdateGuests updates multiple guests
func (gs *GuestService) BulkUpdateGuests(guests []models.Guest) error {
	return gs.guestCache.BulkUpdate(guests)
}

// MarkInvitationOpened marks an invitation as opened
func (gs *GuestService) MarkInvitationOpened(name string) error {
	return gs.guestCache.MarkInvitationOpened(name)
}

// ValidateGuestAccess checks if a guest exists and has access
func (gs *GuestService) ValidateGuestAccess(name string) (*models.Guest, error) {
	guest, err := gs.GetGuestByName(name)
	if err != nil {
		return nil, err
	}
	
	if guest == nil {
		return nil, nil // Guest not found
	}
	
	return guest, nil
}