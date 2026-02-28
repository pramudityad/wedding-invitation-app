# Learnings

## [2026-02-27] Session ses_35eb8a5ddffeH5PLFbhrqVHGIu — Plan Start

### Codebase Conventions
- SQLite driver: `modernc.org/sqlite` (pure Go, no CGO) — use `:memory:` for tests
- Transaction pattern: `tx.Begin()` → `defer tx.Rollback()` → operations → `tx.Commit()` (see `models/guest.go:18-55`)
- DI: All services wired in `container/container.go` — routes receive via container
- Cache keys: `"guest_" + name`, `"all_guests"` for individual/list queries
- Function-field mocks preferred (no mockgen, no `mocks/` directory)

### [2026-02-28] Task 15: Schema Drift Fix
- Extracted shared schema to `database/schema.go` with `SchemaSQL` constant and `CreateSchema()` function
- Updated `database/database.go` to use `CreateSchema(DB)` instead of inline SQL
- Updated `models/guest_test.go` setupDB to use `database.CreateSchema(db)`
- `models/comment_test.go` uses the shared setupDB from guest_test.go (same package)
- Added UNIQUE constraint on `guests.name` in shared schema - this was in test schema but not production, so unifying them requires the stricter constraint
- Tests now pass: `go test ./models/...` and `go test ./...` both pass
- Build verified: `go build -o /dev/null .` succeeds
- `t.Cleanup()` preferred over `defer` for test teardown
- `gin.SetMode(gin.TestMode)` required in all HTTP tests
- Config globals: `config.JWTSecret`, `config.AdminAPIKey` — must set in tests

## [2026-02-28] Task 3 — Interface Extraction for Testability

### Interface Pattern
- Define interfaces in same package as implementations (e.g., `services/interfaces.go`, `cache/interfaces.go`)
- Compile-time checks: `var _ Interface = (*Implementation)(nil)` at bottom of interface file
- Interfaces should include all public methods of the concrete type
- `Stop()` method required in cache interfaces for goroutine cleanup (stub implementation added, full impl in Task 10)

### Dependency Injection Updates
- Container struct fields should use interface types for testability
- Service constructors accept interface types where dependencies are injected
- GuestService uses `GuestCacheInterface` not `*cache.GuestCache`
- CommentService uses `GuestServiceInterface` not `*GuestService`

### Pre-existing Issues Found
- `TestGetAllCommentsWithGuests` in models/comment_test.go fails (ordering issue, unrelated to interfaces)
- Build errors in middleware/auth and main.go (pre-existing, unrelated to interfaces)


## [2026-02-28] Task 8 — Middleware Tests

### HTTP Testing Pattern with Gin
- Use `gin.CreateTestContext(w)` with `httptest.NewRecorder()` for testing middleware
- Router pattern: `router.Use(middleware)` → `router.GET("/test", handler)` → `router.ServeHTTP(w, req)`
- Always call `gin.SetMode(gin.TestMode)` in `init()` or `TestMain()`

### Function-Field Mock Pattern
- Define mock struct with function fields for each interface method
- Check `if m.Func != nil` before calling, return zero values otherwise
- Example: `ValidateGuestAccessFunc func(name string) (*models.Guest, error)`
- Add compile-time check: `var _ Interface = (*mock)(nil)`

### JWT Testing
- `GenerateToken()` requires `config.JWTSecret` and `config.JWTExpiry` to be set
- For expired token tests, manually create token with `jwt.NewWithClaims()` and past `ExpiresAt`
- Token parsing uses `jwt.ParseWithClaims()` with `Claims{}` struct

### API Key Middleware
- Checks `X-API-Key` header against `config.AdminAPIKey`
- Empty string header is treated as missing (returns 401 "API key required")
- Wrong key returns 401 "Invalid API key"


## [2026-02-28] Task 6 — Model Test Extensions

### SQLite Foreign Key Constraints
- SQLite doesn't enforce foreign keys by default — must run `PRAGMA foreign_keys = ON;` after opening connection
- Without this, FK violations silently succeed (INSERT with non-existent guest_id works)
- Added to `setupDB()` helper for all tests

