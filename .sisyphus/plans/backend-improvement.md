# Backend Code Improvement: Reliability, Simplicity, Testability, Dead Code Removal

## TL;DR

> **Quick Summary**: Comprehensive backend improvement plan for the wedding invitation Go/Gin app. Fix critical reliability bugs (missing transactions, race conditions), remove dead code (spotify, deprecated auth), add interfaces for testability, and write tests using TDD approach — tests first, then refactor with safety net.
> 
> **Deliverables**:
> - 2 critical transaction bugs fixed (Comment.Create, MarkInvitationOpened)
> - Cache race condition and goroutine leak fixed
> - All dead code removed (spotify/, deprecated auth, dead config vars)
> - Service and cache interfaces added for mockability
> - TDD test suite covering services, cache, middleware, and routes
> - CSV bounds checking and proper error types in handlers
> - Deprecated auth middleware migrated and deleted
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Task 1 (dead code) → Task 3 (interfaces) → Task 7 (service tests) → Task 10 (handler refactor) → Final Verification

---

## Context

### Original Request
"Create plan to improve backend code. Focus area: reliability, simple code, testable, remove dead code."

### Interview Summary
**Key Discussions**:
- Full audit of all 26 Go source files identified 2 critical, 18 medium, 14 low issues
- Conservative simplification chosen: keep 4-layer architecture, add proper interfaces
- TDD approach: write tests for current behavior first, then refactor with safety net
- Complete spotify removal and deprecated auth migration+deletion

**Research Findings**:
- Overall testability score: 4/10 — only 2 test files (models), no mocks, no service interfaces
- Cache has RLock bug (mutating map under read lock) and goroutine leak (no Stop())
- Services depend on concrete types — GuestService uses `*cache.GuestCache`, CommentService uses `*cache.MemoryCache` directly
- Repository interfaces exist but are thin passthroughs — can be enhanced
- Routes use anonymous handlers — testable via httptest but need gin.TestMode
- `Claims` struct + `GenerateToken()` live in deprecated `auth.go` — must extract before deletion
- Function-field mocks preferred over mockgen (no new dependencies)
- `t.Cleanup()` preferred over `defer` for test teardown
- `:memory:` SQLite works with modernc.org/sqlite for test isolation

### Metis Review
**Identified Gaps** (addressed):
- `Claims` struct and `GenerateToken()` must be extracted from `auth.go` before deletion — incorporated into Task 2
- Function-field mock pattern specified (no mockgen dependency)
- `gin.SetMode(gin.TestMode)` required in all HTTP tests
- `t.Cleanup()` for DB close instead of defer
- Cache `Stop()` method must be called in all tests via `t.Cleanup()`
- `rows.Err()` check missing after query iterations — added to reliability fixes
- `ValidateGuestAccess()` is identical to `GetGuestByName()` — address during interface design
- `database.go:23` hardcoded DB path — fix during reliability wave

---

## Work Objectives

### Core Objective
Improve the Go backend's reliability, testability, and code cleanliness while preserving all existing behavior. Use TDD approach: capture current behavior in tests first, then refactor safely.

### Concrete Deliverables
- Fixed transaction bugs in `models/comment.go` and `models/guest.go`
- Fixed cache race condition in `cache/memory_cache.go`
- Added `Stop()` to `MemoryCache` for clean goroutine shutdown
- Removed `spotify/`, `routes/spotify_routes.go`, `spotify.Init()`, spotify config vars
- Extracted `Claims` + `GenerateToken()` to `auth_with_service.go`, deleted `auth.go`
- Migrated `comment_routes.go` from `JWTMiddleware()` to `JWTMiddlewareWithService()`
- Added `GuestServiceInterface`, `CommentServiceInterface` in `services/`
- Added `CacheInterface` in `cache/`
- Updated `container.Container` to expose interfaces
- Test files for: services, cache, middleware, routes (TDD: written before refactoring)
- CSV bounds checking in `guest_routes.go`
- Sentinel error types replacing string matching in `comment_routes.go`
- `rows.Err()` checks after all query iterations
- Hardcoded DB path fixed to use `config.DBPath`

### Definition of Done
- [ ] `go build ./...` succeeds with zero errors
- [ ] `go test ./...` passes all tests (existing + new)
- [ ] `go vet ./...` reports no issues
- [ ] `go test -race ./...` passes (no race conditions)
- [ ] No references to `spotify` remain in codebase
- [ ] No references to `JWTMiddleware()` (deprecated) remain
- [ ] `middleware/auth/auth.go` does not exist
- [ ] All service dependencies use interfaces, not concrete types

### Must Have
- All existing API behavior preserved (no breaking changes)
- Transaction wrapping on all write operations
- Cache race condition fixed
- All dead code removed
- Interface-based dependency injection for services and cache
- Tests for every refactored component (TDD: written first)
- `go test -race ./...` passes clean

### Must NOT Have (Guardrails)
- **NO new external dependencies** except what's strictly needed (no mockgen, no testcontainers)
- **NO architecture restructuring** — keep models, repos, services, routes layers
- **NO changes to API contracts** — same endpoints, same request/response shapes
- **NO frontend changes** — backend only
- **NO Docker/deployment changes**
- **NO premature abstraction** — interfaces only where needed for testability
- **NO over-testing** — test business logic and edge cases, not trivial getters
- **NO `as any` / `@ts-ignore`** equivalent Go patterns (`//nolint` without justification)
- **NO `mocks/` directory** — function-field mocks in `_test.go` files only

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (models only, 2 files)
- **Automated tests**: TDD — write tests for current behavior first, then refactor
- **Framework**: Go standard `testing` + `stretchr/testify` (already in go.mod)
- **Each task follows**: RED (write test for current behavior) → GREEN (verify it passes) → REFACTOR (make the improvement) → GREEN (verify tests still pass)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Backend compilation**: Use Bash — `go build ./...`, `go vet ./...`
- **Tests**: Use Bash — `go test ./...`, `go test -race ./...`
- **Dead code verification**: Use Bash + Grep — search for removed symbols
- **API behavior**: Use Bash (curl) — hit endpoints, assert responses unchanged

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — dead code removal + foundation):
├── Task 1: Remove dead spotify code [quick]
├── Task 2: Extract Claims/GenerateToken, migrate comment auth, delete auth.go [quick]
├── Task 3: Define service + cache interfaces [unspecified-high]
└── Task 4: Fix hardcoded DB path + add rows.Err() checks [quick]

Wave 2 (After Wave 1 — TDD: write tests for current behavior):
├── Task 5: Write cache tests (MemoryCache + GuestCache current behavior) [deep]
├── Task 6: Write model tests for untested paths (error paths, edge cases) [unspecified-high]
├── Task 7: Write service tests using new interfaces + function-field mocks [deep]
└── Task 8: Write middleware/auth tests [unspecified-high]

Wave 3 (After Wave 2 — reliability fixes with test safety net):
├── Task 9: Fix Comment.Create() transaction + MarkInvitationOpened() transaction [deep]
├── Task 10: Fix cache RLock bug + add Stop() method + fix goroutine leak [deep]
├── Task 11: Fix CSV bounds checking + add sentinel error types [quick]
└── Task 12: Update container to expose interfaces + wire new deps [quick]

Wave 4 (After Wave 3 — route handler tests + remaining improvements):
├── Task 13: Write route handler tests (auth, RSVP, comments, guest) [unspecified-high]
├── Task 14: Remove ValidateGuestAccess() duplication [quick]
└── Task 15: Update existing model test helper (schema drift fix) [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 3 → Task 7 → Task 9 → Task 12 → Task 13 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Waves 1, 2)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 5, 6, 7, 8, 13 |
| 2 | — | 8, 13 |
| 3 | — | 5, 7, 8, 10, 12 |
| 4 | — | 6 |
| 5 | 3 | 10 |
| 6 | 4 | 9 |
| 7 | 3 | 9, 12 |
| 8 | 2, 3 | 13 |
| 9 | 6, 7 | 13 |
| 10 | 3, 5 | 12 |
| 11 | — | 13 |
| 12 | 7, 10 | 13 |
| 13 | 1, 2, 8, 9, 11, 12 | F1-F4 |
| 14 | 3 | F1-F4 |
| 15 | — | F1-F4 |

### Agent Dispatch Summary

