package repositories

import (
	"database/sql"
	"wedding-invitation-backend/models"
)

// GuestRepository defines the interface for guest data access
type GuestRepository interface {
	GetByName(name string) (*models.Guest, error)
	GetAll() ([]models.Guest, error)
	Create(guest *models.Guest) error
	Update(guest *models.Guest) error
	BulkCreate(guests []models.Guest) error
	BulkUpdate(guests []models.Guest) error
	MarkInvitationOpened(name string) error
}

// SQLGuestRepository implements GuestRepository using SQL database
type SQLGuestRepository struct {
	db *sql.DB
}

// NewSQLGuestRepository creates a new SQL-based guest repository
func NewSQLGuestRepository(db *sql.DB) GuestRepository {
	return &SQLGuestRepository{db: db}
}

func (r *SQLGuestRepository) GetByName(name string) (*models.Guest, error) {
	return models.GetGuestByName(r.db, name)
}

func (r *SQLGuestRepository) GetAll() ([]models.Guest, error) {
	return models.GetAllGuests(r.db)
}

func (r *SQLGuestRepository) Create(guest *models.Guest) error {
	return guest.Create(r.db)
}

func (r *SQLGuestRepository) Update(guest *models.Guest) error {
	return guest.Update(r.db)
}

func (r *SQLGuestRepository) BulkCreate(guests []models.Guest) error {
	return models.BulkCreate(r.db, guests)
}

func (r *SQLGuestRepository) BulkUpdate(guests []models.Guest) error {
	return models.BulkUpdate(r.db, guests)
}

func (r *SQLGuestRepository) MarkInvitationOpened(name string) error {
	return models.MarkInvitationOpened(r.db, name)
}