package main

import (
	"log"
	"wedding-invitation-backend/config"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/routes"
	"wedding-invitation-backend/spotify"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.DB.Close()

	// Initialize Spotify client
	spotify.Init()

	// Initialize Gin router
	r := gin.Default()

	// Setup routes
	routes.SetupRoutes(r)

	// Start server
	if err := r.Run(config.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
