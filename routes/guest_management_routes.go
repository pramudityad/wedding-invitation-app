package routes

import (
	"net/http"
	"wedding-invitation-backend/container"

	"github.com/gin-gonic/gin"
)

func SetupGuestManagementRoutes(r *gin.RouterGroup, c *container.Container) {
	r.GET("/guests", handleGetGuestByName(c))
}

func handleGetGuestByName(container *container.Container) gin.HandlerFunc {
	return func(c *gin.Context) {
		name := c.Query("name")
		if name == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Please provide a guest name to search for.",
			})
			return
		}

		guest, err := container.GuestService.GetGuestByName(name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "We're having trouble accessing guest information right now. Please try again.",
			})
			return
		}

		if guest == nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "No guest found with that name. Please check the spelling and try again.",
			})
			return
		}

		c.JSON(http.StatusOK, guest)
	}
}
