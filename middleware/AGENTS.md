# MIDDLEWARE

**Generated:** 2026-02-28

Authentication middleware with service injection pattern. Each middleware in own subpackage.

## STRUCTURE
```
middleware/
├── auth/
│   ├── auth.go              # DEPRECATED - direct DB query
│   └── auth_with_service.go # CURRENT - service-injected JWT
└── apikey/
    └── apikey.go            # Admin API key auth
```

## CONVENTIONS

### Service Injection Pattern
Middleware receives service at registration, not per-request:
```go
// Constructor takes service
func JWTMiddlewareWithService(guestService *services.GuestService) gin.HandlerFunc

// Route registration injects from container
protected.Use(auth.JWTMiddlewareWithService(c.GuestService))
```

### Context Value Sharing
```go
// Middleware sets
c.Set("username", claims.Username)

// Handler retrieves
username := ctx.MustGet("username").(string)
```

## AUTH FLOW
```
Request → JWTMiddlewareWithService
         → Extract Bearer token
         → Parse JWT claims
         → guestService.ValidateGuestAccess(username)
              → Cache lookup (5min TTL)
              → Repository (on cache miss)
         → c.Set("username", ...)
         → Handler
```

## ERROR MESSAGES
| Status | Message |
|--------|---------|
| 401 | "Your session has expired. Please log in again." |
| 403 | "Your access has been revoked. Please contact the couple." |
| 401 | "Invalid API key" (admin) |

## WHERE TO LOOK
| Task | File |
|------|------|
| Modify JWT validation | `auth/auth_with_service.go` |
| Change auth error messages | `auth/auth_with_service.go:32-52` |
| Admin authentication | `apikey/apikey.go` |
| Route protection setup | `routes/routes.go:18,36,47` |

## NOTES
- `auth.go` is DEPRECATED - uses direct DB query, no cache
- `auth_with_service.go` is CURRENT - uses cached guest service
- API key compared against `config.AdminAPIKey` env var
- JWT secret from `config.JWTSecret` env var
