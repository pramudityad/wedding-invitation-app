BEGIN TRANSACTION;
PRAGMA foreign_keys=off;

-- Backup existing guests table
CREATE TEMPORARY TABLE guests_backup AS SELECT * FROM guests;

-- Drop original table which has non-nullable attending
DROP TABLE guests;

-- Create new table with nullable attending
CREATE TABLE guests (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    attending INTEGER, -- SQLite stores booleans as 0/1 and allows NULL
    plus_ones INTEGER,
    dietary_restrictions TEXT,
    created_at DATETIME,
    updated_at DATETIME
);

-- Restore data from backup
INSERT INTO guests SELECT * FROM guests_backup;

-- Cleanup temporary table
DROP TABLE guests_backup;

PRAGMA foreign_keys=on;
COMMIT;
