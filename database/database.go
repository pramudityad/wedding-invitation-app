package database

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"
	"time"

	"wedding-invitation-backend/config"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() error {
	// Get database path from config
	dbPath := config.DBPath

	// Create database directory if it doesn't exist
	dbDir := filepath.Dir(dbPath)
	if dbDir != "." && dbDir != "" {
		if err := os.MkdirAll(dbDir, 0755); err != nil {
			return err
		}
	}

	var err error
	DB, err = sql.Open("sqlite", dbPath+"?_journal_mode=WAL&_busy_timeout=5000&_synchronous=NORMAL")
	if err != nil {
		return err
	}

	// Configure connection pool for SQLite
	// SQLite only allows one writer at a time, so limit connections
	DB.SetMaxOpenConns(1)
	DB.SetMaxIdleConns(1)
	DB.SetConnMaxLifetime(time.Hour)

	// Test the connection
	if err := DB.Ping(); err != nil {
		return err
	}

	// Create guests table if it doesn't exist
	// First create temporary table without email column
	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS guests (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			attending BOOLEAN,   -- allows NULL
			plus_ones INTEGER DEFAULT 0,
			dietary_restrictions TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			first_opened_at TIMESTAMP DEFAULT NULL
		);

		-- Create comments table to maintain foreign key
		CREATE TABLE IF NOT EXISTS comments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			guest_id INTEGER NOT NULL,
			content TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (guest_id) REFERENCES guests(id)
		);

		-- Create indexes for performance optimization
		CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);
		CREATE INDEX IF NOT EXISTS idx_comments_guest_id ON comments(guest_id);
		CREATE INDEX IF NOT EXISTS idx_guests_attending ON guests(attending);
		CREATE INDEX IF NOT EXISTS idx_comments_guest_created ON comments(guest_id, created_at DESC);
	`)
	if err != nil {
		return err
	}

	log.Println("Database initialized successfully")
	return nil
}
