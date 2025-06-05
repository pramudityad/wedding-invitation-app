package main

import (
	"log"
	"time"

	"github.com/pramudityad/wedding-invitation-app/internal/handlers"
	"github.com/pramudityad/wedding-invitation-app/internal/models"
	"github.com/pramudityad/wedding-invitation-app/internal/store"
)

func main() {
	// Open DB
	db, err := models.SetupDatabase("../../../data/invite.db")
	if err != nil {
		log.Fatal(err)
	}
	st := store.NewStore(db)

	// Example guests
	guests := []models.Guest{
		{Slug: "jane-doe", Name: "Jane Doe"},
		{Slug: "john-smith", Name: "John Smith"},
	}
	for i := range guests {
		hash, err := handlers.HashPassword("secret123")
		if err != nil {
			log.Fatal(err)
		}
		guests[i].PasswordHash = hash
		guests[i].ViewedAt = time.Now()
		if err := st.CreateGuest(&guests[i]); err != nil {
			log.Fatal(err)
		}
		log.Printf("Created guest %s", guests[i].Slug)
	}
}
