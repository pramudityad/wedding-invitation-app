package handlers

import (
	"encoding/json"
	"net/http"
)

// AdminHandler returns all guest RSVPs
func (app *AppContext) AdminHandler(w http.ResponseWriter, r *http.Request) {
	// Basic auth check
	username, password, ok := r.BasicAuth()
	if !ok || username != "admin" || password != app.Config.Admin.Password {
		w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get all guests
	guests, err := app.Store.ListGuests()
	if err != nil {
		http.Error(w, "Error fetching guests", http.StatusInternalServerError)
		return
	}

	// Return as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(guests)
}
