# Draft: Backend Code Improvement

## Requirements (confirmed)
- Focus on: Reliability, Simplicity, Testability, Dead Code Removal
- Backend only (Go/Gin)
- User wants cleaner, more maintainable code

## Research Findings

### RELIABILITY Issues Found
1. **CRITICAL** `models/comment.go:16-40` - `Comment.Create()` has NO transaction. Check+insert is not atomic (race condition: two requests could both pass the count check and create a 3rd comment)
2. **CRITICAL** `models/guest.go:260-277` - `MarkInvitationOpened()` lacks transaction (no rollback on failure)
3. **MEDIUM** `cache/memory_cache.go:60-64` - `Get()` calls `delete()` with only RLock (race condition - mutates map under read lock)
4. **MEDIUM** `cache/memory_cache.go:93-104` - `cleanup()` goroutine runs forever, no shutdown mechanism (goroutine leak per cache instance)
5. **LOW** `database/database.go:23` - hardcoded DB path ignores `config.DBPath`

### SIMPLICITY Issues Found
1. **HIGH** Hybrid repo pattern is over-engineered: Models embed CRUD with `*sql.DB` → Repos are thin wrappers that delegate to models → Services wrap repos in cache. The model layer does SQL AND business logic, while repos add zero value (just pass-through calls)
2. **MEDIUM** `GuestService` is a passthrough to `GuestCache` which is a passthrough to `GuestRepository` which is a passthrough to `models.*` — 4 layers of indirection for simple CRUD
3. **MEDIUM** `CommentService` has inconsistent caching - uses raw `MemoryCache` directly instead of following the `GuestCache` decorator pattern
4. **LOW** `routes/comment_routes.go:20` applies `JWTMiddleware()` (deprecated) instead of `JWTMiddlewareWithService()` — creates a second auth group with the old middleware

### TESTABILITY Issues Found
1. **CRITICAL** Only 2 test files exist (models only). Zero tests for: services, routes, middleware, cache, repositories, config
2. **HIGH** Services depend on concrete types (`*cache.GuestCache`, `*services.GuestService`), not interfaces — can't mock them
3. **HIGH** `GuestService` struct field is `*cache.GuestCache` (concrete), bypassing the repository interface
4. **HIGH** Container struct exposes concrete types (`*services.GuestService`, `*services.CommentService`) — routes can't be tested with mocks
5. **HIGH** `database.DB` is a package-level global — direct import coupling, hard to test
6. **MEDIUM** Models require real `*sql.DB` for all operations — no interface to mock
7. **MEDIUM** `config` package uses `init()` with globals — pollutes test environment

### DEAD CODE Found
1. **spotify/** entire package (2 files: auth.go, client.go) — routes commented out in `routes.go:40`
2. **routes/spotify_routes.go** — entire file unused (SetupSpotifyRoutes never called)
3. **middleware/auth/auth.go:34-85** — `JWTMiddleware()` is the deprecated version, but STILL USED in `comment_routes.go:20`
4. **config.go** — `SpotifyClientId`, `SpotifyClientSecret`, `SpotifyRedirectURI`, `SpotifyCacheSeconds` are only used by dead spotify code
5. **main.go:37** — `spotify.Init()` called but spotify routes are disabled

## Technical Decisions (CONFIRMED)
1. **Simplification**: Conservative — keep 4 layers but add proper interfaces. Models keep CRUD, repos become proper interfaces (not passthrough), services own business logic. Minimal structural change, maximum testability gain.
2. **Dead Code**: Remove completely — delete spotify/ directory, spotify_routes.go, spotify.Init(), and spotify config vars.
3. **Test Strategy**: TDD for refactoring — write tests FIRST for current behavior, then refactor with tests as safety net. Slower but guarantees no behavior regressions.
4. **Deprecated Auth**: Migrate and delete — switch comment_routes.go to JWTMiddlewareWithService(), then delete auth.go entirely.

## Open Questions
NONE — All decisions made.

## Scope Boundaries
- INCLUDE: All Go backend code
- EXCLUDE: Frontend (React), Docker/deployment, Traefik config
