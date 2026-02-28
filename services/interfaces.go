package services

import (
	"wedding-invitation-backend/models"
)

// GuestServiceInterface defines the interface for guest business logic
type GuestServiceInterface interface {
	GetGuestByName(name string) (*models.Guest, error)
	GetAllGuests() ([]models.Guest, error)
	CreateGuest(guest *models.Guest) error
	UpdateGuest(guest *models.Guest) error
	BulkCreateGuests(guests []models.Guest) error
	BulkUpdateGuests(guests []models.Guest) error
	MarkInvitationOpened(name string) error
	ValidateGuestAccess(name string) (*models.Guest, error)
}

// CommentServiceInterface defines the interface for comment business logic
type CommentServiceInterface interface {
	CreateComment(guestName, content string) (*models.CommentWithGuest, error)
	GetCommentsByGuest(guestName string) ([]models.Comment, error)
	GetAllComments() ([]models.Comment, error)
	GetAllCommentsWithGuests(limit int, cursor string) (*models.PaginatedComments, error)
}

// Compile-time checks to ensure implementations satisfy interfaces
var _ GuestServiceInterface = (*GuestService)(nil)
var _ CommentServiceInterface = (*CommentService)(nil)
