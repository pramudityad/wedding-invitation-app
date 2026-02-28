# Decisions

## [2026-02-27] Session ses_35eb8a5ddffeH5PLFbhrqVHGIu — Plan Start

### Architecture Decisions
- Keep 4-layer architecture (models, repos, services, routes) — no restructuring
- TDD approach: write tests for current behavior first, then refactor with safety net
- Function-field mocks in `_test.go` files only — no `mocks/` directory
- Option A for ValidateGuestAccess dedup: delegate to GetGuestByName (minimal blast radius)
- Interface-based DI: add interfaces only where needed for testability
