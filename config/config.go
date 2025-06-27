package config

const (
	ServerPort          = ":8080"
	JWTSecret           = "your-256-bit-secret" // TODO: Replace with environment variable in production
	JWTExpiry           = 24 * 60 * 60          // 24 hours in seconds
	DBPath              = "data/guests.db"      // SQLite database path
	SpotifyClientID     = ""                    // TODO: Set in production
	SpotifyClientSecret = ""                    // TODO: Set in production
	SpotifyRedirectURI  = "http://localhost:8080/spotify/callback"
	SpotifyCacheSeconds = 300 // 5 minutes cache duration
)
