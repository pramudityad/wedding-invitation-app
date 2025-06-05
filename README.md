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