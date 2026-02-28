# DATA MODELS

Core data structures with embedded CRUD.

## PATTERNS
- Structs: `Guest`, `Comment`
- Optional fields: `sql.NullBool`, `sql.NullString`, `sql.NullTime`
- CRUD methods embedded on models (e.g., `guest.Create(db)`)
- Transaction handling: `tx.Begin()`, `defer tx.Rollback()`, `tx.Commit()`
- Error logging with context before returning

## TESTS
- Unit tests: `guest_test.go`, `comment_test.go`
- Standard `testing` package with `testify` assertions

## WHERE TO LOOK
| Task | File |
|------|------|
| Add field to Guest | Update struct → add migration → update repo/service |

## KNOWN VIOLATIONS
| Location | Issue |
|----------|-------|
| `guest.go:260-277` | `MarkInvitationOpened()` lacks transaction |
| `comment.go:16-40` | `Create()` lacks transaction |
