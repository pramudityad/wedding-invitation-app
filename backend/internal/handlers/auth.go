package handlers

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes plaintext with bcrypt
func HashPassword(pw string) (string, error) {
	bs, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(bs), err
}

// CheckPassword compares plaintext to hashed
func CheckPassword(hash, pw string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw)); err != nil {
		return false
	}
	return true
}

// WriteJSON is a helper to write JSON + CORS headers
func WriteJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	// ignore errors for brevity
	json.NewEncoder(w).Encode(payload)
}