- **Wave 1**: **4 tasks** — T1 → `quick`, T2 → `quick`, T3 → `unspecified-high`, T4 → `quick`
- **Wave 2**: **4 tasks** — T5 → `deep`, T6 → `unspecified-high`, T7 → `deep`, T8 → `unspecified-high`
- **Wave 3**: **4 tasks** — T9 → `deep`, T10 → `deep`, T11 → `quick`, T12 → `quick`
- **Wave 4**: **3 tasks** — T13 → `unspecified-high`, T14 → `quick`, T15 → `quick`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [ ] 1. Remove Dead Spotify Code

  **What to do**:
  - Delete `spotify/auth.go` and `spotify/client.go` (entire directory)
  - Delete `routes/spotify_routes.go`
  - Remove `spotify.Init()` call from `main.go:37`
  - Remove spotify config vars from `config/config.go`: `SpotifyClientId`, `SpotifyClientSecret`, `SpotifyRedirectURI`, `SpotifyCacheSeconds`
  - Remove commented-out spotify route registration in `routes/routes.go:40`
  - Remove spotify import from `main.go`
  - Run `go build ./...` to verify clean compilation

  **Must NOT do**:
  - Do not modify any non-spotify code logic
  - Do not remove the `routes/routes.go` file itself (only the spotify references in it)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward file deletion and import removal. No logic changes.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed — just file deletions, no complex git operations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5, 6, 7, 8, 13 (clean codebase for testing)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `routes/routes.go:40` — Commented-out spotify route registration line to remove
  - `main.go:37` — `spotify.Init()` call to remove

  **API/Type References**:
  - `config/config.go` — Lines defining `SpotifyClientId`, `SpotifyClientSecret`, `SpotifyRedirectURI`, `SpotifyCacheSeconds` (search for `Spotify` prefix)

  **External References**: None

  **WHY Each Reference Matters**:
  - `routes/routes.go:40`: This is the line that was commented out to disable spotify — remove the comment entirely
  - `main.go:37`: This initializes spotify env vars that no longer exist — will cause runtime warnings
  - `config/config.go`: These vars are only read by spotify code — leaving them adds confusion

  **Acceptance Criteria**:
  - [ ] `spotify/` directory does not exist
  - [ ] `routes/spotify_routes.go` does not exist
  - [ ] `go build ./...` succeeds
  - [ ] `grep -r "spotify" --include="*.go" .` returns no matches (case-insensitive: `grep -ri "spotify" --include="*.go" .`)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Spotify code fully removed
    Tool: Bash
    Preconditions: Tasks not yet started, codebase at current HEAD
    Steps:
      1. Run `test ! -d spotify/ && echo PASS || echo FAIL`
      2. Run `test ! -f routes/spotify_routes.go && echo PASS || echo FAIL`
      3. Run `go build ./...`
      4. Run `grep -ri "spotify" --include="*.go" . | grep -v "_test.go" | wc -l`
    Expected Result: Steps 1-2 print PASS, step 3 exits 0, step 4 outputs 0
    Failure Indicators: Any FAIL output, build errors, or grep count > 0
    Evidence: .sisyphus/evidence/task-1-spotify-removed.txt

  Scenario: Existing functionality unaffected
    Tool: Bash
    Preconditions: Spotify code removed
    Steps:
      1. Run `go build ./...`
      2. Run `go test ./models/...`
    Expected Result: Both commands exit 0
    Failure Indicators: Compilation errors or test failures
    Evidence: .sisyphus/evidence/task-1-build-stable.txt
  ```

  **Commit**: YES
  - Message: `chore: remove dead spotify code`
  - Files: `spotify/auth.go`, `spotify/client.go`, `routes/spotify_routes.go`, `main.go`, `config/config.go`, `routes/routes.go`
  - Pre-commit: `go build ./...`

---

- [ ] 2. Extract Claims/GenerateToken, Migrate Comment Auth, Delete Deprecated auth.go

  **What to do**:
  - Read `middleware/auth/auth.go` and identify `Claims` struct and `GenerateToken()` function
  - Move `Claims` struct and `GenerateToken()` into `middleware/auth/auth_with_service.go` (they are used by `routes/auth_routes.go`)
  - In `routes/comment_routes.go:20`, replace `auth.JWTMiddleware()` with `auth.JWTMiddlewareWithService(c.GuestService)` (same pattern as other route groups)
  - Delete `middleware/auth/auth.go` entirely
  - Verify `routes/auth_routes.go` still compiles (it uses `auth.GenerateToken()` and `auth.Claims{}`)
  - Run `go build ./...` to confirm everything compiles

  **Must NOT do**:
  - Do not change the JWT signing logic or token format
  - Do not modify the `JWTMiddlewareWithService()` function itself
  - Do not change any route paths or handler logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Code move (Claims + GenerateToken) and one-line middleware swap. Well-defined scope.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: Simple code movement, not needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Tasks 8, 13 (auth middleware tests need clean auth.go)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `middleware/auth/auth.go:10-20` — `Claims` struct definition (fields: `Name string`, `jwt.RegisteredClaims`)
  - `middleware/auth/auth.go:22-33` — `GenerateToken()` function (creates signed JWT with name claim)
  - `middleware/auth/auth_with_service.go` — Target file for moving Claims + GenerateToken into
  - `routes/comment_routes.go:20` — Line using deprecated `auth.JWTMiddleware()` — change to `auth.JWTMiddlewareWithService(c.GuestService)`

  **API/Type References**:
  - `routes/auth_routes.go` — Uses `auth.GenerateToken()` and `auth.Claims{}` — must still compile after move

  **WHY Each Reference Matters**:
  - `auth.go:10-33`: These are the only symbols from auth.go used elsewhere. Everything else in auth.go is the deprecated middleware function.
  - `comment_routes.go:20`: This is the ONLY remaining call to deprecated `JWTMiddleware()`. After migration, auth.go has zero callers.
  - `auth_routes.go`: Imports `auth` package — moving Claims/GenerateToken to auth_with_service.go keeps same import path, so auth_routes.go needs no changes.

  **Acceptance Criteria**:
  - [ ] `middleware/auth/auth.go` does not exist
  - [ ] `Claims` struct and `GenerateToken()` exist in `middleware/auth/auth_with_service.go`
  - [ ] `go build ./...` succeeds
  - [ ] `grep -r "JWTMiddleware()" --include="*.go" .` returns no matches (only `JWTMiddlewareWithService` references remain)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Deprecated auth.go deleted cleanly
    Tool: Bash
    Preconditions: Codebase at current HEAD
    Steps:
      1. Run `test ! -f middleware/auth/auth.go && echo PASS || echo FAIL`
      2. Run `grep -rn "JWTMiddleware()" --include="*.go" . | grep -v "JWTMiddlewareWithService" | wc -l`
      3. Run `go build ./...`
      4. Run `grep -n "Claims" middleware/auth/auth_with_service.go | head -5`
      5. Run `grep -n "GenerateToken" middleware/auth/auth_with_service.go | head -5`
    Expected Result: Step 1 PASS, step 2 outputs 0, step 3 exits 0, steps 4-5 show matches
    Failure Indicators: auth.go exists, deprecated JWTMiddleware still referenced, build fails
    Evidence: .sisyphus/evidence/task-2-auth-migrated.txt

  Scenario: Auth flow still works
    Tool: Bash
    Preconditions: auth.go deleted, Claims/GenerateToken moved
    Steps:
      1. Run `go build ./...`
      2. Run `go test ./models/...` (verify no regressions)
    Expected Result: Both exit 0
    Failure Indicators: Import errors, undefined symbol errors
    Evidence: .sisyphus/evidence/task-2-auth-compiles.txt
  ```

  **Commit**: YES (groups with Task 1)
  - Message: `refactor(auth): extract Claims/GenerateToken, migrate comment auth, delete deprecated auth.go`
  - Files: `middleware/auth/auth.go` (deleted), `middleware/auth/auth_with_service.go`, `routes/comment_routes.go`
  - Pre-commit: `go build ./... && go test ./models/...`

---

