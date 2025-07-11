package models

import (
	"database/sql"
	"time"
)

type Comment struct {
	ID        int64
	GuestID   int64
	Content   string
	CreatedAt time.Time
}

func (c *Comment) Create(db *sql.DB) error {
	stmt := `INSERT INTO comments 
		(guest_id, content)
		VALUES (?, ?)`

	result, err := db.Exec(stmt,
		c.GuestID,
		c.Content)
	if err != nil {
		return err
	}

	c.ID, err = result.LastInsertId()
	return err
}

func GetCommentsByGuestID(db *sql.DB, guestID int64) ([]Comment, error) {
	stmt := `SELECT 
		id, guest_id, content, created_at
		FROM comments WHERE guest_id = ?
		ORDER BY created_at DESC`

	rows, err := db.Query(stmt, guestID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var comment Comment
		err := rows.Scan(
			&comment.ID,
			&comment.GuestID,
			&comment.Content,
			&comment.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

type CommentWithGuest struct {
	Comment
	GuestName string
}

// PaginatedComments represents a paginated list of comments.
type PaginatedComments struct {
	Comments   []CommentWithGuest `json:"comments"`
	TotalCount int                `json:"total_count"`
	NextCursor string             `json:"next_cursor,omitempty"`
}

func GetCommentCountByGuestID(db *sql.DB, guestID int64) (int, error) {
	var count int
	row := db.QueryRow("SELECT COUNT(*) FROM comments WHERE guest_id = ?", guestID)
	err := row.Scan(&count)
	return count, err
}

func GetAllCommentsWithGuests(db *sql.DB, limit int, cursor string) (*PaginatedComments, error) {
	// First, get the total count of comments
	totalCount, err := GetCommentCount(db)
	if err != nil {
		return nil, err
	}

	query := `
		SELECT
			c.id, c.guest_id, c.content, c.created_at,
			g.name as guest_name
		FROM comments c
		JOIN guests g ON c.guest_id = g.id
	`
	var args []interface{}
	if cursor != "" {
		cursorTime, err := time.Parse(time.RFC3339, cursor)
		if err != nil {
			return nil, err
		}
		query += " WHERE c.created_at < ?"
		args = append(args, cursorTime)
	}
	query += " ORDER BY c.created_at DESC LIMIT ?"
	args = append(args, limit+1)  // +1 to check for next page

	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []CommentWithGuest
	for rows.Next() {
		var comment CommentWithGuest
		err := rows.Scan(
			&comment.ID,
			&comment.GuestID,
			&comment.Content,
			&comment.CreatedAt,
			&comment.GuestName,
		)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	nextCursor := ""
	if len(comments) == limit+1 {
		// Has next page: set nextCursor and remove extra item
		lastComment := comments[len(comments)-1]
		nextCursor = lastComment.CreatedAt.Format(time.RFC3339)
		comments = comments[:len(comments)-1]
	}

	paginated := &PaginatedComments{
		Comments:   comments,
		TotalCount: totalCount,
		NextCursor: nextCursor,
	}
	return paginated, nil
}

// GetCommentCount returns the total number of comments.
func GetCommentCount(db *sql.DB) (int, error) {
	var count int
	row := db.QueryRow("SELECT COUNT(*) FROM comments")
	err := row.Scan(&count)
	return count, err
}
