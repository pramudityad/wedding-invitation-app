package main

import (
	"log"
	"wedding-invitation-backend/config"
	"wedding-invitation-backend/container"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/routes"
	"wedding-invitation-backend/spotify"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Print("Warning: .env file not found, using environment variables")
	}

	// Validate configuration
	config.ValidateConfig()

	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.DB.Close()

	// Initialize dependency injection container
	appContainer := container.NewContainer(database.DB)
	log.Println("Dependency injection container initialized with caching enabled")

	// Initialize Spotify client
	spotify.Init()

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost", "http://127.0.0.1"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Setup routes with dependency injection
	routes.SetupRoutes(r, appContainer)

	// Start server
	if err := r.Run(config.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
