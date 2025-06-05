package main

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/pramudityad/wedding-invitation-app/internal/config"
	"github.com/pramudityad/wedding-invitation-app/internal/handlers"
	"github.com/pramudityad/wedding-invitation-app/internal/models"
	"github.com/pramudityad/wedding-invitation-app/internal/store"
)

func main() {
	// 1. Load config
	cfg := config.MustLoad(filepath.Join("..", "..", "..", "config", "config.yaml"))

	// 2. Setup DB and store
	db, err := models.SetupDatabase(filepath.Join("..", "..", "..", "data", "invite.db"))
	if err != nil {
		log.Fatalf("failed to open DB: %v", err)
	}
	st := store.NewStore(db)

	// 3. Create AppContext
	appCtx := &handlers.AppContext{
		Store:  st,
		Config: cfg,
	}

	// 4. Router setup
	r := mux.NewRouter()

	// Admin route - no slug required
	r.HandleFunc("/admin/rsvps", appCtx.AdminHandler).Methods("GET")

	// API subrouter for /api/{slug}/...
	api := r.PathPrefix("/api/{slug}").Subrouter()
	api.HandleFunc("/login", appCtx.LoginHandler).Methods("POST")
	api.HandleFunc("/invite", appCtx.GetInviteHandler).Methods("GET")
	api.HandleFunc("/rsvp", appCtx.RSVPHandler).Methods("POST")

	// 5. Static file serving (images, music)
	fs := http.FileServer(http.Dir(filepath.Join("..", "..", "frontend", "public")))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))

	// 6. Catch-all for 404
	r.NotFoundHandler = http.HandlerFunc(handlers.NotFoundHandler)

	// 7. Start server
	addr := ":8080"
	log.Printf("Starting backend server at %s", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
