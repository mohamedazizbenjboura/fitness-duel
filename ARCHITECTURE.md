# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Web Browser │  │  iOS App     │  │ Android App  │      │
│  │  (Next.js)   │  │  (Expo)      │  │  (Expo)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          │  HTTP/WS         │  HTTP/WS         │  HTTP/WS
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼──────────────┐
│         ▼                  ▼                  ▼              │
│    ┌─────────────────────────────────────────────┐          │
│    │         Backend Server (Node.js)            │          │
│    │  ┌──────────────┐  ┌──────────────────┐    │          │
│    │  │  Express API │  │  Socket.io       │    │          │
│    │  │  (REST)      │  │  (WebSocket)     │    │          │
│    │  └──────────────┘  └──────────────────┘    │          │
│    │  ┌──────────────┐  ┌──────────────────┐    │          │
│    │  │  Queue       │  │  Match           │    │          │
│    │  │  Manager     │  │  Manager         │    │          │
│    │  └──────────────┘  └──────────────────┘    │          │
│    └─────────────────────────────────────────────┘          │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    WebRTC P2P Connection                      │
│                                                              │
│   Browser/App 1  ◄────────────────────────────►  Browser/App 2 │
│                                                              │
│   (Video/Audio streams directly between peers)               │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Language**: TypeScript
- **WebRTC**: Built-in signaling

### Web Frontend
- **Framework**: Next.js 14
- **UI**: React 18
- **Styling**: TailwindCSS
- **State**: Zustand
- **Real-time**: Socket.io-client
- **Video**: WebRTC API

### Mobile App
- **Platform**: React Native (Expo)
- **Navigation**: React Navigation
- **Camera**: Expo Camera
- **Video**: Expo AV
- **State**: Zustand
- **Real-time**: Socket.io-client

### Shared
- **Language**: TypeScript
- **Types**: Shared across all apps
- **Utils**: Common utilities
- **Constants**: Centralized configuration

## Data Flow

### 1. Matchmaking Flow

```
User A              Backend                 User B
  |                    |                      |
  |-- JOIN_QUEUE -->   |                      |
  |                    |   <-- JOIN_QUEUE ---|
  |                    |                      |
  |                [Match Found]              |
  |                    |                      |
  | <-- MATCH_FOUND    |    MATCH_FOUND -->  |
  |                    |                      |
```

### 2. WebRTC Connection Flow

```
Player 1           Backend          Player 2
   |                  |                 |
   |-- Offer -------->|                 |
   |                  |---- Offer ----->|
   |                  |                 |
   |                  |<--- Answer -----|
   |<--- Answer ------|                 |
   |                  |                 |
   |-- ICE ---------->|---- ICE ------->|
   |<--- ICE ---------|<--- ICE --------|
   |                  |                 |
   |                                    |
   |<========= P2P Connection =========>|
   |         (Video/Audio)              |
```

### 3. Match Lifecycle

```
┌────────────┐
│   WAITING  │ Initial state
└─────┬──────┘
      │
      ▼
┌────────────┐
│ COUNTDOWN  │ 3...2...1...
└─────┬──────┘
      │
      ▼
┌────────────┐
│IN_PROGRESS │ Exercise time!
└─────┬──────┘
      │
      ▼
┌────────────┐
│   REVIEW   │ Watch recordings
└─────┬──────┘
      │
      ▼
┌────────────┐
│   VOTING   │ Select winner
└─────┬──────┘
      │
      ▼
┌────────────┐
│ COMPLETED  │ Winner declared
└────────────┘
```

## Component Structure

### Backend Services

```
backend/
├── QueueManager
│   ├── addToQueue()
│   ├── removeFromQueue()
│   ├── tryMatch()
│   └── getQueueStats()
│
└── MatchManager
    ├── createMatch()
    ├── updateMatchStatus()
    ├── updatePlayerResult()
    └── cleanupOldMatches()
```

### Frontend Components (Web)

```
web/
├── Pages
│   ├── Home (/)
│   ├── Lobby (/lobby)
│   └── Match (/match/[id])
│
└── Stores
    ├── userStore (User data)
    └── socketStore (Connection)
```

### Mobile Screens

```
mobile/
├── HomeScreen
│   └── Username entry
├── LobbyScreen
│   └── Exercise selection
└── MatchScreen
    └── Live duel + voting
```

## Communication Protocols

### HTTP REST API
```
GET  /health
GET  /api/exercises
POST /api/users
GET  /api/matches/active
GET  /api/matches/:id
POST /api/matches/:id/result
GET  /api/leaderboard
```

### WebSocket Events

**Client → Server:**
- `identify`
- `join-queue`
- `leave-queue`
- `select-winner`
- `webrtc-offer`
- `webrtc-answer`
- `webrtc-ice-candidate`

**Server → Client:**
- `match-found`
- `countdown-start`
- `duel-start`
- `duel-end`
- `vote-update`
- `winner-declared`
- `webrtc-offer`
- `webrtc-answer`
- `webrtc-ice-candidate`

## Security Considerations

### Current (MVP)
- CORS configuration
- WebSocket origin validation
- Basic input validation

### Future
- JWT authentication
- Rate limiting
- SQL injection prevention
- XSS protection
- CSRF tokens
- Encryption at rest
- HTTPS enforcement
- Content Security Policy

## Scalability

### Current Capacity
- Single server instance
- In-memory storage
- Suitable for testing/demo

### Future Scaling
- Load balancer
- Multiple server instances
- Redis for shared state
- Database for persistence
- CDN for static assets
- Message queue for async tasks
- Kubernetes for orchestration

## Monitoring & Observability

### Future Implementation
- Application logs (Winston)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Analytics (Google Analytics)
- User behavior (Mixpanel)
- Infrastructure monitoring (Prometheus)
- Alerting (PagerDuty)

## Deployment Strategy

### Development
- Local development servers
- Hot reloading
- Debug mode

### Staging
- Docker containers
- CI/CD pipeline
- Automated testing

### Production
- Cloud hosting (AWS/Azure/GCP)
- Auto-scaling
- Health checks
- Blue-green deployment
- Rollback capability

---

**This architecture is designed to be simple for MVP and scalable for production.**
