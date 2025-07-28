package routes

import (
	"net/http"
	"wedding-invitation-backend/database"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupGuestManagementRoutes(r *gin.RouterGroup) {
	r.GET("/guests", handleGetGuestByName)
}

func handleGetGuestByName(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name parameter is required"})
		return
	}

	guest, err := models.GetGuestByName(database.DB, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch guest"})
		return
	}

	if guest == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
		return
	}

	c.JSON(http.StatusOK, guest)
}
