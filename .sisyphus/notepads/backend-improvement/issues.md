# Issues

## [2026-02-27] Session ses_35eb8a5ddffeH5PLFbhrqVHGIu — Plan Start

### Known Issues to Fix
- `models/comment.go:16-40`: `Create()` lacks transaction — count check + insert not atomic
- `models/guest.go:260-277`: `MarkInvitationOpened()` lacks transaction — no rollback on failure
- `cache/memory_cache.go:60-64`: `Get()` calls `delete()` under `RLock()` — DATA RACE
- `cache/memory_cache.go:93-104`: `cleanup()` goroutine has no stop mechanism — goroutine leak
- `database/database.go:23`: Hardcoded `"data/guests.db"` path — ignores `config.DBPath`
- `routes/guest_routes.go:99-107`: CSV parsing accesses `record[0..3]` without bounds check
- `routes/comment_routes.go:52`: Uses `strings.Contains(err.Error(), ...)` — fragile string matching
- `middleware/auth/auth.go`: Deprecated — `Claims` + `GenerateToken()` must be extracted before deletion
- `routes/comment_routes.go:20`: Uses deprecated `auth.JWTMiddleware()` — must migrate to `JWTMiddlewareWithService`
- `spotify/` directory: Dead code — entire package + routes + config vars must be removed

## 2026-02-28: Missing Comment Count Endpoint

**Issue:** Task specified testing `/api/comments/count` endpoint but it does not exist.

**Status:** Not a bug - endpoint was never implemented.

**Workaround:** The `/comments` endpoint returns `total_count` in the response:
```json
{"comments":[...],"total_count":2}
```

**Action Required:** If a dedicated count endpoint is needed, it should be implemented in `routes/comment_routes.go`.

---

## 2026-02-28: RSVP Only Updates Attending

**Issue:** RSVP endpoint only updates the `attending` field, not `plus_ones` or `dietary_restrictions`.

**Location:** `routes/rsvp_routes.go:53`

**Code:**
```go
existingGuest.Attending = sql.NullBool{Bool: request.Attending, Valid: true}
```

**Impact:** Guest cannot update meal preferences or plus-one count through RSVP flow.

**Action Required:** Extend `rsvpRequest` struct and update handler if needed.
