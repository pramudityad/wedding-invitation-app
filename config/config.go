package config

import (
	"log"
	"os"
	"strconv"
	"time"
)

var (
	// Server configuration
	ServerPort  string
	JWTSecret   string
	JWTExpiry   int
	DBPath      string
	AdminAPIKey string

	// Cache configuration
	CacheGuestTTL   time.Duration
	CacheCommentTTL time.Duration

	// Rate limit configuration
	RateLimitAuthMax       int
	RateLimitAuthWindow    time.Duration
	RateLimitRSVPMax       int
	RateLimitRSVPWindow    time.Duration
	RateLimitCommentMax    int
	RateLimitCommentWindow time.Duration

	// Business logic configuration
	MaxCommentsPerGuest int
)

func init() {
	loadServerConfig()
	loadCacheConfig()
	loadRateLimitConfig()
	loadBusinessConfig()
}

func loadServerConfig() {
	ServerPort = getEnv("SERVER_PORT", ":8080")
	JWTSecret = getEnv("JWT_SECRET", "test-secret")
	JWTExpiry = getEnvInt("JWT_EXPIRY", 24*60*60)
	DBPath = getEnv("DB_PATH", "data/guests.db")
	AdminAPIKey = getEnv("ADMIN_API_KEY", "admin-api-key")
}

func loadCacheConfig() {
	CacheGuestTTL = getEnvDuration("CACHE_GUEST_TTL", 5*time.Minute)
	CacheCommentTTL = getEnvDuration("CACHE_COMMENT_TTL", 2*time.Minute)
}

func loadRateLimitConfig() {
	RateLimitAuthMax = getEnvInt("RATE_LIMIT_AUTH_MAX", 5)
	RateLimitAuthWindow = getEnvDuration("RATE_LIMIT_AUTH_WINDOW", time.Minute)
	RateLimitRSVPMax = getEnvInt("RATE_LIMIT_RSVP_MAX", 10)
	RateLimitRSVPWindow = getEnvDuration("RATE_LIMIT_RSVP_WINDOW", time.Minute)
	RateLimitCommentMax = getEnvInt("RATE_LIMIT_COMMENT_MAX", 5)
	RateLimitCommentWindow = getEnvDuration("RATE_LIMIT_COMMENT_WINDOW", time.Minute)
}

func loadBusinessConfig() {
	MaxCommentsPerGuest = getEnvInt("MAX_COMMENTS_PER_GUEST", 2)
}

// Helper functions
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

func getEnvDuration(key string, defaultValue time.Duration) time.Duration {
	if value, exists := os.LookupEnv(key); exists {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

// ValidateConfig checks critical configuration and logs warnings
func ValidateConfig() {
	var warnings []string
	var errors []string

	if JWTSecret == "test-secret" {
		warnings = append(warnings, "JWT_SECRET is using default value - this is insecure for production")
	}

	if AdminAPIKey == "admin-api-key" {
		warnings = append(warnings, "ADMIN_API_KEY is using default value - this is insecure for production")
	}

	for _, warning := range warnings {
		log.Printf("CONFIG WARNING: %s", warning)
	}

	for _, err := range errors {
		log.Printf("CONFIG ERROR: %s", err)
	}

	if len(errors) > 0 {
		log.Fatal("Configuration validation failed")
	}

	if len(warnings) == 0 && len(errors) == 0 {
		log.Println("Configuration validation passed")
	} else {
		log.Printf("Configuration loaded with %d warnings", len(warnings))
	}
}
