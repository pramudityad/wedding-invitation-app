package repositories

import (
	"database/sql"
	"wedding-invitation-backend/models"
)

// CommentRepository defines the interface for comment data access
type CommentRepository interface {
	Create(comment *models.Comment) error
	GetByGuestID(guestID int64) ([]models.Comment, error)
	GetAll() ([]models.Comment, error)
	GetAllWithGuests(limit int, cursor string) (*models.PaginatedComments, error)
}

// SQLCommentRepository implements CommentRepository using SQL database
type SQLCommentRepository struct {
	db *sql.DB
}

// NewSQLCommentRepository creates a new SQL-based comment repository
func NewSQLCommentRepository(db *sql.DB) CommentRepository {
	return &SQLCommentRepository{db: db}
}

func (r *SQLCommentRepository) Create(comment *models.Comment) error {
	return comment.Create(r.db)
}

func (r *SQLCommentRepository) GetByGuestID(guestID int64) ([]models.Comment, error) {
	return models.GetCommentsByGuestID(r.db, guestID)
}

func (r *SQLCommentRepository) GetAll() ([]models.Comment, error) {
	return models.GetAllComments(r.db)
}

func (r *SQLCommentRepository) GetAllWithGuests(limit int, cursor string) (*models.PaginatedComments, error) {
	return models.GetAllCommentsWithGuests(r.db, limit, cursor)
}