### SQLite UNIQUE Constraints
- Test schema needs `UNIQUE` constraint on `guests.name` column to test duplicate name errors
- Error message format: `constraint failed: UNIQUE constraint failed: guests.name (2067)`

### Empty Slice Behavior
- Go's `GetAll*` functions return `nil` slice (not empty slice) when no rows exist
- `nil` slice has length 0, so `assert.Len(t, slice, 0)` works correctly
- `assert.NotNil(t, slice)` fails for `nil` slices — use `assert.Len()` instead

### Pagination Cursor Edge Cases
- `GetAllCommentsWithGuests(db, limit, cursor)` uses RFC3339 timestamp cursor
- Empty cursor ("") works correctly for first page
- Far future cursor ("2999-12-31T23:59:59Z") returns all results (all timestamps are "before")

### Test Helper Pattern
- `t.Helper()` in setup functions makes test failures report correct line numbers
- Use `t.Cleanup(func() { db.Close() })` instead of `defer db.Close()` for teardown


## [2026-02-28] Task 7 — Service Tests with Function-Field Mocks

### Function-Field Mock Pattern
- Define mock struct with function fields matching interface methods
- Check `if m.Func != nil` before calling, return zero values otherwise
- Add compile-time check: `var _ Interface = (*mock)(nil)`
- Allows flexible per-test behavior customization without external tools

### Testing Same-Package Unexported Fields
- Tests in same package can access unexported struct fields
- Helper function `newGuestServiceWithCache(mockCache)` injects mock into unexported `guestCache` field
- Alternative: Constructor injection with interface type (used in CommentService)

### Service Test Coverage
- GuestService tests: GetGuestByName (found/not found/error), GetAllGuests, ValidateGuestAccess (delegates to GetGuestByName)
- CommentService tests: CreateComment (success/guest not found/repo error), GetCommentsByGuest (cache miss/hit), GetAllCommentsWithGuests
- Cache hit test: call method twice, verify repo mock called only once using call counter

### CommentService Cache Behavior
- `CommentService` creates internal `MemoryCache` in constructor
- Cannot mock internal cache directly — test cache behavior by verifying repo call counts
- `t.Cleanup(func() { service.commentCache.Stop() })` stops cache goroutine after test


## [2026-02-28] Task 5 — Cache Layer TDD Tests (RED Phase)

### MemoryCache Test Patterns
- Test functions: SetAndGet, GetMissing, GetExpired, Delete, Clear, Concurrent
- Use short TTL (10ms) for expiration tests with `time.Sleep(20ms)` to ensure expiry
- `t.Cleanup(func() { cache.Stop() })` for teardown (preferred over defer)
- `NewMemoryCache(ttl)` takes `time.Duration` parameter

### Exposing Race Conditions
- RLock bug: `Get()` calls `delete(c.items, key)` under `RLock()` — write under read lock
- To trigger: use very short TTL (1ms) + concurrent Set/Get/Delete with expiring items
- 100 goroutines × 100 operations reliably triggers the race
- Race detector output shows: `WARNING: DATA RACE` at `memory_cache.go:62` (delete line)
- Test also triggers `fatal error: concurrent map read and map write`

### GuestCache Mock Pattern
- Function-field mock in `_test.go` file (no external mock tools)
- Mock implements `repositories.GuestRepository` interface
- Track call counts with closure variables: `callCount++` inside mock function
- Cache hit test: call GetByName twice, assert repo called only once
- Cache invalidation test: call Create, then GetByName — assert repo called twice

### Cache Key Conventions
- Individual guest: `"guest_" + name`
- All guests list: `"all_guests"`
- Create/Update/BulkCreate/BulkUpdate/MarkInvitationOpened all invalidate relevant caches

### TDD RED Phase Evidence
- Non-concurrent tests pass (9 tests)
- `go test -race -run TestMemoryCache_Concurrent` shows DATA RACE
- Evidence saved to `.sisyphus/evidence/task-5-*.txt`


