# Learnings

## [2026-02-27] Session ses_35eb8a5ddffeH5PLFbhrqVHGIu — Plan Start

### Codebase Conventions
- SQLite driver: `modernc.org/sqlite` (pure Go, no CGO) — use `:memory:` for tests
- Transaction pattern: `tx.Begin()` → `defer tx.Rollback()` → operations → `tx.Commit()` (see `models/guest.go:18-55`)
- DI: All services wired in `container/container.go` — routes receive via container
- Cache keys: `"guest_" + name`, `"all_guests"` for individual/list queries
- Function-field mocks preferred (no mockgen, no `mocks/` directory)
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
