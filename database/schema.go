package database

import (
	"database/sql"
	"log"
)

// CreateSchema creates all tables if they don't exist.
// This is the single source of truth for the database schema.
func CreateSchema(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS guests (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		attending INTEGER,
		plus_ones INTEGER DEFAULT 0,
		dietary_restrictions TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		first_opened_at DATETIME
	);

	CREATE TABLE IF NOT EXISTS comments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		guest_id INTEGER NOT NULL,
		content TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (guest_id) REFERENCES guests(id)
	);
	`

	_, err := db.Exec(schema)
	if err != nil {
		log.Printf("Failed to create schema: %v", err)
		return err
	}

	log.Println("Database schema initialized successfully")
	return nil
}
