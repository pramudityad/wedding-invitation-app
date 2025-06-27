package spotify

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	authState = "spotify-auth-state"
)

func AuthHandler(c *gin.Context) {
	url := authClient.AuthURL(authState)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func CallbackHandler(c *gin.Context) {
	state := c.Query("state")
	if state != authState {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid state parameter",
		})
		return
	}

	client, err := CompleteAuth(c.Writer, c.Request, state)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to authenticate with Spotify",
		})
		return
	}

	user, err := client.CurrentUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get user info",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Logged in as %s", user.DisplayName),
		"user":    user,
	})
}
