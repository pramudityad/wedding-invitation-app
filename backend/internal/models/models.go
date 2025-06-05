package models

import (
	"time"

	"gorm.io/gorm"
)

// Guest corresponds to the guests table
type Guest struct {
	Slug         string    `gorm:"primaryKey;size:100" json:"slug"`
	Name         string    `gorm:"size:200" json:"name"`
	PasswordHash string    `gorm:"size:60" json:"-"`
	ViewedAt     time.Time `json:"viewedAt"`
	RSVPStatus   string    `gorm:"size:10" json:"rsvpStatus"` // "Yes", "No", "Maybe"
	Message      string    `gorm:"type:text" json:"message"`
}

// Event corresponds to the events table
type Event struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	GuestSlug   string    `gorm:"size:100;index" json:"slug"` // FK to Guest.Slug
	Title       string    `gorm:"size:200" json:"title"`
	DateTime    time.Time `json:"dateTime"`
	Location    string    `gorm:"size:200" json:"location"`
	Description string    `gorm:"type:text" json:"description"`
}

// Gallery holds uploaded photo records
type Gallery struct {
	ID           uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	ImagePath    string `gorm:"size:300" json:"imagePath"` // e.g. "/images/gallery/1.jpg"
	DisplayOrder int    `json:"displayOrder"`
}

// ConfigModel represents the one-row table for global config
// (optional: some fields mirror config.yaml for runtime overrides)
// Use auto migration only — values stored in YAML by default
// Omitted from DB for now; can add if in-app editing required

// Migrate sets up tables in SQLite
func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(&Guest{}, &Event{}, &Gallery{})
}
