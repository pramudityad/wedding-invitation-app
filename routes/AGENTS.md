# ROUTE HANDLERS

HTTP handlers organized by domain.

## STRUCTURE
- `routes.go` - Route registration, middleware setup
- `auth_routes.go` - Login, health check (public)
- `guest_routes.go` - Admin bulk operations (API key auth)
- `rsvp_routes.go` - RSVP submission/updates (JWT protected)
- `comment_routes.go` - Comment CRUD (JWT protected)
- `invitation_routes.go` - Invitation data (JWT protected)
- `guest_management_routes.go` - Guest profile (JWT protected)
- `spotify_routes.go` - Spotify endpoints (disabled)

## PATTERNS
- Receive `*container.Container` via dependency injection
- Access services: `c.GuestService`, `c.CommentService`
- Public: `/login/*`, `/health`
- JWT protected: `/` group with `auth.JWTMiddlewareWithService(c.GuestService)`
- API key protected: `/admin` group with `apikey.APIKeyMiddleware()`

## WHERE TO LOOK
| Task | File |
|------|------|
| Add protected route | Register in `routes.go` protected group, add handler in appropriate file |
| Admin bulk operations | `guest_routes.go` |
| Guest auth | `auth_routes.go` |
| RSVP handling | `rsvp_routes.go` |
| Comments | `comment_routes.go` |
