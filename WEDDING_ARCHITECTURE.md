# Comprehensive Architecture Document: Wedding Invitation PWA with Go Backend

## 1. System Overview
**Objective**: Create a secure, performant wedding invitation PWA with offline capabilities  
**Core Components**:
- React PWA frontend
- Go backend (Gin framework)
- SQLite database
- Service workers for offline functionality
- OpenStreetMap integration
- Spotify playback API

## 2. Architecture Diagram
```mermaid
graph TD
  A[Frontend: React PWA] -->|API Calls| B[Backend: Go Gin Server]
  B -->|Read/Write| C[(Database: SQLite)]
  A -->|Tile Requests| D[OpenStreetMap]
  A -->|Music Streaming| E[Spotify API]
  A -->|Caching| F[Service Workers]
```

## 3. Technology Specifications

### Frontend (React PWA)
| Component       | Technology          | Purpose                          |
|-----------------|---------------------|----------------------------------|
| Framework       | React 18            | UI rendering and state management|
| Routing         | React Router v6     | Dynamic invite URL handling      |
| Mapping         | Leaflet.js          | Venue mapping with OSM tiles     |
| State Management| Context API         | Global state for user session    |
| PWA Tools       | Workbox             | Service worker implementation    |
| UI Library      | Material-UI         | Consistent UI components         |

### Backend (Go)
| Component       | Technology          | Purpose                          |
|-----------------|---------------------|----------------------------------|
| Framework       | Gin                 | HTTP routing and middleware      |
| Authentication  | JWT                 | Secure invite access             |
| Database        | SQLite + GORM       | Guest data storage               |
| API Security    | AES-256 encryption  | Token security                   |
| Concurrency     | Goroutines          | Background processing            |

### External Services
| Service         | Integration Method  | Purpose                          |
|-----------------|---------------------|----------------------------------|
| OpenStreetMap   | Leaflet TileLayer   | Venue mapping                    |
| Spotify         | Web Playback SDK    | Music streaming                  |

## 4. Component Interactions

### Authentication Flow
```mermaid
sequenceDiagram
  participant Guest
  participant Frontend
  participant Backend
  participant Database
  
  Guest->>Frontend: Accesses invite URL
  Frontend->>Backend: Verify JWT token
  alt Valid Token
    Backend->>Database: Fetch guest data
    Database-->>Backend: Guest record
    Backend-->>Frontend: Personalized content
  else Invalid/Missing Token
    Backend-->>Frontend: 401 Unauthorized
    Frontend->>Guest: Show password prompt
    Guest->>Frontend: Submit password
    Frontend->>Backend: Authenticate
    Backend->>Database: Verify credentials
    Database-->>Backend: Validation result
    Backend-->>Frontend: New JWT token
  end
```

### Data Management
```mermaid
erDiagram
  GUEST ||--o{ RSVP : "submits"
  GUEST ||--o{ COMMENT : "posts"
  INVITE ||--|| LOCATION : "shows"
  
  GUEST {
    string id PK
    string name
    string email
    string password_hash
    string invitation_slug
  }
  
  RSVP {
    string id PK
    string guest_id FK
    string status
    datetime response_date
    string meal_preference
  }
  
  COMMENT {
    string id PK
    string guest_id FK
    text content
    datetime timestamp
  }
```

## 5. Performance Optimization
1. **PWA Caching Strategies**:
   - Precaching of core assets (HTML, CSS, JS)
   - Runtime caching for API responses
   - Cache-first strategy for map tiles
   
2. **Backend Optimization**:
   - Connection pooling for database
   - JWT token blacklisting
   - Gzip compression middleware

3. **Frontend Optimization**:
   - Code splitting for routes
   - Lazy loading for images
   - Virtualized lists for comments

## 6. Security Architecture
- **Authentication**: JWT with 24h expiration + refresh tokens
- **Data Encryption**: AES-256 for sensitive guest data
- **API Protection**: CORS restrictions, rate limiting
- **Input Validation**: Strict validation on all endpoints
- **HTTPS Enforcement**: All traffic over encrypted channels

## 7. Deployment Strategy
- **Frontend**: Static hosting (Netlify/Vercel)
- **Backend**: Containerized deployment (Docker)
- **Database**: SQLite file with daily backups
- **Monitoring**: Prometheus + Grafana for metrics