## [2026-02-28] Task 11 — CSV Bounds Check & Sentinel Error

### CSV Bounds Checking
- Added `len(record) < 4` check before accessing CSV fields in `routes/guest_routes.go:99-100`
- Returns meaningful error: `invalid CSV row at line %d: expected 4 fields, got %d`
- Prevents panic when malformed CSV has fewer than 4 columns

### Sentinel Error Pattern
- Defined `ErrCommentLimitReached` in `models/comment.go:9-10`
- Package-level variable: `var ErrCommentLimitReached = errors.New("maximum comment limit reached")`
- Updated `Comment.Create()` to return sentinel instead of inline error
- Updated `routes/comment_routes.go:55` to use `errors.Is(err, models.ErrCommentLimitReached)`

### Why Sentinel Errors
- `errors.Is()` is compile-time safe and refactor-proof
- String matching (`strings.Contains(err.Error(), ...)`) breaks silently if message wording changes
- Allows explicit error handling without magic strings
- `strings` import retained in comment_routes.go for `strings.TrimSpace()` usage

### Verification
- `go build ./...` passes
- `go test ./models/...` passes (cache concurrent test failure is known issue)




## [2026-02-28] Task 3 — Interface Verification (Re-check)

### Status
- Interfaces were already defined from prior work
- All compile-time checks verified present
- Build and tests pass

### Interface Coverage
- `services/interfaces.go`: GuestServiceInterface (8 methods), CommentServiceInterface (4 methods)
- `cache/interfaces.go`: CacheInterface (6 methods), GuestCacheInterface (8 methods)

### DI Chain Verification
- Container → Interface types (GuestServiceInterface, CommentServiceInterface)
- GuestService → cache.GuestCacheInterface
- CommentService → GuestServiceInterface, cache.CacheInterface

### Compile-Time Check Pattern
```go
// At bottom of interface file
var _ InterfaceName = (*Implementation)(nil)
```
This catches interface/implementation mismatches at compile time, not runtime.
#KV|# [2026-02-28] Task 2 — Auth Migration

## Task Description
- Extract `Claims` struct and `GenerateToken()` from `middleware/auth/auth.go` to `middleware/auth/auth_with_service.go`
- Delete `middleware/auth/auth.go`
- Migrate `routes/comment_routes.go` from `auth.JWTMiddleware()` to `auth.JWTMiddlewareWithService(c.GuestService)`

## Findings
- `middleware/auth/auth.go` does NOT exist (already deleted in prior work)
- `middleware/auth/auth_with_service.go` already contains:
  - `JWTMiddlewareWithService()` at lines 14-67
  - `Claims` struct at lines 69-73
  - `GenerateToken()` at lines 75-88
- `routes/comment_routes.go:23` already uses `auth.JWTMiddlewareWithService(c.GuestService)`
- `routes/auth_routes.go:45` uses `auth.GenerateToken(guest.Name)`

## Verification
- `go build ./...` succeeds
- `go test ./models/...` succeeds
- No references to deprecated `auth.JWTMiddleware()` exist in codebase

## Conclusion
The auth migration was already completed in a prior session. Task is already done.

## [2026-02-28] Task 13 — Route Handler Tests

### Route Testing Pattern
- Create shared test file (`routes_test.go`) with mock implementations for `GuestServiceInterface` and `CommentServiceInterface`
- Use `setupTestRouter()` and `setupTestContainer()` helpers for consistent setup
- Use `generateTestToken()` helper with `auth.GenerateToken()` for JWT-protected routes
- All routes use `httptest.NewRecorder()` + `router.ServeHTTP(w, req)` — no real HTTP server

### Mock Container Pattern
- Create mock structs with function fields for each interface method
- Use `setupTestContainer()` to create `*container.Container` with mocked services
- Routes receive container via DI, so tests inject mocks through container

