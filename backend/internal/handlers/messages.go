package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/pramudityad/wedding-invitation-app/internal/store"
)

type MessagesHandler struct {
	store *store.Store
}

func NewMessagesHandler(store *store.Store) *MessagesHandler {
	return &MessagesHandler{store: store}
}

func (h *MessagesHandler) GetMessages(w http.ResponseWriter, r *http.Request) {
	// Get guests with messages
	guests, err := h.store.GetGuestsWithMessages()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to retrieve messages",
		})
		return
	}

	// Filter to only include name and message
	type messageResponse struct {
		Name    string `json:"name"`
		Message string `json:"message"`
	}
	var response []messageResponse

	for _, g := range guests {
		response = append(response, messageResponse{
			Name:    g.Name,
			Message: g.Message,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"messages": response,
	})
}
