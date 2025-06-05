package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// SetupDatabase opens SQLite and applies migrations.
func SetupDatabase(dbPath string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	if err := Migrate(db); err != nil {
		return nil, err
	}
	return db, nil
}
