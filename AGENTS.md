# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-28
**Commit:** a67a41d
**Branch:** f/28feb

## OVERVIEW
Wedding invitation PWA with Go (Gin) backend + React (Vite) frontend. JWT guest auth, RSVP tracking, comments, maps, YouTube music integration.

## STRUCTURE
```
./
├── main.go                    # Entry: DI container, DB init, routes
├── config/                    # Env loading + validation (warns on defaults)
├── container/                 # DI wiring (services ← repos)
├── database/                  # SQLite (modernc.org/sqlite - pure Go, no CGO)
├── cache/                     # In-memory (5min guests, 2min comments)
├── models/                    # Guest, Comment (embedded CRUD + transactions)
├── repositories/              # Interfaces + SQL impl (delegates to models)
├── services/                  # Business logic → cache → repo chain
├── routes/                    # HTTP handlers grouped by domain
├── middleware/                # JWT (service-injected), API key auth
├── spotify/                   # Spotify client (routes disabled)
├── migrations/                # Schema migrations
├── frontend/                  # React SPA (Vite)
│   ├── src/
│   │   ├── components/        # 20 UI components (flat, MUI styled)
│   │   ├── contexts/          # AuthContext, MusicContext
│   │   ├── hooks/             # useAuth (API logic)
│   │   └── api/               # Axios clients + interceptors
│   └── nginx.conf             # Static serve + API proxy
├── docker-compose.yml         # Backend + Frontend (Traefik separate)
├── traefik.yml                # Reverse proxy + Let's Encrypt
└── deploy.sh                  # Full deployment script
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add protected route | `routes/*_routes.go` → register in `routes/routes.go` | Access via `c.GuestService` |
| Add admin route | `routes/guest_routes.go` → register under `/admin` group | API key required |
| Modify Guest model | `models/guest.go` → `repositories/guest_repository.go` → `services/guest_service.go` | Add migration |
| Frontend API call | `frontend/src/api/*.js` | Uses `axiosConfig.js` for auth headers |
| Cache TTL config | `cache/guest_cache.go:18`, `services/comment_service.go:22` | Hardcoded |
| Add frontend component | `frontend/src/components/` | Flat structure, MUI styled() |
| Auth flow | `middleware/auth/auth_with_service.go` | Service-injected JWT |
| DI wiring | `container/container.go` | All services created here |

## CONVENTIONS

### Backend
- **DI Pattern**: All services wired in `container/container.go` - routes receive via container
- **Repository Interface**: Define in `repositories/` → SQL impl delegates to model methods
- **Cache Chain**: Service → Cache → Repository (cache wraps repo as decorator)
- **Transactions**: Model CRUD methods use `tx.Begin()`, `defer tx.Rollback()`, `tx.Commit()`
- **Error Handling**: Log with context → return error → handlers return JSON errors
- **Env Validation**: `config/config.go` warns on default JWT/API keys

### Frontend
- **State**: React Context (AuthContext: JWT, MusicContext: player) - NO Redux
- **API**: Axios in `frontend/src/api/` - auto-injects JWT from localStorage
- **Styling**: MUI `styled()` API with theme palette fallbacks
- **i18n**: i18next with locale files in `frontend/src/locales/`
- **Font System**: Great Vibes (headings), Poppins (body), Cormorant Garamond (quotes)

## ANTI-PATTERNS (THIS PROJECT)
- **NEVER** instantiate services directly in handlers - use container
- **NEVER** call model methods directly from handlers - go through service layer
- **NEVER** skip transactions on writes - model CRUD must wrap in tx
- **NEVER** access `sql.DB` directly outside `database/` and models
- **NEVER** use `go get` - use `go mod tidy && go mod download`
- **NEVER** use `as any`, `@ts-ignore`, `@ts-expect-error` in frontend
- **NEVER** direct DOM queries in React - use refs instead

## KNOWN VIOLATIONS (Technical Debt)
| Location | Issue | Impact |
|----------|-------|--------|
| `models/guest.go:260-277` | `MarkInvitationOpened()` lacks transaction | No rollback on failure |
| `models/comment.go:16-40` | `Create()` lacks transaction | No rollback on failure |
| `routes/routes.go:40` | Spotify routes commented out | Dead code |

## UNIQUE STYLES
- **Hybrid Repository**: Models embed CRUD (`guest.Create(db)`) - repos are thin delegates
- **Cache Decorator**: Cache implements repository interface, wraps actual repo
- **Service-Injected Middleware**: JWT middleware receives `*GuestService` for cached validation
- **Cache Keys**: `"guest_" + name`, `"all_guests"` for individual/list queries
- **Null Types**: `sql.NullBool`, `sql.NullString`, `sql.NullTime` for optional fields
- **Flat Frontend**: All components in single directory, no pages/views split

## COMMANDS
```bash
# Backend
go run main.go                              # Dev server (:8080)
go build -o wedding-backend main.go         # Production build
go test ./models/...                         # Unit tests

# Frontend
cd frontend && npm run dev                   # Dev server (:3000)
cd frontend && npm run build                 # Production build

# Docker
docker-compose up --build                   # Full stack (backend + frontend)
./deploy.sh                                 # Production deployment
```

## NOTES
- SQLite driver: `modernc.org/sqlite` (pure Go, no CGO)
- Database: `data/guests.db` (mounted as volume)
- Frontend env: Must prefix with `VITE_` (build-time in Docker)
- Cache: Per-instance, in-memory - restarts clear cache
- Route groups: `/login/*` (public), `/` (JWT), `/admin` (API key)
- Spotify: Routes disabled in `routes/routes.go:40`
- No CI/CD: Deployment is manual via `deploy.sh`
- No frontend tests: Testing framework not configured