- [ ] 3. Define Service and Cache Interfaces

  **What to do**:
  - Create `services/interfaces.go` with `GuestServiceInterface` and `CommentServiceInterface` that match current public method signatures
  - Create `cache/interfaces.go` with `CacheInterface` (Get, Set, Delete, Clear) and `GuestCacheInterface` matching `GuestCache` methods
  - Add `Stop()` method signature to cache interface (will be implemented in Task 10)
  - Update `GuestService` and `CommentService` struct types to accept interfaces instead of concrete cache types in their struct fields
  - Update `CommentService` to accept `GuestServiceInterface` instead of `*GuestService`
  - Ensure existing concrete types satisfy the new interfaces (add compile-time checks: `var _ GuestServiceInterface = (*GuestService)(nil)`)
  - Update `container/container.go` to expose `GuestServiceInterface` and `CommentServiceInterface` instead of concrete types
  - Update route files to accept interfaces from container (if Container fields change type)
  - Do NOT change any method implementations — only add interface definitions and update type signatures
  - Run `go build ./...` to verify

  **Must NOT do**:
  - Do not change any business logic or method implementations
  - Do not add methods that don't exist on current types
  - Do not create mock implementations (that's for test tasks)
  - Do not touch model layer

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Touches multiple packages (services, cache, container, routes) and requires careful interface design that matches existing signatures exactly. Needs deep understanding of type system.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Backend-only task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: Tasks 5, 7, 8, 10, 12 (interfaces needed for mock-based testing)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `repositories/guest_repository.go:9-17` — `GuestRepository` interface pattern to follow (same style: list methods, domain-appropriate names)
  - `repositories/comment_repository.go:8-14` — `CommentRepository` interface for reference

  **API/Type References**:
  - `services/guest_service.go` — All public methods of `GuestService` (extract method signatures for interface)
  - `services/comment_service.go` — All public methods of `CommentService` (extract method signatures for interface)
  - `cache/guest_cache.go` — All public methods of `GuestCache` (extract for `GuestCacheInterface`)
  - `cache/memory_cache.go` — All public methods of `MemoryCache` (extract for `CacheInterface`)
  - `container/container.go` — Current struct fields (`GuestService *services.GuestService`, `CommentService *services.CommentService`) to change to interfaces

  **WHY Each Reference Matters**:
  - `repositories/*.go`: These are the EXISTING interface pattern in the codebase. New interfaces must follow same style for consistency.
  - `services/*.go`: Every public method must appear in the interface. Missing one means mock tests can't call it.
  - `cache/*.go`: Cache interface design determines how services can be tested with mock caches.
  - `container.go`: Container fields determine what routes receive. Changing to interfaces here propagates testability to all handlers.

  **Acceptance Criteria**:
  - [ ] `services/interfaces.go` exists with `GuestServiceInterface` and `CommentServiceInterface`
  - [ ] `cache/interfaces.go` exists with `CacheInterface` and `GuestCacheInterface`
  - [ ] Compile-time checks pass: `var _ GuestServiceInterface = (*GuestService)(nil)`
  - [ ] `container.Container` fields use interface types
  - [ ] `go build ./...` succeeds
  - [ ] No method implementation changes (only type signature changes)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Interfaces correctly defined and satisfied
    Tool: Bash
    Preconditions: Interface files created, container updated
    Steps:
      1. Run `go build ./...`
      2. Run `grep -n "var _" services/interfaces.go` (verify compile-time interface checks)
      3. Run `grep -n "var _" cache/interfaces.go` (verify compile-time interface checks)
      4. Run `go vet ./...`
    Expected Result: All commands succeed, compile-time checks present
    Failure Indicators: Build errors (method missing from interface), vet warnings
    Evidence: .sisyphus/evidence/task-3-interfaces-defined.txt

  Scenario: Existing tests still pass
    Tool: Bash
    Preconditions: Interfaces defined, container updated
    Steps:
      1. Run `go test ./models/...`
      2. Run `go test ./...`
    Expected Result: All existing tests pass unchanged
    Failure Indicators: Test failures caused by type changes
    Evidence: .sisyphus/evidence/task-3-tests-stable.txt
  ```

  **Commit**: YES (groups with Task 4)
  - Message: `refactor: add service/cache interfaces for testability`
  - Files: `services/interfaces.go`, `cache/interfaces.go`, `services/guest_service.go`, `services/comment_service.go`, `container/container.go`, `routes/*.go` (if container field types changed)
  - Pre-commit: `go build ./... && go test ./...`

---

- [ ] 4. Fix Hardcoded DB Path + Add rows.Err() Checks

  **What to do**:
  - In `database/database.go:23`, replace hardcoded `"data/guests.db"` with `config.DBPath`
  - In `models/guest.go`, add `rows.Err()` check after `rows.Next()` loop in: `GetAllGuests()`, `GetCommentsByGuestID()`
  - In `models/comment.go`, add `rows.Err()` check after `rows.Next()` loop in: `GetAllComments()`, `GetAllCommentsWithGuests()`
  - Pattern: after the `for rows.Next() { ... }` loop, add `if err := rows.Err(); err != nil { return nil, err }`
  - Run `go build ./...` and `go test ./models/...`

  **Must NOT do**:
  - Do not change query logic or SQL statements
  - Do not modify transaction handling (that's Task 9)
  - Do not add new error types (that's Task 11)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small, well-defined changes. One config fix + pattern-based additions across 2 files.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 6 (model tests need clean models)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `database/database.go:23` — Line with hardcoded path `"data/guests.db"` to replace with `config.DBPath`
  - `models/guest.go` — Search for `rows.Next()` to find iteration loops missing `rows.Err()`
  - `models/comment.go` — Search for `rows.Next()` to find iteration loops missing `rows.Err()`

  **API/Type References**:
  - `config/config.go` — `DBPath` variable (verify it exists and has correct default)

  **WHY Each Reference Matters**:
  - `database.go:23`: Hardcoded path means config.DBPath is ignored — database always opens in default location regardless of environment variable
  - `rows.Next()` loops: Without `rows.Err()`, iteration errors (connection drops, encoding issues) are silently swallowed

  **Acceptance Criteria**:
  - [ ] `database/database.go` uses `config.DBPath` instead of hardcoded string
  - [ ] All `rows.Next()` loops in models/ have `rows.Err()` check after them
  - [ ] `go build ./...` succeeds
  - [ ] `go test ./models/...` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: DB path uses config
    Tool: Bash
    Preconditions: database.go modified
    Steps:
      1. Run `grep -n "data/guests.db" database/database.go | wc -l`
      2. Run `grep -n "config.DBPath" database/database.go | wc -l`
      3. Run `go build ./...`
    Expected Result: Step 1 outputs 0, step 2 outputs >= 1, step 3 exits 0
    Failure Indicators: Hardcoded path still present, config.DBPath not used
    Evidence: .sisyphus/evidence/task-4-db-path-fixed.txt

  Scenario: rows.Err() checks present
    Tool: Bash
    Preconditions: Models updated
    Steps:
      1. Run `grep -A2 "rows.Next()" models/guest.go | grep -c "rows.Err()"`
      2. Run `grep -A2 "rows.Next()" models/comment.go | grep -c "rows.Err()"`
      3. Run `go test ./models/...`
    Expected Result: Steps 1-2 show counts matching number of loops, step 3 passes
    Failure Indicators: Missing rows.Err() checks, test failures
    Evidence: .sisyphus/evidence/task-4-rows-err-added.txt
  ```

  **Commit**: YES (groups with Task 3)
  - Message: `fix: use config DB path, add rows.Err() checks after query iterations`
  - Files: `database/database.go`, `models/guest.go`, `models/comment.go`
  - Pre-commit: `go build ./... && go test ./models/...`

- [ ] 5. Write Cache Tests (TDD: Capture Current MemoryCache + GuestCache Behavior)

  **What to do**:
  - Create `cache/memory_cache_test.go` with tests for current `MemoryCache` behavior:
    - Test `Set()` + `Get()` stores and retrieves values
    - Test `Get()` returns false for missing keys
    - Test `Get()` returns false for expired entries (use short TTL like 10ms + `time.Sleep`)
    - Test `Delete()` removes entries
    - Test `Clear()` empties all entries
    - Test concurrent `Set()`/`Get()` with multiple goroutines (will expose RLock bug — this is TDD RED phase)
  - Create `cache/guest_cache_test.go` with tests for current `GuestCache` behavior:
    - Use function-field mock implementing `GuestRepository` interface (from `repositories/guest_repository.go`)
    - Test `GetByName()` cache hit (second call doesn't hit repo)
    - Test `GetByName()` cache miss (delegates to repo)
    - Test `GetAll()` cache hit/miss
    - Test write-through: `Create()`, `Update()` invalidate cache
  - Use `t.Cleanup()` for teardown, NOT `defer`
  - All mock structs defined in `_test.go` files using function-field pattern
  - NOTE: Concurrent test for MemoryCache WILL FAIL due to known RLock bug — this is expected (TDD RED). Task 10 will fix it (GREEN).

  **Must NOT do**:
  - Do not fix the RLock bug (that's Task 10)
  - Do not add `Stop()` method yet (that's Task 10)
  - Do not use external mock generation tools
  - Do not create a `mocks/` directory

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: TDD test design requires deep understanding of cache behavior, concurrency patterns, and mock design. Must write tests that capture exact current behavior.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8)
  - **Blocks**: Task 10 (cache fix needs existing tests as safety net)
  - **Blocked By**: Task 3 (needs cache interfaces for mock type satisfaction)

  **References**:

  **Pattern References**:
  - `models/guest_test.go` — Existing test style (assertion patterns, helper setup). Follow same `testify/assert` style.
  - `repositories/guest_repository.go:9-17` — `GuestRepository` interface — mock struct must implement this

  **API/Type References**:
  - `cache/memory_cache.go` — All public methods to test: `NewMemoryCache()`, `Get()`, `Set()`, `Delete()`, `Clear()`
  - `cache/guest_cache.go` — All public methods to test: `NewGuestCache()`, `GetByName()`, `GetAll()`, `Create()`, `Update()`, `BulkCreate()`, `BulkUpdate()`, `MarkInvitationOpened()`
  - `cache/interfaces.go` (from Task 3) — Mock structs should satisfy these interfaces

  **WHY Each Reference Matters**:
  - `memory_cache.go`: Need exact method signatures and behavior (TTL, map operations) to write accurate tests
  - `guest_cache.go`: Need to understand cache key patterns (`"guest_" + name`, `"all_guests"`) to verify cache hit/miss
  - `guest_repository.go`: Mock must implement this interface exactly — function-field struct needs matching signatures

  **Acceptance Criteria**:
  - [ ] `cache/memory_cache_test.go` exists with >= 6 test functions
  - [ ] `cache/guest_cache_test.go` exists with >= 4 test functions
  - [ ] `go test ./cache/...` passes (except known RLock race — document as expected failure)
  - [ ] `go test -race ./cache/...` shows the RLock race condition (TDD RED confirmed)
  - [ ] Mock structs use function-field pattern, defined in `_test.go` files

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Cache tests written and most pass
    Tool: Bash
    Preconditions: Task 3 complete (interfaces exist)
    Steps:
      1. Run `go test -v ./cache/... 2>&1 | tail -20`
      2. Run `go test -count=1 ./cache/... 2>&1 | grep -E "(PASS|FAIL|ok)"` 
    Expected Result: Tests compile and run. Non-concurrent tests pass.
    Failure Indicators: Compilation errors, test functions not found
    Evidence: .sisyphus/evidence/task-5-cache-tests.txt

  Scenario: Race detector catches known RLock bug
    Tool: Bash
    Preconditions: Concurrent test written for MemoryCache
    Steps:
      1. Run `go test -race -run TestMemoryCache_Concurrent ./cache/... 2>&1 | head -30`
    Expected Result: Race condition detected (DATA RACE in output) — this is TDD RED, expected
    Failure Indicators: No race detected (test not stressing concurrency enough)
    Evidence: .sisyphus/evidence/task-5-race-detected.txt
  ```

  **Commit**: YES (groups with Tasks 6, 7, 8)
  - Message: `test: add TDD tests for cache layer (RED phase for known RLock bug)`
  - Files: `cache/memory_cache_test.go`, `cache/guest_cache_test.go`
  - Pre-commit: `go test ./cache/...` (non-race — race test expected to fail)

---

- [ ] 6. Write Model Tests for Untested Error Paths and Edge Cases

  **What to do**:
  - Extend `models/guest_test.go` with:
    - Test `GetGuestByName()` with non-existent name (should return error/nil)
    - Test `Create()` with duplicate name (constraint violation)
    - Test `Update()` with non-existent guest
    - Test transaction rollback behavior on forced DB errors
  - Extend `models/comment_test.go` with:
    - Test `Create()` with invalid guest_id (FK violation)
    - Test `GetAllCommentsWithGuests()` pagination edge cases (cursor=0, very large cursor)
    - Test `GetAllComments()` with empty table
    - Test `GetCommentCountByGuestID()` with non-existent guest
  - Verify `rows.Err()` addition from Task 4 doesn't break existing tests
  - Use `t.Helper()` in shared setup functions
  - Replace `time.Sleep()` in comment_test.go:89 with deterministic approach if possible

  **Must NOT do**:
  - Do not modify model code (only add tests)
  - Do not add sqlmock — continue using in-memory SQLite
  - Do not refactor existing test code structure

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Needs understanding of SQLite constraint behavior and edge cases. Not just writing obvious tests.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7, 8)
  - **Blocks**: Task 9 (model reliability fixes need tests as safety net)
  - **Blocked By**: Task 4 (rows.Err() changes must be in place)

  **References**:

  **Pattern References**:
  - `models/guest_test.go` — Existing test patterns and `setupDB()` helper to reuse
  - `models/comment_test.go` — Existing patterns including FK setup and assertion style

  **API/Type References**:
  - `models/guest.go` — All methods to add edge case tests for (especially error paths)
  - `models/comment.go` — All methods including the max comment limit logic

  **WHY Each Reference Matters**:
  - `guest_test.go`: Existing `setupDB()` helper creates schema — reuse it for new tests
  - `guest.go`: Need to understand what errors each method can return to write meaningful error-path tests

  **Acceptance Criteria**:
  - [ ] `models/guest_test.go` has >= 10 test functions (was 6)
  - [ ] `models/comment_test.go` has >= 9 test functions (was 5 or 6)
  - [ ] `go test -v ./models/...` passes all tests
  - [ ] Error paths covered: non-existent guest lookup, duplicate create, FK violations

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Extended model tests pass
    Tool: Bash
    Preconditions: Task 4 complete (rows.Err() added)
    Steps:
      1. Run `go test -v ./models/... 2>&1 | grep -c "--- PASS"`
      2. Run `go test -v ./models/... 2>&1 | grep -c "--- FAIL"`
      3. Run `go test ./models/...`
    Expected Result: Step 1 shows >= 19, step 2 shows 0, step 3 exits 0
    Failure Indicators: Any FAIL results, test count lower than expected
    Evidence: .sisyphus/evidence/task-6-model-tests-extended.txt

  Scenario: Error paths properly tested
    Tool: Bash
    Preconditions: New error-path tests added
    Steps:
      1. Run `grep -c "func Test" models/guest_test.go`
      2. Run `grep -c "func Test" models/comment_test.go`
    Expected Result: Step 1 >= 10, step 2 >= 9
    Failure Indicators: Counts lower than expected
    Evidence: .sisyphus/evidence/task-6-test-count.txt
  ```

  **Commit**: YES (groups with Tasks 5, 7, 8)
  - Message: `test: extend model tests with error paths and edge cases`
  - Files: `models/guest_test.go`, `models/comment_test.go`
  - Pre-commit: `go test ./models/...`

---

- [ ] 7. Write Service Tests Using Interfaces + Function-Field Mocks

  **What to do**:
  - Create `services/guest_service_test.go`:
    - Define `mockGuestCache` struct with function-field pattern implementing `GuestCacheInterface` (from Task 3)
    - Test `GetGuestByName()` delegates to cache correctly
    - Test `GetAllGuests()` delegates to cache correctly
    - Test `ValidateGuestAccess()` behavior (currently identical to GetGuestByName — capture this)
    - Test write operations (`Create`, `Update`, etc.) delegate correctly
  - Create `services/comment_service_test.go`:
    - Define `mockCommentRepo` implementing `CommentRepository` interface
    - Define `mockGuestService` implementing `GuestServiceInterface` (from Task 3)
    - Test `CreateComment()`: verify it checks guest existence, enforces comment limit, creates comment, invalidates cache
    - Test `CreateComment()` when max limit reached (should return error)
    - Test `GetComments()` with cache hit and cache miss
    - Test `GetAllCommentsWithGuests()` pagination delegation
  - All mocks in `_test.go` files, function-field pattern
  - Use `gin.SetMode(gin.TestMode)` if any test creates gin context

  **Must NOT do**:
  - Do not refactor services (only test current behavior)
  - Do not use external mock generators
  - Do not create `mocks/` directory
  - Do not modify `services/interfaces.go`

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Service tests require careful mock setup with function-field pattern, understanding cache interaction semantics, and the CommentService's complex comment-limit logic.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 8)
  - **Blocks**: Tasks 9, 12 (service tests are safety net for reliability fixes and container rewiring)
  - **Blocked By**: Task 3 (needs interfaces for mock type satisfaction)

  **References**:

  **Pattern References**:
  - `models/guest_test.go` — Assertion style (`assert.NoError`, `assert.Equal`, etc.) to maintain consistency

  **API/Type References**:
  - `services/interfaces.go` (from Task 3) — `GuestServiceInterface` and `CommentServiceInterface` method signatures for mock structs
  - `cache/interfaces.go` (from Task 3) — `GuestCacheInterface` for mocking cache in GuestService tests
  - `repositories/comment_repository.go:8-14` — `CommentRepository` interface for mock in CommentService tests
  - `services/guest_service.go` — All public methods and their delegation logic to understand what to test
  - `services/comment_service.go` — The `CreateComment()` flow: check guest → check count → create → invalidate cache

  **WHY Each Reference Matters**:
  - `services/interfaces.go`: Mock structs MUST satisfy these interfaces. Missing a method = compilation error.
  - `comment_service.go`: The `CreateComment()` has a multi-step flow with cache interaction — tests must verify each step
  - `guest_service.go`: Currently a thin delegation layer to cache — tests verify the delegation happens correctly

  **Acceptance Criteria**:
  - [ ] `services/guest_service_test.go` exists with >= 5 test functions
  - [ ] `services/comment_service_test.go` exists with >= 5 test functions
  - [ ] `go test ./services/...` passes all tests
  - [ ] Mock structs use function-field pattern (no external mock tools)
  - [ ] Tests cover: happy path, error propagation, cache hit/miss, comment limit enforcement

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Service tests pass
    Tool: Bash
    Preconditions: Task 3 complete (interfaces exist)
    Steps:
      1. Run `go test -v ./services/... 2>&1 | grep -c "--- PASS"`
      2. Run `go test -v ./services/... 2>&1 | grep -c "--- FAIL"`
      3. Run `go test ./services/...`
    Expected Result: Step 1 >= 10, step 2 = 0, step 3 exits 0
    Failure Indicators: Any FAIL, compilation errors, mock type mismatches
    Evidence: .sisyphus/evidence/task-7-service-tests.txt

  Scenario: Function-field mock pattern verified
    Tool: Bash
    Preconditions: Test files created
    Steps:
      1. Run `grep -c "Func func" services/guest_service_test.go`
      2. Run `grep -c "Func func" services/comment_service_test.go`
    Expected Result: Both show >= 3 (function fields in mock structs)
    Failure Indicators: Zero matches (not using function-field pattern)
    Evidence: .sisyphus/evidence/task-7-mock-pattern.txt
  ```

  **Commit**: YES (groups with Tasks 5, 6, 8)
  - Message: `test: add service tests with function-field mocks`
  - Files: `services/guest_service_test.go`, `services/comment_service_test.go`
  - Pre-commit: `go test ./services/...`

---

- [ ] 8. Write Middleware/Auth Tests

  **What to do**:
  - Create `middleware/auth/auth_test.go`:
    - Define mock `GuestServiceInterface` with function-field pattern
    - Test `JWTMiddlewareWithService()` with valid token — sets guest in context
    - Test `JWTMiddlewareWithService()` with expired token — returns 401
    - Test `JWTMiddlewareWithService()` with malformed token — returns 401
    - Test `JWTMiddlewareWithService()` with valid token but guest not found — returns 401
    - Test `GenerateToken()` produces valid JWT with correct claims
    - Use `gin.SetMode(gin.TestMode)` + `httptest.NewRecorder()` + `gin.CreateTestContext()`
  - Create `middleware/apikey/apikey_test.go`:
    - Test valid API key passes
    - Test missing API key returns 401
    - Test invalid API key returns 401
  - NOTE: Tests must work with the MIGRATED auth (Task 2 — auth.go deleted, Claims/GenerateToken in auth_with_service.go)

  **Must NOT do**:
  - Do not modify middleware code (only add tests)
  - Do not create a separate test config mechanism (use environment variables directly)
  - Do not test the deleted `JWTMiddleware()` function

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Gin middleware testing requires understanding of Gin test context setup, JWT token creation/validation, and proper HTTP handler testing patterns.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7)
  - **Blocks**: Task 13 (route handler tests need auth middleware tests as foundation)
  - **Blocked By**: Tasks 2 (auth migration complete), 3 (interfaces for mock GuestService)

  **References**:

  **Pattern References**:
  - `middleware/auth/auth_with_service.go` — Full middleware implementation: JWT parsing, Claims extraction, GuestService lookup
  - `middleware/apikey/apikey.go` — API key middleware to test (simple header check)

  **API/Type References**:
  - `services/interfaces.go` (from Task 3) — `GuestServiceInterface` for mock in middleware tests
  - `config/config.go` — `JWTSecret` and `AdminAPIKey` globals used by middleware (need to set in test)

  **WHY Each Reference Matters**:
  - `auth_with_service.go`: This is what we're testing. Must understand JWT parsing flow, Claims struct, and how GuestService is called.
  - `config.go`: Middleware reads config globals directly. Tests must set `config.JWTSecret` before running.

  **Acceptance Criteria**:
  - [ ] `middleware/auth/auth_test.go` exists with >= 5 test functions
  - [ ] `middleware/apikey/apikey_test.go` exists with >= 3 test functions
  - [ ] `go test ./middleware/...` passes
  - [ ] Tests cover: valid token, expired token, malformed token, missing token, valid/invalid API key

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Auth middleware tests pass
    Tool: Bash
    Preconditions: Task 2 complete (auth migrated), Task 3 complete (interfaces)
    Steps:
      1. Run `go test -v ./middleware/... 2>&1 | grep -c "--- PASS"`
      2. Run `go test -v ./middleware/... 2>&1 | grep -c "--- FAIL"`
      3. Run `go test ./middleware/...`
    Expected Result: Step 1 >= 8, step 2 = 0, step 3 exits 0
    Failure Indicators: Any test failures, compilation errors
    Evidence: .sisyphus/evidence/task-8-middleware-tests.txt

  Scenario: JWT token lifecycle tested
    Tool: Bash
    Preconditions: auth_test.go created
    Steps:
      1. Run `grep -c "func Test" middleware/auth/auth_test.go`
    Expected Result: >= 5 test functions
    Failure Indicators: Fewer than 5 test functions
    Evidence: .sisyphus/evidence/task-8-test-count.txt
  ```

  **Commit**: YES (groups with Tasks 5, 6, 7)
  - Message: `test: add middleware auth and apikey tests`
  - Files: `middleware/auth/auth_test.go`, `middleware/apikey/apikey_test.go`
  - Pre-commit: `go test ./middleware/...`

- [ ] 9. Fix Transaction Bugs: Comment.Create() + MarkInvitationOpened()

  **What to do**:
  - In `models/comment.go`, wrap `Create()` in a proper transaction:
    - `tx.Begin()` → check count → insert → `tx.Commit()` (with `defer tx.Rollback()`)
    - The count check AND insert MUST be in the same transaction to prevent race condition
    - Currently: count check uses `db.QueryRow()` and insert uses `db.Exec()` separately
  - In `models/guest.go:260-277`, wrap `MarkInvitationOpened()` in a transaction:
    - `tx.Begin()` → SELECT current state → UPDATE if not already opened → `tx.Commit()`
    - Currently: uses bare `db.Exec()` with no transaction
  - Run existing tests + new TDD tests from Tasks 5-8 to verify no regressions
  - Run `go test -race ./models/...` to verify race condition is fixed

  **Must NOT do**:
  - Do not change the SQL queries themselves
  - Do not change the comment limit value (keep max 2)
  - Do not change the `MarkInvitationOpened()` behavior (idempotent update)
  - Do not modify any other model methods

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Transaction wrapping in Go requires careful error handling (defer rollback, commit ordering). The Comment.Create() race condition fix requires the count check to be inside the transaction for atomicity.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 12)
  - **Blocks**: Task 13 (route tests need reliable models)
  - **Blocked By**: Tasks 6 (model tests), 7 (service tests — safety net)

  **References**:

  **Pattern References**:
  - `models/guest.go:18-55` — `Create()` method showing CORRECT transaction pattern: `tx.Begin()`, `defer tx.Rollback()`, operations, `tx.Commit()`
  - `models/guest.go:260-277` — `MarkInvitationOpened()` method to fix (currently uses bare `db.Exec()`)
  - `models/comment.go:16-40` — `Create()` method to fix (count check + insert not atomic)

  **API/Type References**:
  - `models/comment.go:16-40` — Current broken implementation: `db.QueryRow()` for count, `db.Exec()` for insert — separate calls, no transaction
  - `models/guest.go:18-55` — Reference for correct Go transaction pattern in this codebase

  **WHY Each Reference Matters**:
  - `guest.go:18-55` (Create): This is the CORRECT transaction pattern already in the codebase. Copy this pattern for the fixes.
  - `comment.go:16-40`: The race condition: two concurrent requests both execute `QueryRow(count)` before either inserts, both see count < 2, both insert → 3 comments exist
  - `guest.go:260-277`: No rollback on failure means a partial update could corrupt state

  **Acceptance Criteria**:
  - [ ] `Comment.Create()` uses transaction wrapping count check + insert
  - [ ] `MarkInvitationOpened()` uses transaction wrapping select + update
  - [ ] `go test ./models/...` passes (existing + new tests)
  - [ ] `go test -race ./models/...` passes clean (no race conditions)
  - [ ] Comment limit enforcement is atomic (count + insert in same transaction)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Transaction wrapping verified in code
    Tool: Bash
    Preconditions: Models modified
    Steps:
      1. Run `grep -A5 "func (c \*Comment) Create" models/comment.go | grep "tx.*Begin"`
      2. Run `grep -A5 "func.*MarkInvitationOpened" models/guest.go | grep "tx.*Begin"`
      3. Run `go build ./...`
    Expected Result: Both greps find transaction Begin calls, build succeeds
    Failure Indicators: No transaction patterns found, build errors
    Evidence: .sisyphus/evidence/task-9-transactions-added.txt

  Scenario: All model tests pass including race detector
    Tool: Bash
    Preconditions: Transactions added
    Steps:
      1. Run `go test -v ./models/... 2>&1 | tail -20`
      2. Run `go test -race ./models/...`
    Expected Result: All tests pass, no race conditions detected
    Failure Indicators: Test failures, DATA RACE in output
    Evidence: .sisyphus/evidence/task-9-race-clean.txt
  ```

  **Commit**: YES
  - Message: `fix(models): add transaction wrapping to Comment.Create() and MarkInvitationOpened()`
  - Files: `models/comment.go`, `models/guest.go`
  - Pre-commit: `go test -race ./models/...`

---

- [ ] 10. Fix Cache RLock Bug + Add Stop() Method + Fix Goroutine Leak

  **What to do**:
  - In `cache/memory_cache.go:60-64`, fix `Get()` method:
    - Currently calls `delete(c.items, key)` under `c.mu.RLock()` — this is a RACE CONDITION
    - Fix: promote to write lock (`c.mu.Lock()`) when item is expired, OR restructure to check-then-lock
    - Simplest fix: change `RLock()`/`RUnlock()` to `Lock()`/`Unlock()` in `Get()` since it may mutate
  - Add `Stop()` method to `MemoryCache`:
    - Add `stopCh chan struct{}` field to `MemoryCache` struct
    - Initialize `stopCh` in `NewMemoryCache()`: `stopCh: make(chan struct{})`
    - In `cleanup()` goroutine: add `case <-c.stopCh: return` to select loop
    - `Stop()` method: `close(c.stopCh)`
  - Update `GuestCache` to expose `Stop()` that delegates to inner `MemoryCache.Stop()`
  - Update cache interfaces (from Task 3) to include `Stop()` method if not already there
  - Run cache tests from Task 5 — concurrent test should now PASS (TDD GREEN)
  - Run `go test -race ./cache/...` — should be clean

  **Must NOT do**:
  - Do not change cache TTL values
  - Do not change cache key patterns
  - Do not redesign the cache (just fix the bugs)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Concurrent code fixes require careful understanding of Go's sync.RWMutex semantics. The RLock→Lock promotion and goroutine lifecycle management need precise implementation.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 11, 12)
  - **Blocks**: Task 12 (container needs working cache with Stop())
  - **Blocked By**: Tasks 3 (interfaces), 5 (cache tests as TDD safety net)

  **References**:

  **Pattern References**:
  - `cache/memory_cache.go:60-64` — `Get()` method with RLock bug: `delete()` called under `RLock()`
  - `cache/memory_cache.go:93-104` — `cleanup()` goroutine with no stop mechanism
  - `cache/memory_cache.go:33-36` — `NewMemoryCache()` constructor where `stopCh` should be initialized

  **API/Type References**:
  - `cache/interfaces.go` (from Task 3) — May need to add `Stop()` to interface
  - `cache/guest_cache.go` — Needs `Stop()` delegation method

  **WHY Each Reference Matters**:
  - `memory_cache.go:60-64`: The RLock allows concurrent readers, but `delete()` mutates the map. Two concurrent `Get()` calls can corrupt the map.
  - `memory_cache.go:93-104`: The `cleanup()` goroutine runs `for { select { case <-ticker.C: ... } }` with no exit. Every `NewMemoryCache()` leaks a goroutine forever.

  **Acceptance Criteria**:
  - [ ] `Get()` no longer calls `delete()` under `RLock()` (uses full `Lock()` or restructured)
  - [ ] `MemoryCache` has `Stop()` method that closes `stopCh`
  - [ ] `cleanup()` goroutine respects `stopCh` and exits cleanly
  - [ ] `GuestCache` exposes `Stop()` delegating to inner cache
  - [ ] `go test -race ./cache/...` passes clean (TDD GREEN — was RED in Task 5)
  - [ ] No goroutine leaks in tests

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Race condition fixed (TDD GREEN)
    Tool: Bash
    Preconditions: Task 5 tests exist (were RED), cache fixed
    Steps:
      1. Run `go test -race -run TestMemoryCache_Concurrent ./cache/... 2>&1`
      2. Run `go test -race ./cache/...`
    Expected Result: No DATA RACE detected, all tests pass
    Failure Indicators: DATA RACE in output, test failures
    Evidence: .sisyphus/evidence/task-10-race-fixed.txt

  Scenario: Stop() method prevents goroutine leak
    Tool: Bash
    Preconditions: Stop() method added
    Steps:
      1. Run `grep -n "Stop()" cache/memory_cache.go`
      2. Run `grep -n "stopCh" cache/memory_cache.go | wc -l`
      3. Run `go test -race ./cache/...`
    Expected Result: Stop() found, stopCh referenced >= 3 times (init, cleanup select, Stop method), tests pass
    Failure Indicators: Stop() not found, tests fail
    Evidence: .sisyphus/evidence/task-10-stop-method.txt
  ```

  **Commit**: YES
  - Message: `fix(cache): fix RLock race condition, add Stop() for clean goroutine shutdown`
  - Files: `cache/memory_cache.go`, `cache/guest_cache.go`, `cache/interfaces.go`
  - Pre-commit: `go test -race ./cache/...`

---

- [ ] 11. Fix CSV Bounds Checking + Add Sentinel Error Types

  **What to do**:
  - In `routes/guest_routes.go:99-107`, add bounds checking before accessing `record[0..3]`:
    - Check `len(record) >= 4` before accessing fields
    - Return meaningful error message with line number if CSV row has wrong number of fields
  - In `models/comment.go`, define sentinel error: `var ErrCommentLimitReached = errors.New("maximum comment limit reached")`
    - Update `Create()` to return `ErrCommentLimitReached` instead of `fmt.Errorf("maximum comment limit reached")`
  - In `routes/comment_routes.go:52`, replace `strings.Contains(err.Error(), "maximum comment limit reached")` with `errors.Is(err, models.ErrCommentLimitReached)`
  - Remove the `strings` import from comment_routes.go if no longer needed
  - Run `go build ./...` and `go test ./...`

  **Must NOT do**:
  - Do not change CSV parsing logic beyond bounds checking
  - Do not add new CSV columns or fields
  - Do not change error messages visible to API consumers (same HTTP response text)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Well-defined small changes: add length check, define sentinel, swap string comparison.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 12)
  - **Blocks**: Task 13 (route tests need clean handlers)
  - **Blocked By**: None (independent fix, but placed in Wave 3 for commit grouping)

  **References**:

  **Pattern References**:
  - `routes/guest_routes.go:99-107` — CSV parsing accessing `record[0]`, `record[1]`, `record[2]`, `record[3]` without bounds check
  - `routes/comment_routes.go:52` — `strings.Contains(err.Error(), "maximum comment limit reached")` to replace

  **API/Type References**:
  - `models/comment.go` — Where to define `ErrCommentLimitReached` sentinel and update `Create()` return

  **WHY Each Reference Matters**:
  - `guest_routes.go:99-107`: Malformed CSV with < 4 columns causes panic (index out of range). Must bounds check.
  - `comment_routes.go:52`: String matching on error messages is fragile — if message wording changes, comparison silently breaks.
  - `models/comment.go`: Sentinel error definition enables `errors.Is()` pattern — compile-time safe, refactor-proof.

  **Acceptance Criteria**:
  - [ ] CSV parsing checks `len(record) >= 4` before accessing fields
  - [ ] `models.ErrCommentLimitReached` sentinel error defined
  - [ ] `Comment.Create()` returns `ErrCommentLimitReached` sentinel
  - [ ] `comment_routes.go` uses `errors.Is()` instead of `strings.Contains()`
  - [ ] `go build ./...` succeeds
  - [ ] `go test ./...` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: CSV bounds check prevents panic
    Tool: Bash
    Preconditions: guest_routes.go modified
    Steps:
      1. Run `grep -n "len(record)" routes/guest_routes.go | wc -l`
      2. Run `go build ./...`
    Expected Result: Step 1 >= 1 (bounds check present), step 2 exits 0
    Failure Indicators: No bounds check, build errors
    Evidence: .sisyphus/evidence/task-11-csv-bounds.txt

  Scenario: Sentinel error replaces string matching
    Tool: Bash
    Preconditions: Sentinel defined, routes updated
    Steps:
      1. Run `grep -n "ErrCommentLimitReached" models/comment.go | wc -l`
      2. Run `grep -n "errors.Is" routes/comment_routes.go | wc -l`
      3. Run `grep -n "strings.Contains" routes/comment_routes.go | wc -l`
      4. Run `go test ./...`
    Expected Result: Step 1 >= 1, step 2 >= 1, step 3 = 0, step 4 exits 0
    Failure Indicators: String matching still present, sentinel not found, tests fail
    Evidence: .sisyphus/evidence/task-11-sentinel-error.txt
  ```

  **Commit**: YES (groups with Tasks 9, 10, 12)
  - Message: `fix: CSV bounds check, sentinel error for comment limit`
  - Files: `routes/guest_routes.go`, `routes/comment_routes.go`, `models/comment.go`
  - Pre-commit: `go build ./... && go test ./...`

---

- [ ] 12. Update Container to Expose Interfaces + Wire New Dependencies

  **What to do**:
  - Update `container/container.go` struct fields to use interface types:
    - `GuestService services.GuestServiceInterface` (instead of `*services.GuestService`)
    - `CommentService services.CommentServiceInterface` (instead of `*services.CommentService`)
  - Add `Shutdown()` method to Container that calls `Stop()` on caches (for clean goroutine cleanup)
  - Verify all route files still compile with interface types from container
  - Add `container/container_test.go`:
    - Test that `NewContainer()` returns a container with non-nil services
    - Test that container services satisfy expected interfaces
    - Test `Shutdown()` doesn't panic
  - Run `go build ./...` and `go test ./...`

  **Must NOT do**:
  - Do not change the construction logic in `NewContainer()`
  - Do not add new services to the container
  - Do not change how container is used in `main.go`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small scope: change 2 struct field types, add Shutdown() delegation, write 3 basic tests.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11)
  - **Blocks**: Task 13 (route tests need finalized container)
  - **Blocked By**: Tasks 7 (service tests verify current behavior), 10 (cache Stop() method needed for Shutdown())

  **References**:

  **Pattern References**:
  - `container/container.go` — Current container struct and `NewContainer()` function

  **API/Type References**:
  - `services/interfaces.go` (from Task 3) — Interface types to use in struct fields
  - `cache/interfaces.go` (from Task 3) — `Stop()` method for Shutdown delegation

  **WHY Each Reference Matters**:
  - `container.go`: This is the central wiring point. Changing field types here propagates interface-based DI to all route handlers.
  - `services/interfaces.go`: Container fields must use these exact interface types for routes to receive mockable dependencies.

  **Acceptance Criteria**:
  - [ ] Container struct uses `services.GuestServiceInterface` and `services.CommentServiceInterface` field types
  - [ ] Container has `Shutdown()` method that stops caches
  - [ ] `container/container_test.go` exists with >= 3 tests
  - [ ] `go build ./...` succeeds (all routes compile with interface types)
  - [ ] `go test ./...` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Container exposes interfaces
    Tool: Bash
    Preconditions: Interface types applied to container
    Steps:
      1. Run `grep "Interface" container/container.go | wc -l`
      2. Run `go build ./...`
      3. Run `go test ./container/...`
    Expected Result: Step 1 >= 2 (both service interfaces), steps 2-3 exit 0
    Failure Indicators: Concrete types still used, build errors, test failures
    Evidence: .sisyphus/evidence/task-12-container-interfaces.txt

  Scenario: Shutdown method exists and works
    Tool: Bash
    Preconditions: Container updated
    Steps:
      1. Run `grep -n "Shutdown" container/container.go | wc -l`
      2. Run `go test -run TestContainer_Shutdown ./container/...`
    Expected Result: Step 1 >= 2 (method + potential call to Stop()), step 2 passes
    Failure Indicators: Shutdown not found, test panics
    Evidence: .sisyphus/evidence/task-12-shutdown.txt
  ```

  **Commit**: YES (groups with Tasks 9, 10, 11)
  - Message: `refactor(container): expose service interfaces, add Shutdown() for clean cleanup`
  - Files: `container/container.go`, `container/container_test.go`
  - Pre-commit: `go build ./... && go test ./...`

- [ ] 13. Write Route Handler Tests (Auth, RSVP, Comments, Guest Management)

  **What to do**:
  - Create `routes/routes_test.go` with shared test helpers:
    - `setupTestRouter(mockGuestService, mockCommentService)` — creates Gin test router with mocked container
    - Helper to create valid JWT token for authenticated requests
    - `gin.SetMode(gin.TestMode)` in `TestMain()` or init()
  - Create `routes/auth_routes_test.go`:
    - Test `GET /login/:name` with valid guest name (returns JWT)
    - Test `GET /login/:name` with non-existent guest (returns 401)
    - Test `GET /login/:name` with URL-encoded name
  - Create `routes/comment_routes_test.go`:
    - Test `POST /comments` with valid auth + valid comment (returns 201)
    - Test `POST /comments` when max limit reached (returns 400 + correct error)
    - Test `GET /comments` returns paginated comments
    - Test `GET /comments/count` returns correct count
  - Create `routes/rsvp_routes_test.go`:
    - Test `POST /rsvp` with valid RSVP data
    - Test `POST /rsvp` with missing required fields (returns 400)
  - Create `routes/guest_routes_test.go`:
    - Test `GET /guest/profile` returns authenticated guest data
    - Test `POST /admin/guests/upload` CSV upload with valid data
    - Test `POST /admin/guests/upload` CSV upload with malformed CSV (bounds check)
  - Use `httptest.NewRecorder()` + `router.ServeHTTP()` for all HTTP tests
  - Use function-field mocks for `GuestServiceInterface` and `CommentServiceInterface`

  **Must NOT do**:
  - Do not modify any route handler code (only add tests)
  - Do not start a real HTTP server (use `httptest` only)
  - Do not hit real database (all deps are mocked)
  - Do not create integration tests that require `main.go`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Covers 5+ route files, requires understanding of Gin handler testing, JWT token creation in tests, and proper mock wiring through container.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 14, 15)
  - **Blocks**: F1-F4 (final verification)
  - **Blocked By**: Tasks 1, 2, 8, 9, 11, 12 (needs clean handlers, migrated auth, working container interfaces)

  **References**:

  **Pattern References**:
  - `middleware/auth/auth_test.go` (from Task 8) — Gin test context setup pattern to reuse
  - `routes/auth_routes.go` — Login handler logic (JWT generation, guest lookup)
  - `routes/comment_routes.go` — Comment handlers (create, list, count)
  - `routes/rsvp_routes.go` — RSVP handler (submit, update)
  - `routes/guest_routes.go` — Guest profile + admin upload handlers

  **API/Type References**:
  - `services/interfaces.go` — Mock interfaces for handler dependencies
  - `container/container.go` — Container struct with interface fields (from Task 12)
  - `middleware/auth/auth_with_service.go` — `GenerateToken()` to create test JWTs

  **WHY Each Reference Matters**:
  - `auth_test.go`: Reuse the Gin test context pattern (don't reinvent)
  - Route files: Must understand each handler's request parsing, validation, and response format to write accurate tests
  - `container.go`: Tests need to construct a container with mock services

  **Acceptance Criteria**:
  - [ ] `routes/routes_test.go` exists with shared test helpers
  - [ ] `routes/auth_routes_test.go` with >= 3 test functions
  - [ ] `routes/comment_routes_test.go` with >= 4 test functions
  - [ ] `routes/rsvp_routes_test.go` with >= 2 test functions
  - [ ] `routes/guest_routes_test.go` with >= 3 test functions
  - [ ] `go test ./routes/...` passes all tests
  - [ ] Tests use httptest (no real HTTP server)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Route handler tests pass
    Tool: Bash
    Preconditions: All Wave 1-3 tasks complete
    Steps:
      1. Run `go test -v ./routes/... 2>&1 | grep -c "--- PASS"`
      2. Run `go test -v ./routes/... 2>&1 | grep -c "--- FAIL"`
      3. Run `go test ./routes/...`
    Expected Result: Step 1 >= 12, step 2 = 0, step 3 exits 0
    Failure Indicators: Test failures, mock wiring errors, import cycle errors
    Evidence: .sisyphus/evidence/task-13-route-tests.txt

  Scenario: CSV malformed input handled gracefully
    Tool: Bash
    Preconditions: guest_routes_test.go created
    Steps:
      1. Run `go test -v -run TestCSV ./routes/... 2>&1 | tail -10`
    Expected Result: CSV bounds test passes (malformed input returns error, no panic)
    Failure Indicators: Panic, test failure
    Evidence: .sisyphus/evidence/task-13-csv-test.txt
  ```

  **Commit**: YES
  - Message: `test: add route handler tests for auth, RSVP, comments, guest management`
  - Files: `routes/routes_test.go`, `routes/auth_routes_test.go`, `routes/comment_routes_test.go`, `routes/rsvp_routes_test.go`, `routes/guest_routes_test.go`
  - Pre-commit: `go test ./routes/...`

---

- [ ] 14. Remove ValidateGuestAccess() Duplication

  **What to do**:
  - In `services/guest_service.go`, `ValidateGuestAccess()` is identical to `GetGuestByName()` — both delegate to `guestCache.GetByName()`
  - Option A (preferred): Make `ValidateGuestAccess()` call `GetGuestByName()` internally (single line: `return s.GetGuestByName(name)`)
  - Option B: Remove `ValidateGuestAccess()` entirely and update all callers to use `GetGuestByName()`
  - If using Option A: Keep both methods on the interface (semantic difference: validation vs data retrieval) but eliminate code duplication
  - If using Option B: Update `services/interfaces.go` to remove `ValidateGuestAccess()`, update `middleware/auth/auth_with_service.go` caller
  - Run `go build ./...` and `go test ./...`
  - Prefer Option A for minimal blast radius

  **Must NOT do**:
  - Do not change the behavior of either method
  - Do not remove the method from the interface if using Option A
  - Do not change any caller logic beyond redirecting the call

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: One-line change (delegate to existing method). Minimal scope.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 13, 15)
  - **Blocks**: F1-F4 (final verification)
  - **Blocked By**: Task 3 (interfaces defined)

  **References**:

  **Pattern References**:
  - `services/guest_service.go` — Both `ValidateGuestAccess()` and `GetGuestByName()` methods

  **API/Type References**:
  - `services/interfaces.go` — `GuestServiceInterface` (may need update if removing method)
  - `middleware/auth/auth_with_service.go` — Calls `ValidateGuestAccess()` (main caller)

  **WHY Each Reference Matters**:
  - `guest_service.go`: Both methods do `return s.guestCache.GetByName(name)`. Exact same line. Duplication is obvious.
  - `auth_with_service.go`: This is the primary caller of `ValidateGuestAccess()`. If removed, must update here.

  **Acceptance Criteria**:
  - [ ] `ValidateGuestAccess()` no longer duplicates `GetGuestByName()` logic
  - [ ] `go build ./...` succeeds
  - [ ] `go test ./...` passes (including service and middleware tests)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Duplication removed
    Tool: Bash
    Preconditions: guest_service.go updated
    Steps:
      1. Run `grep -A3 "ValidateGuestAccess" services/guest_service.go`
      2. Run `go build ./...`
      3. Run `go test ./...`
    Expected Result: ValidateGuestAccess delegates to GetGuestByName (or removed), builds and tests pass
    Failure Indicators: Duplicate cache call still present, build/test failures
    Evidence: .sisyphus/evidence/task-14-dedup.txt
  ```

  **Commit**: YES (groups with Tasks 13, 15)
  - Message: `refactor: deduplicate ValidateGuestAccess in GuestService`
  - Files: `services/guest_service.go`
  - Pre-commit: `go build ./... && go test ./...`

---

- [ ] 15. Fix Model Test Helper Schema Drift

  **What to do**:
  - The `setupDB()` helper in `models/guest_test.go` and `models/comment_test.go` copy-pastes the schema from `database/database.go`
  - Refactor: Extract schema SQL into a shared constant or function in `database/` package
  - Create `database/schema.go` with `const SchemaSQL = ...` or `func CreateSchema(db *sql.DB) error`
  - Update `database/database.go` `InitDB()` to use `SchemaSQL` or `CreateSchema()`
  - Update both test `setupDB()` helpers to use `database.CreateSchema()` or `database.SchemaSQL`
  - This eliminates the drift risk: schema changes in one place propagate everywhere
  - Run `go test ./models/...` to verify

  **Must NOT do**:
  - Do not change the schema itself (only extract it)
  - Do not change test logic beyond replacing inline schema with shared reference
  - Do not add new tables or columns

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Extract constant/function, update 3 files. Mechanical refactoring.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 13, 14)
  - **Blocks**: F1-F4 (final verification)
  - **Blocked By**: None (independent, but placed in Wave 4 for test stability after all model changes)

  **References**:

  **Pattern References**:
  - `database/database.go` — `InitDB()` function with inline schema SQL (CREATE TABLE statements)
  - `models/guest_test.go` — `setupDB()` helper with copy-pasted schema
  - `models/comment_test.go` — `setupDB()` helper with copy-pasted schema (may be same function or separate)

  **WHY Each Reference Matters**:
  - `database.go` + test helpers: If someone adds a column to `database.go` but forgets to update test schemas, tests silently test against wrong schema

  **Acceptance Criteria**:
  - [ ] `database/schema.go` exists with shared schema definition (constant or function)
  - [ ] `database/database.go` uses shared schema (no inline SQL duplication)
  - [ ] Both test `setupDB()` use shared schema
  - [ ] `go test ./models/...` passes
  - [ ] `go test ./...` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Schema extracted and shared
    Tool: Bash
    Preconditions: database/schema.go created
    Steps:
      1. Run `test -f database/schema.go && echo PASS || echo FAIL`
      2. Run `grep -c "CREATE TABLE" database/database.go` (should be 0 or 1 if using shared)
      3. Run `grep -n "database." models/guest_test.go | grep -i "schema\|CreateSchema" | wc -l`
      4. Run `go test ./...`
    Expected Result: Step 1 PASS, step 2 shows reduced inline SQL, step 3 >= 1, step 4 exits 0
    Failure Indicators: Schema still duplicated, tests fail
    Evidence: .sisyphus/evidence/task-15-schema-shared.txt
  ```

  **Commit**: YES (groups with Tasks 13, 14)
  - Message: `refactor: extract shared schema to prevent test/prod drift`
  - Files: `database/schema.go`, `database/database.go`, `models/guest_test.go`, `models/comment_test.go`
  - Pre-commit: `go test ./...`
---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `go build ./...` + `go vet ./...` + `go test ./...` + `go test -race ./...`. Review all changed files for: commented-out code, unused imports, empty error handling (`_ = err`), `//nolint` without justification, overly generic names. Check for AI slop: excessive comments, over-abstraction, unnecessary helpers.
  Output: `Build [PASS/FAIL] | Vet [PASS/FAIL] | Tests [N pass/N fail] | Race [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high`
  Start from clean state. Run `go run main.go`. Use curl to test ALL API endpoints: login flow (JWT), guest profile, RSVP submission, comment creation (including max limit), guest management (CSV upload, bulk operations), invitation opened tracking. Verify no behavioral changes from before. Save responses to `.sisyphus/evidence/final-qa/`.
  Output: `Endpoints [N/N pass] | Auth Flow [PASS/FAIL] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| After | Message | Files | Pre-commit |
|-------|---------|-------|------------|
| Task 1 | `chore: remove dead spotify code` | spotify/*, routes/spotify_routes.go, main.go, config/config.go | `go build ./...` |
| Task 2 | `refactor(auth): extract Claims/GenerateToken, migrate comment auth, delete deprecated auth.go` | middleware/auth/*, routes/comment_routes.go | `go build ./... && go test ./...` |
| Tasks 3-4 | `refactor: add service/cache interfaces, fix DB path + rows.Err()` | services/, cache/, database/, models/, repositories/ | `go build ./...` |
| Tasks 5-8 | `test: add TDD tests for cache, models, services, middleware` | *_test.go files | `go test ./...` |
| Tasks 9-12 | `fix: transaction bugs, cache race condition, CSV bounds, sentinel errors, container interfaces` | models/, cache/, routes/, container/ | `go test ./... && go test -race ./...` |
| Tasks 13-15 | `test: add route handler tests, remove ValidateGuestAccess dupe, fix test helper schema` | routes/*_test.go, services/, models/ | `go test ./...` |

---

## Success Criteria

### Verification Commands
```bash
go build ./...          # Expected: clean build, zero errors
go vet ./...            # Expected: no issues
go test ./...           # Expected: all tests pass (existing + new)
go test -race ./...     # Expected: no race conditions detected
go test -count=1 ./...  # Expected: no flaky tests
grep -r "spotify" --include="*.go" .  # Expected: no matches
grep -r "JWTMiddleware()" --include="*.go" .  # Expected: no matches (only JWTMiddlewareWithService)
test ! -f middleware/auth/auth.go  # Expected: file does not exist
test ! -d spotify/  # Expected: directory does not exist
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass (including race detector)
- [ ] No dead code references remain
- [ ] All services use interface-based DI
- [ ] API behavior unchanged (curl tests pass)
