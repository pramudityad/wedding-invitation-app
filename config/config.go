package config

import (
	"log"
	"os"
	"strconv"
)

var (
	ServerPort  string
	JWTSecret   string
	JWTExpiry   int
	DBPath      string
	AdminAPIKey string
)

func init() {
	// Set configuration from environment variables or default values
	ServerPort = getEnv("SERVER_PORT", ":8080")
	JWTSecret = getEnv("JWT_SECRET", "test-secret")
	JWTExpiry = getEnvInt("JWT_EXPIRY", 24*60*60)
	DBPath = getEnv("DB_PATH", "data/guests.db")
	AdminAPIKey = getEnv("ADMIN_API_KEY", "admin-api-key")
}

// Helper functions to get environment variables
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// ValidateConfig checks critical configuration and logs warnings for missing values
func ValidateConfig() {
	var warnings []string
	var errors []string

	// Critical validations
	if JWTSecret == "test-secret" {
		warnings = append(warnings, "JWT_SECRET is using default value - this is insecure for production")
	}

	if AdminAPIKey == "admin-api-key" {
		warnings = append(warnings, "ADMIN_API_KEY is using default value - this is insecure for production")
	}

	// Log warnings
	for _, warning := range warnings {
		log.Printf("CONFIG WARNING: %s", warning)
	}

	// Log errors and potentially exit
	for _, error := range errors {
		log.Printf("CONFIG ERROR: %s", error)
	}

	if len(errors) > 0 {
		log.Fatal("Configuration validation failed - please fix the above errors")
	}

	if len(warnings) == 0 && len(errors) == 0 {
		log.Println("Configuration validation passed")
	} else {
		log.Printf("Configuration loaded with %d warnings", len(warnings))
	}
}
