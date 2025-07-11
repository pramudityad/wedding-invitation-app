package models

import (
	"database/sql"
	"log"
	"time"
)

type Guest struct {
	ID                  int64
	Name                string
	Attending           sql.NullBool
	PlusOnes            int
	DietaryRestrictions sql.NullString
	CreatedAt           time.Time
	UpdatedAt           time.Time
	FirstOpenedAt       sql.NullTime
}

func (g *Guest) Create(db *sql.DB) error {
	tx, err := db.Begin()
	if err != nil {
		log.Printf("Failed to begin transaction: %v", err)
		return err
	}
	defer tx.Rollback()

	stmt := `INSERT INTO guests
		(name, attending, plus_ones, dietary_restrictions)
		VALUES (?, ?, ?, ?)`

	result, err := tx.Exec(stmt,
		g.Name,
		g.Attending,
		g.PlusOnes,
		g.DietaryRestrictions)
	if err != nil {
		log.Printf("Failed to create guest: %v", err)
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		log.Printf("Failed to get last insert ID: %v", err)
		return err
	}
	g.ID = id

	if err := tx.Commit(); err != nil {
		log.Printf("Failed to commit transaction: %v", err)
		return err
	}

	log.Printf("Successfully created guest with ID %d", g.ID)
	return nil
}

func GetGuestByName(db *sql.DB, name string) (*Guest, error) {
	stmt := `SELECT
		id, name, attending, plus_ones,
		dietary_restrictions, created_at, updated_at, first_opened_at
		FROM guests WHERE name = ?`

	log.Printf("Querying guest with name: %s", name)
	row := db.QueryRow(stmt, name)
	guest := &Guest{}
	err := row.Scan(
		&guest.ID,
		&guest.Name,
		&guest.Attending,
		&guest.PlusOnes,
		&guest.DietaryRestrictions,
		&guest.CreatedAt,
		&guest.UpdatedAt,
		&guest.FirstOpenedAt,
	)

	if err == sql.ErrNoRows {
		log.Printf("No guest found with name: %s", name)
		return nil, nil
	} else if err != nil {
		log.Printf("Error querying guest: %v", err)
		return nil, err
	}

	log.Printf("Found guest: %+v", guest)
	return guest, nil
}

func (g *Guest) Update(db *sql.DB) error {
	tx, err := db.Begin()
	if err != nil {
		log.Printf("Failed to begin transaction: %v", err)
		return err
	}
	defer tx.Rollback()

	stmt := `UPDATE guests SET
		name = ?,
		attending = ?,
		plus_ones = ?,
		dietary_restrictions = ?,
		updated_at = CURRENT_TIMESTAMP
		WHERE id = ?`

	res, err := tx.Exec(stmt,
		g.Name,
		g.Attending,
		g.PlusOnes,
		g.DietaryRestrictions,
		g.ID)
	if err != nil {
		log.Printf("Failed to update guest: %v", err)
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		log.Printf("Failed to get rows affected: %v", err)
		return err
	}
	if rows == 0 {
		log.Printf("No rows affected - guest not found")
		return sql.ErrNoRows
	}

	if err := tx.Commit(); err != nil {
		log.Printf("Failed to commit transaction: %v", err)
		return err
	}

	log.Printf("Successfully updated guest with ID %d", g.ID)
	return nil
}

// BulkCreate creates multiple guests in a single transaction
func BulkCreate(db *sql.DB, guests []Guest) error {
	tx, err := db.Begin()
	if err != nil {
		log.Printf("Failed to begin transaction: %v", err)
		return err
	}
	defer tx.Rollback()

	stmt := `INSERT INTO guests
		(name, attending, plus_ones, dietary_restrictions)
		VALUES (?, ?, ?, ?)`

	for i := range guests {
		result, err := tx.Exec(stmt,
			guests[i].Name,
			guests[i].Attending,
			guests[i].PlusOnes,
			guests[i].DietaryRestrictions)
		if err != nil {
			log.Printf("Failed to create guest %s: %v", guests[i].Name, err)
			return err
		}

		id, err := result.LastInsertId()
		if err != nil {
			log.Printf("Failed to get last insert ID for guest %s: %v", guests[i].Name, err)
			return err
		}
		guests[i].ID = id
	}

	if err := tx.Commit(); err != nil {
		log.Printf("Failed to commit transaction: %v", err)
		return err
	}

	log.Printf("Successfully created %d guests", len(guests))
	return nil
}

// BulkUpdate updates multiple guests in a single transaction
func BulkUpdate(db *sql.DB, guests []Guest) error {
	tx, err := db.Begin()
	if err != nil {
		log.Printf("Failed to begin transaction: %v", err)
		return err
	}
	defer tx.Rollback()

	stmt := `UPDATE guests SET
		name = ?,
		attending = ?,
		plus_ones = ?,
		dietary_restrictions = ?,
		updated_at = CURRENT_TIMESTAMP
		WHERE id = ?`

	for i := range guests {
		res, err := tx.Exec(stmt,
			guests[i].Name,
			guests[i].Attending,
			guests[i].PlusOnes,
			guests[i].DietaryRestrictions,
			guests[i].ID)
		if err != nil {
			log.Printf("Failed to update guest %d: %v", guests[i].ID, err)
			return err
		}

		rows, err := res.RowsAffected()
		if err != nil {
			log.Printf("Failed to get rows affected for guest %d: %v", guests[i].ID, err)
			return err
		}
		if rows == 0 {
			log.Printf("No rows affected - guest %d not found", guests[i].ID)
			return sql.ErrNoRows
		}
	}

	if err := tx.Commit(); err != nil {
		log.Printf("Failed to commit transaction: %v", err)
		return err
	}

	log.Printf("Successfully updated %d guests", len(guests))
	return nil
}

func GetAllGuests(db *sql.DB) ([]Guest, error) {
	stmt := `SELECT
		id, name, attending, plus_ones,
		dietary_restrictions, created_at, updated_at, first_opened_at
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
			&guest.Attending,
			&guest.PlusOnes,
			&guest.DietaryRestrictions,
			&guest.CreatedAt,
			&guest.UpdatedAt,
			&guest.FirstOpenedAt,
		)
		if err != nil {
			return nil, err
		}
		guests = append(guests, guest)
	}

	return guests, nil
}