### Route Test Coverage
- **auth_routes_test.go**: 4 tests (health check, valid guest, guest not found, service error)
- **comment_routes_test.go**: 7 tests (create success, empty content, limit reached, get by guest, get all, pagination, guest management)
- **rsvp_routes_test.go**: 4 tests (attending, not attending, guest not found, invalid request)
- **guest_routes_test.go**: 6 tests (bulk upload success, missing file, empty CSV, bulk update success, empty data, get all RSVPs)

### Multipart Form Testing
- Use `mime/multipart` package for file upload tests
- Create helper `createMultipartForm()` to build form data with CSV content
- Set `Content-Type` header to `writer.FormDataContentType()`

### Admin Route Testing
- Set `config.AdminAPIKey` in tests for admin routes
- Include `X-API-Key` header in requests to `/admin/*` endpoints

### JWT-Protected Route Testing
- Use `setupTestConfig()` to set `config.JWTSecret` and `config.JWTExpiry`
- Mock `ValidateGuestAccessFunc` on guest service for JWT middleware
- Add `Authorization: Bearer <token>` header to requests




## [2026-02-28] Final Verification F2 — Code Quality Review

### Verification Results
```
Build [PASS] | Vet [PASS] | Tests [6 pass/0 fail] | Race [PASS]
Files Checked: 28
Issues Found: None
VERDICT: PASS
```

### Code Quality Checks Performed
1. **go build ./...** - Zero errors
2. **go vet ./...** - No issues
3. **go test ./...** - All tests pass (6 test packages, some have no test files)
4. **go test -race ./...** - No race conditions detected

### Manual Code Review (28 changed files)
- ✅ No commented-out code blocks
- ✅ No unused imports
- ✅ No empty error handling (`_ = err`)
- ✅ No `//nolint` directives without justification
- ✅ No overly generic names
- ✅ No AI slop (excessive comments, over-abstraction)

### Files Reviewed
- `cache/`: guest_cache.go, guest_cache_test.go, interfaces.go, memory_cache.go, memory_cache_test.go
- `config/`: config.go
- `container/`: container.go
- `database/`: database.go
- `main.go`
- `middleware/apikey/`: apikey_test.go
- `middleware/auth/`: auth_test.go, auth_with_service.go
- `models/`: comment.go, comment_test.go, guest.go, guest_test.go
- `repositories/`: comment_repository.go, guest_repository.go
- `routes/`: comment_routes.go, guest_routes.go, routes.go
- `services/`: comment_service.go, comment_service_test.go, guest_service.go, guest_service_test.go, interfaces.go

### Test Package Summary
| Package | Status |
|---------|--------|
| wedding-invitation-backend | no test files |
| config | no test files |
| container | no test files |
| database | no test files |
| repositories | no test files |
| cache | PASS |
| middleware/apikey | PASS |
| middleware/auth | PASS |
| models | PASS |
| routes | PASS |
| services | PASS |
## 2026-02-28: Final QA Verification

### API Endpoint Paths
- Guest profile: `/guests?name=TestGuest` (not `/api/guest/profile`)
- RSVP: `/rsvp` (not `/api/rsvp`)
- Comments: `/comments` (not `/api/comments`)
- Comments (own): `/comments/me`
- Admin guests: `/admin/guests/bulk` (CSV upload)
- Admin RSVPs: `/admin/rsvps`

### RSVP Request Format
```json
{"name":"TestGuest","attending":true}
```
- `name` is required field
- Only updates `attending` status (not plus_ones or dietary)

### Comment Limit Enforcement
- Max 2 comments per guest enforced at service layer
- Returns `models.ErrCommentLimitReached` error
- HTTP 400 with clear error message

### Missing Endpoints
- `/comments/count` - Not implemented
- Count is returned in `/comments` response as `total_count`

### Auth Headers
- JWT: `Authorization: Bearer <token>`
- API Key: `X-API-Key: <key>`

### Default Config Values (dev only)
- JWT_SECRET: "test-secret"
- ADMIN_API_KEY: "admin-api-key"
