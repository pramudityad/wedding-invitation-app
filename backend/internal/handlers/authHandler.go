package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// LoginPayload holds password sent by frontend
type LoginPayload struct {
	Password string `json:"password"`
}

// LoginHandler checks password and sets session cookie
func (app *AppContext) LoginHandler(w http.ResponseWriter, r *http.Request) {
	slug := mux.Vars(r)["slug"]
	guest, err := app.Store.GetGuest(slug)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	var payload LoginPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	if !CheckPassword(guest.PasswordHash, payload.Password) {
		WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "incorrect password"})
		return
	}
	// Set cookie valid for e.g. 1 day
	cookie := http.Cookie{
		Name:     "invite_pw_" + slug,
		Value:    payload.Password,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	}
	http.SetCookie(w, &cookie)
	WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
