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

func GetAllComments(db *sql.DB) ([]Comment, error) {
	stmt := `SELECT
		id, guest_id, content, created_at
		FROM comments
		ORDER BY created_at DESC`

	rows, err := db.Query(stmt)
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

func GetCommentCountByGuestID(db *sql.DB, guestID int64) (int, error) {
	var count int
	row := db.QueryRow("SELECT COUNT(*) FROM comments WHERE guest_id = ?", guestID)
	err := row.Scan(&count)
	return count, err
}

func GetAllCommentsWithGuests(db *sql.DB) ([]CommentWithGuest, error) {
	stmt := `SELECT
		c.id, c.guest_id, c.content, c.created_at,
		g.name as guest_name
		FROM comments c
		JOIN guests g ON c.guest_id = g.id
		ORDER BY c.created_at DESC`

	rows, err := db.Query(stmt)
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

	return comments, nil
}
