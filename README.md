# Wedding Invitation PWA

A beautiful, interactive wedding invitation application built as a Progressive Web App (PWA) with a Go backend and React frontend. Features include guest authentication, RSVP management, comment system, venue mapping, photo gallery, and Spotify music integration.

## ✨ Features

- **Guest Authentication**: JWT-based login system for personalized experiences
- **RSVP Management**: Comprehensive response tracking with meal preferences
- **Comment System**: Real-time guest comments and messages
- **Interactive Venue Map**: OpenStreetMap integration with venue location
- **Photo Gallery**: Wedding photo showcase
- **Music Integration**: Spotify Web Playbook SDK for music streaming
- **Gift Information**: Banking details section for wedding gifts
- **Responsive Design**: Material-UI components with mobile-first approach
- **PWA Support**: Installable web app with offline capabilities

## 🚀 Quick Start

### Prerequisites

- Go 1.21.13 or higher
- Node.js 18+ and npm
- Docker and Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-invitation-app2
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Backend Setup**
   ```bash
   go mod tidy && go mod download
   go run main.go
   ```

4. **Frontend Setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Docker Development

```bash
# Start the full stack
docker-compose up --build

# Or start services individually
docker-compose up backend
docker-compose up frontend
```

## 🏗️ Architecture

### Backend (Go + Gin)
- **Framework**: Gin web framework with RESTful API design
- **Database**: SQLite with custom implementation
- **Authentication**: JWT tokens for guest authentication, API keys for admin
- **External APIs**: Spotify Web API integration
- **Testing**: Unit tests for models and repositories

### Frontend (React + Vite)
- **Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite with hot module replacement
- **UI Library**: Material-UI for consistent design system
- **State Management**: React Context API
- **Routing**: React Router for navigation
- **Maps**: Leaflet with OpenStreetMap tiles

### Key Components
- `InvitationLanding.jsx` - Main invitation interface
- `LoginPage.jsx` - Guest authentication
- `RsvpSection.jsx` - RSVP form and management
- `GuestComments.jsx` - Comment system
- `VenueMap.jsx` - Interactive venue mapping
- `MusicPlayer.jsx` - Spotify integration
- `WeddingPhotoGallery.jsx` - Photo showcase
- `GiftBox.jsx` - Gift information display

## 🔧 Development Commands

### Backend
```bash
# Run development server
go run main.go

# Build for production
go build -o wedding-backend main.go

# Run tests
go test ./models/...
go test -v ./models/...

# Install dependencies
go mod tidy && go mod download
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Install dependencies
npm install
```

### Docker
```bash
# Full stack development
docker-compose up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Individual services
docker-compose up backend
docker-compose up frontend
```

## ⚙️ Environment Configuration

### Backend Variables
Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRY=86400

# Spotify Integration
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=http://localhost:8080/spotify/callback

# Database
DB_PATH=data/guests.db

# Server
SERVER_PORT=:8080

# Admin
ADMIN_API_KEY=your-admin-api-key
```

### Frontend Variables (Docker build-time)
Set these in your Docker environment or docker-compose.yml:

```env
VITE_APP_WEDDING_DATE=2024-12-31
VITE_APP_VENUE_LAT=40.7128
VITE_APP_VENUE_LNG=-74.0060
VITE_PARTNER1_ACCOUNT_NAME=Partner One
VITE_PARTNER1_ACCOUNT_NUMBER=123456789
VITE_PARTNER2_ACCOUNT_NAME=Partner Two
VITE_PARTNER2_ACCOUNT_NUMBER=987654321
VITE_YOUTUBE_PLAYLIST_URL=https://youtube.com/playlist?list=...
```

## 📊 Database Schema

### Guests Table
- Guest identification and authentication
- Contact information and preferences
- Password-based login credentials

### Comments Table
- Guest messages and well-wishes
- Timestamps and moderation status

### RSVPs Table
- Attendance responses
- Meal preferences and dietary restrictions
- Plus-one information

## 🔐 Authentication & Security

- **Guest Authentication**: JWT-based system with guest-specific passwords
- **Admin Access**: API key authentication for management endpoints
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Server-side validation on all endpoints
- **Secure Headers**: Production security headers via Nginx

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
go test ./models/...

# Run with verbose output
go test -v ./models/...

# Run specific test files
go test ./models/guest_test.go
go test ./models/comment_test.go
```

### API Testing
- Postman collection available: `wedding-app.postman_collection.json`
- API documentation: `API_DOCUMENTATION.md`

## 📁 Project Structure

```
wedding-invitation-app2/
├── main.go                 # Application entry point
├── config/                 # Configuration management
├── models/                 # Data models and tests
├── routes/                 # API route handlers
├── middleware/             # Authentication middleware
├── database/               # Database implementation
├── spotify/                # Spotify integration
├── data/                   # Database and sample data
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── api/           # API service layer
│   │   └── routes/        # Route configuration
│   └── package.json
├── docker-compose.yml      # Docker configuration
└── README.md
```

## 🚀 Deployment

### Docker Production
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Update deployment
docker-compose -f docker-compose.prod.yml up -d --build
```

### Manual Deployment
1. Build backend: `go build -o wedding-backend main.go`
2. Build frontend: `cd frontend && npm run build`
3. Serve frontend static files with Nginx/Apache
4. Run backend binary with production environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow existing code patterns and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 API Documentation

Detailed API documentation is available in `API_DOCUMENTATION.md`. Key endpoints include:

- `POST /login/:name` - Guest authentication
- `GET /api/guest/profile` - Guest profile data
- `POST /api/rsvp` - RSVP submission
- `GET /api/comments` - Retrieve comments
- `POST /api/comments` - Submit new comment
- `GET /spotify/*` - Spotify integration endpoints

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Check frontend URL in `main.go` CORS configuration
- Verify environment variables are set correctly

**Database Locked**
- Stop all running instances before starting new ones
- Check file permissions on database directory

**Vite Not Detecting Changes**
- Ensure `usePolling: true` in `vite.config.js` (WSL2)
- Restart the development server

**Environment Variables**
- Frontend variables must be prefixed with `VITE_`
- Backend variables should be in `.env` file in root directory

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For questions or issues:
1. Check existing documentation in `CLAUDE.md`
2. Review API documentation in `API_DOCUMENTATION.md`
3. Test with provided Postman collection
4. Check logs for detailed error information