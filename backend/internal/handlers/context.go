package handlers

import (
	"github.com/pramudityad/wedding-invitation-app/internal/config"
	"github.com/pramudityad/wedding-invitation-app/internal/store"
)

// AppContext holds shared references
type AppContext struct {
	Store  *store.Store
	Config *config.Config
}
