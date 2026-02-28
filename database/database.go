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
	// Uses shared schema from database/schema.go
	if err := CreateSchema(DB); err != nil {
		return err
	}

	log.Println("Database initialized successfully")
	return nil
}
