package models

import (
	"database/sql"
	"time"
)

type Guest struct {
	ID                  int64
	Name                string
	Email               string
	Attending           bool
	PlusOnes            int
	DietaryRestrictions sql.NullString
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

func (g *Guest) Create(db *sql.DB) error {
	stmt := `INSERT INTO guests 
		(name, email, attending, plus_ones, dietary_restrictions)
		VALUES (?, ?, ?, ?, ?)`

	result, err := db.Exec(stmt,
		g.Name,
		g.Email,
		g.Attending,
		g.PlusOnes,
		g.DietaryRestrictions)
	if err != nil {
		return err
	}

	g.ID, err = result.LastInsertId()
	return err
}

func GetGuestByEmail(db *sql.DB, email string) (*Guest, error) {
	stmt := `SELECT 
		id, name, email, attending, plus_ones, 
		dietary_restrictions, created_at, updated_at
		FROM guests WHERE email = ?`

	row := db.QueryRow(stmt, email)
	guest := &Guest{}
	err := row.Scan(
		&guest.ID,
		&guest.Name,
		&guest.Email,
		&guest.Attending,
		&guest.PlusOnes,
		&guest.DietaryRestrictions,
		&guest.CreatedAt,
		&guest.UpdatedAt,
	)

	return guest, err
}

func (g *Guest) Update(db *sql.DB) error {
	stmt := `UPDATE guests SET
		name = ?,
		attending = ?,
		plus_ones = ?,
		dietary_restrictions = ?,
		updated_at = CURRENT_TIMESTAMP
		WHERE email = ?`

	_, err := db.Exec(stmt,
		g.Name,
		g.Attending,
		g.PlusOnes,
		g.DietaryRestrictions,
		g.Email)

	return err
}

func GetAllGuests(db *sql.DB) ([]Guest, error) {
	stmt := `SELECT 
		id, name, email, attending, plus_ones, 
		dietary_restrictions, created_at, updated_at
		FROM guests`

	rows, err := db.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var guests []Guest
	for rows.Next() {
		var guest Guest
		err := rows.Scan(
			&guest.ID,
			&guest.Name,
			&guest.Email,
			&guest.Attending,
			&guest.PlusOnes,
			&guest.DietaryRestrictions,
			&guest.CreatedAt,
			&guest.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		guests = append(guests, guest)
	}

	return guests, nil
}
