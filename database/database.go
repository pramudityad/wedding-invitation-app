package database

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() error {
	// Create database directory if it doesn't exist
	dbDir := filepath.Join(".", "data")
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		return err
	}

	// Connect to SQLite database
	dbPath := filepath.Join(dbDir, "guests.db")
	var err error
	DB, err = sql.Open("sqlite", dbPath)
	if err != nil {
		return err
	}

	// Test the connection
	if err := DB.Ping(); err != nil {
		return err
	}

	// Create guests table if it doesn't exist
	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS guests (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			attending BOOLEAN DEFAULT FALSE,
			plus_ones INTEGER DEFAULT 0,
			dietary_restrictions TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS comments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			guest_id INTEGER NOT NULL,
			content TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (guest_id) REFERENCES guests(id)
		);
	`)
	if err != nil {
		return err
	}

	log.Println("Database initialized successfully")
	return nil
}
