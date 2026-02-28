# REPOSITORIES

Data access layer with interface-based design.

## PATTERNS
- Define interfaces in `repositories/` (e.g., `GuestRepository`)
- SQL implementation delegates to model methods
- Constructor pattern: `NewSQLGuestRepository(db) *SQLGuestRepository`
- Enable mocking for tests via interface

## WHERE TO LOOK
| Task | File |
|------|------|
| Guest repository | `guest_repository.go` |
| Comment repository | `comment_repository.go` |
| Add new query | Add interface method → implement in SQL repo → call from model/service |
