package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// RSVPRequest holds data from frontend
type RSVPRequest struct {
	RSVP    string `json:"rsvp"`    // "Yes", "No", "Maybe"
	Message string `json:"message"` // optional
}

// RSVPHandler updates RSVP status and message
func (app *AppContext) RSVPHandler(w http.ResponseWriter, r *http.Request) {
	slug := mux.Vars(r)["slug"]
	guest, err := app.Store.GetGuest(slug)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	// Check auth cookie
	sessionPw, err := r.Cookie("invite_pw_" + slug)
	if err != nil || !CheckPassword(guest.PasswordHash, sessionPw.Value) {
		WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}
	var req RSVPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	// Update fields
	guest.RSVPStatus = req.RSVP
	if req.Message != "" {
		guest.Message = req.Message
	}
	guest.ViewedAt = time.Now()
	if err := app.Store.UpdateGuest(guest); err != nil {
		WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to save"})
		return
	}
	WriteJSON(w, http.StatusOK, map[string]string{"status": "saved"})
}
