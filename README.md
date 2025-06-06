# Wedding Invitation App

## Overview
A full-stack application for managing digital wedding invitations with RSVP functionality.

## Features
- Personalized invitation pages for guests
- RSVP tracking with status updates
- Photo gallery
- Event details management
- Secure guest authentication

## Backend API

### Endpoints
- `POST /api/{slug}/login` - Authenticate guest
- `GET /api/{slug}/invite` - Get invitation details
- `POST /api/{slug}/rsvp` - Submit RSVP response

### API Usage Examples

Here are some example `curl` commands you can use to test the backend once it’s running (assuming you’ve already seeded a guest like `jane-doe` with password `secret123`):

To seed the database:

```bash
cd backend/cmd/seed
go run main.go
```

1.  **Login & save cookie**

    ```bash
    curl -X POST http://localhost:8080/api/jane-doe/login \
      -H "Content-Type: application/json" \
      -d '{"password":"secret123"}' \
      -c cookie.txt
    ```

    *   Sends `{"password":"secret123"}` to `/api/jane-doe/login`.
    *   Stores the session cookie in `cookie.txt` for subsequent requests.

2.  **Fetch invite data (using saved cookie)**

    ```bash
    curl http://localhost:8080/api/jane-doe/invite \
      -b cookie.txt
    ```

    *   Uses the cookie from `cookie.txt` to authorize.
    *   Returns JSON containing `name`, `viewedAt`, `rsvpStatus`, `message`, `events`, `gallery`, and `config`.

3.  **Submit an RSVP + message**

    ```bash
    curl -X POST http://localhost:8080/api/jane-doe/rsvp \
      -H "Content-Type: application/json" \
      -d '{"rsvp":"Yes","message":"Looking forward to it!"}' \
      -b cookie.txt
    ```

    *   Updates `jane-doe`’s `RSVPStatus` to “Yes” and sets her `message`.
    *   Returns `{"status":"saved"}` on success.

4.  **Fetch invite data again to verify changes**

    ```bash
    curl http://localhost:8080/api/jane-doe/invite \
      -b cookie.txt
    ```

    *   Now `rsvpStatus` should be `"Yes"` and `message` should be `"Looking forward to it!"`.

5.  **Attempt to fetch invite data without logging in**

    ```bash
    curl http://localhost:8080/api/jane-doe/invite
    ```

    *   Returns `401 Unauthorized` (no cookie).

6.  **Try a non-existent slug**

    ```bash
    curl http://localhost:8080/api/does-not-exist/invite -b cookie.txt
    ```

    *   Returns `404 Not Found`.

Make sure your backend is running on port 8080, and adjust `localhost:8080` if you’ve chosen a different address.
### Database Schema
```sql
-- Guests table
CREATE TABLE guests (
  slug TEXT PRIMARY KEY,
  name TEXT,
  password_hash TEXT,
  viewed_at TIMESTAMP,
  rsvp_status TEXT,
  message TEXT
);

-- Events table
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_slug TEXT,
  title TEXT,
  date_time TIMESTAMP,
  location TEXT,
  description TEXT,
  FOREIGN KEY(guest_slug) REFERENCES guests(slug)
);

-- Gallery table
CREATE TABLE gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_path TEXT,
  display_order INTEGER
);
```

## Frontend
Built with:
- React 18
- Tailwind CSS

### Setup
```bash
cd frontend
npm install
npm start
```

## Configuration
Configuration is managed through:
- `config/config.yaml` - Server configuration
- `config.json` - Frontend theme and assets

### Key Configuration Options
- Theme colors and fonts
- Image upload settings
- Background music
- Bank information for gifts
- Map embed code