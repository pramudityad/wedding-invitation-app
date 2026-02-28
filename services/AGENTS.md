# SERVICES LAYER

Business logic with caching.

## PATTERNS
- Receive repository via constructor injection
- Create cache instance wrapping repository
- Delegate all operations to cache (cache delegates to repo)
- No direct DB access

## CACHE STRATEGY
- **Guest**: 5-minute TTL in `cache/guest_cache.go`
- **Comments**: 2-minute TTL in `services/comment_service.go`
- **Invalidation**: Cache cleared on create/update operations
  - Individual deletes: `cache.Delete("guest_" + name)`
  - Bulk operations: `cache.Clear()`
- Cache keys: `"guest_" + name`, `"all_guests"`

## WHERE TO LOOK
| Task | File |
|------|------|
| Guest CRUD with cache | `guest_service.go` |
| Comment CRUD with cache | `comment_service.go` |
| Cache TTL config | `cache/guest_cache.go`, `services/comment_service.go` |
