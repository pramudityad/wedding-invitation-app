# Wedding Invitation API Documentation

## Base URL
`http://localhost:8080`

## Authentication

Most endpoints require JWT authentication. First obtain a token:

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use the token in subsequent requests:
```bash
curl -X GET http://localhost:8080/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Public Endpoints

### Health Check
```bash
curl -X GET http://localhost:8080/health
```

### Submit RSVP
```bash
curl -X POST http://localhost:8080/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "attending": true,
    "guests": 2,
    "message": "Looking forward to it!"
  }'
```

## Protected Endpoints (Require JWT)

### Test Protected Route
```bash
curl -X GET http://localhost:8080/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All RSVPs (Admin)
```bash
curl -X GET http://localhost:8080/admin/rsvps \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Submit Comment
```bash
curl -X POST http://localhost:8080/comments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my comment"
  }'
```

### Get My Comments
```bash
curl -X GET http://localhost:8080/comments/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Comments
```bash
curl -X GET http://localhost:8080/comments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Spotify Integration

### Start Spotify Auth Flow
```bash
curl -X GET http://localhost:8080/spotify/auth \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Spotify Callback (Handled by frontend)

### Get Playlists
```bash
curl -X GET http://localhost:8080/spotify/playlists \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Play Music
```bash
curl -X POST http://localhost:8080/spotify/play \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Pause Music
```bash
curl -X POST http://localhost:8080/spotify/pause \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"