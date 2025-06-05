package handlers

import (
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/pramudityad/wedding-invitation-app/internal/config"
)

// InviteData holds all data sent to frontend
type InviteData struct {
	Name       string                   `json:"name"`
	ViewedAt   string                   `json:"viewedAt"`
	RSVPStatus string                   `json:"rsvpStatus"`
	Message    string                   `json:"message"`
	Events     []map[string]interface{} `json:"events"`
	Gallery    []map[string]interface{} `json:"gallery"`
	Config     *config.Config           `json:"config"`
}

// GetInviteHandler responds with guest-specific data once authenticated
func (app *AppContext) GetInviteHandler(w http.ResponseWriter, r *http.Request) {
	slug := mux.Vars(r)["slug"]
	guest, err := app.Store.GetGuest(slug)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	// Check session cookie for auth
	sessionPw, err := r.Cookie("invite_pw_" + slug)
	if err != nil || !CheckPassword(guest.PasswordHash, sessionPw.Value) {
		WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}
	// Record view timestamp (optional)
	app.Store.RecordView(slug)

	// Fetch events and gallery
	evs, _ := app.Store.ListEvents(slug)
	gal, _ := app.Store.ListGallery()

	// Build response
	data := InviteData{
		Name:       guest.Name,
		ViewedAt:   guest.ViewedAt.Format(time.RFC3339),
		RSVPStatus: guest.RSVPStatus,
		Message:    guest.Message,
		Config:     app.Config,
	}
	// Flatten events
	for _, e := range evs {
		data.Events = append(data.Events, map[string]interface{}{
			"title":       e.Title,
			"dateTime":    e.DateTime,
			"location":    e.Location,
			"description": e.Description,
		})
	}
	// Flatten gallery
	for _, g := range gal {
		data.Gallery = append(data.Gallery, map[string]interface{}{
			"id":        g.ID,
			"imagePath": g.ImagePath,
		})
	}
	WriteJSON(w, http.StatusOK, data)
}
