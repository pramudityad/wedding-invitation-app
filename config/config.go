package config

import (
	"os"
	"strconv"
)

var (
	ServerPort          string
	JWTSecret           string
	JWTExpiry           int
	DBPath              string
	SpotifyClientID     string
	SpotifyClientSecret string
	SpotifyRedirectURI  string
	SpotifyCacheSeconds int
	AdminAPIKey         string
)

func init() {
	// Set configuration from environment variables or default values
	ServerPort = getEnv("SERVER_PORT", ":8080")
	JWTSecret = getEnv("JWT_SECRET", "test-secret")
	JWTExpiry = getEnvInt("JWT_EXPIRY", 24*60*60)
	DBPath = getEnv("DB_PATH", "data/guests.db")
	SpotifyClientID = getEnv("SPOTIFY_CLIENT_ID", "")
	SpotifyClientSecret = getEnv("SPOTIFY_CLIENT_SECRET", "")
	SpotifyRedirectURI = getEnv("SPOTIFY_REDIRECT_URI", "http://localhost:8080/spotify/callback")
	SpotifyCacheSeconds = getEnvInt("SPOTIFY_CACHE_SECONDS", 300)
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
