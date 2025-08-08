package routes

import (
	"net/http"
	"wedding-invitation-backend/spotify"

	"github.com/gin-gonic/gin"
)

func SetupSpotifyRoutes(r *gin.RouterGroup) {
	r.GET("/spotify/auth", spotify.AuthHandler)
	r.GET("/spotify/callback", spotify.CallbackHandler)
	r.GET("/spotify/playlists", func(c *gin.Context) {
		client := spotify.GetClient()
		if client == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated with Spotify"})
			return
		}

		playlists, err := client.CurrentUsersPlaylists(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get playlists"})
			return
		}

		c.JSON(http.StatusOK, playlists)
	})

	r.POST("/spotify/play", func(c *gin.Context) {
		client := spotify.GetClient()
		if client == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated with Spotify"})
			return
		}

		err := client.Play(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start playback"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "playback started"})
	})

	r.POST("/spotify/pause", func(c *gin.Context) {
		client := spotify.GetClient()
		if client == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated with Spotify"})
			return
		}

		err := client.Pause(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to pause playback"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "playback paused"})
	})
}
