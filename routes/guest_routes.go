package routes

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"wedding-invitation-backend/database"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupGuestRoutes(r *gin.RouterGroup) {
	// Bulk guest operations
	r.POST("/bulk", handleBulkGuestUpload)
	r.PUT("/bulk", handleBulkGuestUpdate)
}

func handleBulkGuestUpload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer f.Close()

	guests, err := parseGuestCSV(f)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse CSV", "details": err.Error()})
		return
	}

	if err := models.BulkCreate(database.DB, guests); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create guests", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Guests created successfully",
		"count":   len(guests),
	})
}

func parseGuestCSV(f io.Reader) ([]models.Guest, error) {
	r := csv.NewReader(f)
	records, err := r.ReadAll()
	if err != nil {
		return nil, err
	}

	var guests []models.Guest
	for i, record := range records {
		if i == 0 {
			continue
		}

		plusOnes, err := strconv.Atoi(record[2])
		if err != nil {
			return nil, fmt.Errorf("invalid plus_ones value on line %d: %v", i+1, err)
		}

		attending := strings.ToLower(record[1]) == "true"

		guest := models.Guest{
			Name:                record[0],
			Attending:           attending,
			PlusOnes:            plusOnes,
			DietaryRestrictions: sql.NullString{String: record[3], Valid: record[3] != ""},
		}
		guests = append(guests, guest)
	}

	return guests, nil
}

func handleBulkGuestUpdate(c *gin.Context) {
	var guests []models.Guest
	if err := c.ShouldBindJSON(&guests); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if err := models.BulkUpdate(database.DB, guests); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update guests", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Guests updated successfully",
		"count":   len(guests),
	})
}
