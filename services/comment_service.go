package services

import (
	"time"
	"wedding-invitation-backend/cache"
	"wedding-invitation-backend/models"
	"wedding-invitation-backend/repositories"
)

// CommentService handles comment business logic
type CommentService struct {
	commentRepo repositories.CommentRepository
	guestService *GuestService
	commentCache *cache.MemoryCache
}

// NewCommentService creates a new comment service
func NewCommentService(commentRepo repositories.CommentRepository, guestService *GuestService) *CommentService {
	return &CommentService{
		commentRepo:  commentRepo,
		guestService: guestService,
		commentCache: cache.NewMemoryCache(2 * time.Minute), // 2 minute TTL for comments
	}
}

// CreateComment creates a new comment
func (cs *CommentService) CreateComment(guestName, content string) (*models.Comment, error) {
	// Validate guest exists
	guest, err := cs.guestService.GetGuestByName(guestName)
	if err != nil {
		return nil, err
	}
	
	if guest == nil {
		return nil, nil // Guest not found
	}
	
	// Create comment
	comment := &models.Comment{
		GuestID: guest.ID,
		Content: content,
	}
	
	err = cs.commentRepo.Create(comment)
	if err != nil {
		return nil, err
	}
	
	// Invalidate comment caches
	cs.commentCache.Clear()
	
	return comment, nil
}

// GetCommentsByGuest retrieves comments for a specific guest (cached)
func (cs *CommentService) GetCommentsByGuest(guestName string) ([]models.Comment, error) {
	// Get guest to validate access
	guest, err := cs.guestService.GetGuestByName(guestName)
	if err != nil {
		return nil, err
	}
	
	if guest == nil {
		return nil, nil // Guest not found
	}
	
	// Try cache first
	cacheKey := "comments_guest_" + guestName
	if cached, found := cs.commentCache.Get(cacheKey); found {
		if comments, ok := cached.([]models.Comment); ok {
			return comments, nil
		}
	}
	
	// Cache miss, get from repository
	comments, err := cs.commentRepo.GetByGuestID(guest.ID)
	if err != nil {
		return nil, err
	}
	
	// Cache the result
	cs.commentCache.Set(cacheKey, comments)
	
	return comments, nil
}

// GetAllComments retrieves all comments (cached)
func (cs *CommentService) GetAllComments() ([]models.Comment, error) {
	// Try cache first
	if cached, found := cs.commentCache.Get("all_comments"); found {
		if comments, ok := cached.([]models.Comment); ok {
			return comments, nil
		}
	}
	
	// Cache miss, get from repository
	comments, err := cs.commentRepo.GetAll()
	if err != nil {
		return nil, err
	}
	
	// Cache the result
	cs.commentCache.Set("all_comments", comments)
	
	return comments, nil
}