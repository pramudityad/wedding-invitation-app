package store

import (
	"time"

	"github.com/pramudityad/wedding-invitation-app/internal/models"
	"gorm.io/gorm"
)

// Store holds a gorm.DB reference
type Store struct {
	DB *gorm.DB
}

// NewStore wraps gorm.DB into Store
func NewStore(db *gorm.DB) *Store {
	return &Store{DB: db}
}

// CreateGuest creates a new guest record
func (s *Store) CreateGuest(g *models.Guest) error {
	return s.DB.Create(g).Error
}

// GetGuest retrieves guest by slug
func (s *Store) GetGuest(slug string) (*models.Guest, error) {
	var g models.Guest
	if err := s.DB.First(&g, "slug = ?", slug).Error; err != nil {
		return nil, err
	}
	return &g, nil
}

// UpdateGuest saves changes (e.g. RSVP, message, viewedAt)
func (s *Store) UpdateGuest(g *models.Guest) error {
	return s.DB.Save(g).Error
}

// ListEvents fetches all events for given slug
func (s *Store) ListEvents(slug string) ([]models.Event, error) {
	var evs []models.Event
	if err := s.DB.Where("guest_slug = ?", slug).Find(&evs).Error; err != nil {
		return nil, err
	}
	return evs, nil
}

// ListGallery returns all gallery items ordered
func (s *Store) ListGallery() ([]models.Gallery, error) {
	var items []models.Gallery
	if err := s.DB.Order("display_order asc").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

// RecordView sets ViewedAt for a guest
func (s *Store) RecordView(slug string) error {
	return s.DB.Model(&models.Guest{}).Where("slug = ?", slug).
		Update("viewed_at", time.Now()).Error
}
