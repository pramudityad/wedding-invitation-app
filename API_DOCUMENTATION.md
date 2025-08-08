# Wedding Invitation API Documentation

## Base URL
`http://localhost:8080`

## Overview

This API provides wedding invitation functionality with modern architecture including:
- **Dependency Injection** for clean, testable code
- **Service Layer Architecture** with repository pattern
- **In-Memory Caching** for improved performance (5min TTL for guests, 2min for comments)
- **Database Indexing** for optimized queries
- **Enhanced Error Messages** for better user experience

## Authentication

The API uses JWT-based authentication. Guests must exist in the database to obtain tokens.

### Login
```bash
curl -X GET http://localhost:8080/login/John%20Doe
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Welcome! You're successfully logged in."
}
```

**Error Responses:**
- `400` - Invalid name encoding
- `403` - Guest not found: "We couldn't find your name on our guest list. Please check the spelling or contact us if you believe this is an error."
- `500` - Server error: "We're having trouble accessing the guest list right now. Please try again in a moment."

### Using JWT Token
Include the token in the Authorization header for protected routes:
```bash
curl -X GET http://localhost:8080/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Public Endpoints

### Health Check
```bash
curl -X GET http://localhost:8080/health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

## Protected Endpoints (Require JWT)

All protected routes use cached guest validation for improved performance.

### RSVP Management

#### Submit RSVP
```bash
curl -X POST http://localhost:8080/rsvp \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "attending": true
  }'
```

**Success Response (200):**
```json
{
  "message": "Thank you for confirming your attendance! We can't wait to celebrate with you.",
  "guest": {
    "ID": 1,
    "Name": "John Doe",
    "Attending": {
      "Bool": true,
      "Valid": true
    },
    "PlusOnes": 0,
    "DietaryRestrictions": {
      "String": "",
      "Valid": false
    },
    "CreatedAt": "2024-01-01T00:00:00Z",
    "UpdatedAt": "2024-01-01T00:00:00Z",
    "FirstOpenedAt": {
      "Time": "0001-01-01T00:00:00Z",
      "Valid": false
    }
  }
}
```

**Error Responses:**
- `400` - Invalid data: "Please provide valid RSVP information."
- `404` - Guest not found: "We couldn't find your guest information. Please contact support."
- `500` - Server error: "We're having trouble processing your RSVP. Please try again."

### Guest Management

#### Get Guest Information
```bash
curl -X GET http://localhost:8080/guests?name=John%20Doe \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):** Returns guest object
**Error Responses:**
- `400` - Missing name: "Please provide a guest name to search for."
- `404` - Not found: "No guest found with that name. Please check the spelling and try again."
- `500` - Server error: "We're having trouble accessing guest information right now. Please try again."

### Invitation Tracking

#### Mark Invitation Opened
```bash
curl -X POST http://localhost:8080/mark-opened \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**
```json
{
  "status": "Welcome! Your invitation has been opened."
}
```

**Error Response (500):**
```json
{
  "error": "We're having trouble tracking your invitation. This won't affect your access."
}
```

### Comment System

#### Submit Comment
```bash
curl -X POST http://localhost:8080/comments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Looking forward to the celebration!"
  }'
```

**Response (200):**
```json
{
  "message": "Comments temporarily disabled"
}
```

#### Get My Comments
```bash
curl -X GET http://localhost:8080/comments/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get All Comments
```bash
curl -X GET http://localhost:8080/comments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Spotify Integration

#### Get Playlists
```bash
curl -X GET http://localhost:8080/spotify/playlists \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Control Playback
```bash
# Play music
curl -X POST http://localhost:8080/spotify/play \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Pause music  
curl -X POST http://localhost:8080/spotify/pause \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Admin Endpoints (Require API Key)

Admin routes use API key authentication via `X-API-Key` header or `ADMIN_API_KEY` environment variable.

### Bulk Guest Operations

#### Upload Guest List (CSV)
```bash
curl -X POST http://localhost:8080/admin/guests/bulk \
  -H "X-API-Key: admin-api-key" \
  -F "file=@guests.csv"
```

