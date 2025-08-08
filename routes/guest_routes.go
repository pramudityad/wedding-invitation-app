package routes

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"wedding-invitation-backend/container"
	"wedding-invitation-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupGuestRoutes(r *gin.RouterGroup, c *container.Container) {
	// Bulk guest operations
	guestGroup := r.Group("/guests")
	{
		guestGroup.POST("/bulk", handleBulkGuestUpload(c))
		guestGroup.PUT("/bulk", handleBulkGuestUpdate(c))
	}
}

func handleBulkGuestUpload(container *container.Container) gin.HandlerFunc {
	return func(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Please select a CSV file to upload.",
		})
		return
	}

	// Validate file type
	if !strings.HasSuffix(strings.ToLower(file.Filename), ".csv") {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Please upload a CSV file only.",
		})
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to process the uploaded file. Please try again.",
		})
		return
	}
	defer f.Close()

	guests, err := parseGuestCSV(f)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "There's an issue with the CSV format. Please check your file and try again.",
			"details": err.Error(),
		})
		return
	}

	if len(guests) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "The CSV file appears to be empty or contains no valid guest data.",
		})
		return
	}

	if err := container.GuestService.BulkCreateGuests(guests); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to save the guest list to the database. Please try again.",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully uploaded %d guests to the wedding list!", len(guests)),
		"count":   len(guests),
	})
	}
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

		var plusOnes int
		if record[2] == "" {
			plusOnes = 0
		} else {
			val, err := strconv.Atoi(record[2])
			if err != nil {
				return nil, fmt.Errorf("invalid plus_ones value on line %d: %v", i+1, err)
			}
			plusOnes = val
		}

		var attending sql.NullBool
		if record[1] != "" {
			val := strings.ToLower(record[1]) == "true"
			attending = sql.NullBool{
				Bool: val,
				Valid: true,
			}
		}

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

func handleBulkGuestUpdate(container *container.Container) gin.HandlerFunc {
	return func(c *gin.Context) {
	var guests []models.Guest
	if err := c.ShouldBindJSON(&guests); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "The guest data format is invalid. Please check your request and try again.",
		})
		return
	}

	if len(guests) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No guest data provided for update.",
		})
		return
	}

	if err := container.GuestService.BulkUpdateGuests(guests); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to update the guest information. Please try again.",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully updated %d guest records!", len(guests)),
		"count":   len(guests),
	})
	}
}