**CSV Format:**
```
name,attending,plus_ones,dietary_restrictions
John Doe,true,2,vegetarian
Jane Smith,,1,
```

**Success Response (200):**
```json
{
  "message": "Successfully uploaded 15 guests to the wedding list!",
  "count": 15
}
```

**Error Responses:**
- `400` - No file: "Please select a CSV file to upload."
- `400` - Wrong format: "Please upload a CSV file only."
- `400` - Parse error: "There's an issue with the CSV format. Please check your file and try again."
- `400` - Empty file: "The CSV file appears to be empty or contains no valid guest data."
- `500` - Server error: "Unable to save the guest list to the database. Please try again."

#### Bulk Update Guests
```bash
curl -X PUT http://localhost:8080/admin/guests/bulk \
  -H "X-API-Key: admin-api-key" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "ID": 1,
      "Name": "John Doe",
      "Attending": {"Bool": true, "Valid": true},
      "PlusOnes": 2
    }
  ]'
```

#### Get All RSVPs
```bash
curl -X GET http://localhost:8080/admin/rsvps \
  -H "X-API-Key: admin-api-key"
```

**Success Response (200):**
```json
{
  "count": 50,
  "rsvps": [
    {
      "ID": 1,
      "Name": "John Doe",
      "Attending": {"Bool": true, "Valid": true},
      "PlusOnes": 2,
      "DietaryRestrictions": {"String": "vegetarian", "Valid": true},
      "CreatedAt": "2024-01-01T00:00:00Z",
      "UpdatedAt": "2024-01-01T00:00:00Z",
      "FirstOpenedAt": {"Time": "2024-01-01T12:00:00Z", "Valid": true}
    }
  ]
}
```

## Performance Features

### Caching System
- **Guest Lookups**: 5-minute TTL with automatic invalidation on updates
- **Comments**: 2-minute TTL for comment queries
- **JWT Middleware**: Uses cached guest validation (no DB query per request)
- **Admin Operations**: Cache invalidation on bulk operations

### Database Optimization
- **Indexed Fields**: `guests.name`, `comments.guest_id`, `guests.attending`
- **Composite Indexes**: `comments(guest_id, created_at DESC)` for ordered queries
- **Connection Pooling**: SQLite with optimized connection handling

### Error Handling
- **User-Friendly Messages**: Clear, actionable error messages
- **Consistent Format**: Standardized error response structure
- **Detailed Logging**: Server-side logging for debugging while protecting user privacy

## Environment Configuration

### Required Variables
- `JWT_SECRET`: JWT signing secret (default: "test-secret" - ⚠️ insecure for production)
- `ADMIN_API_KEY`: Admin API authentication (default: "admin-api-key" - ⚠️ insecure for production)

### Optional Variables
- `SERVER_PORT`: Server port (default: ":8080")
- `JWT_EXPIRY`: Token expiry in seconds (default: 86400)
- `DB_PATH`: Database file path (default: "data/guests.db")
- `SPOTIFY_CLIENT_ID`: Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify app secret
- `SPOTIFY_REDIRECT_URI`: OAuth callback URL
- `SPOTIFY_CACHE_SECONDS`: API cache duration (default: 300)

### Configuration Validation
The server validates configuration on startup and logs warnings for:
- Default security values in production
- Missing Spotify configuration
- Invalid environment variable combinations

## Architecture Notes

### Service Layer Pattern
- **GuestService**: Handles guest business logic with caching
- **CommentService**: Manages comment operations with cache invalidation
- **Dependency Injection**: Clean separation of concerns via container pattern

### Repository Pattern
- **GuestRepository**: Interface for guest data access
- **CommentRepository**: Interface for comment data access  
- **SQLRepository**: Concrete implementation using SQLite

### Cache Strategy
- **Write-Through**: Updates go to database first, then invalidate cache
- **TTL-Based**: Automatic expiration with background cleanup
- **Thread-Safe**: Concurrent access with proper locking