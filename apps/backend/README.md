# 🔧 Backend Server Setup

This is the Node.js backend server for Fitness Duel, handling WebRTC signaling, matchmaking, and real-time communication.

## Features

- **REST API**: User management, match history, leaderboards
- **WebSocket (Socket.io)**: Real-time matchmaking and signaling
- **WebRTC Signaling**: Peer-to-peer video/audio connection setup
- **Matchmaking Queue**: Automatic player pairing by exercise type
- **Match Management**: Track match lifecycle and results

## Prerequisites

- Node.js 18+ and npm 9+
- Port 3001 available

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Development

```bash
npm run dev
```

Server will start on http://localhost:3001

## API Endpoints

### Health Check
```
GET /health
```

### Exercises
```
GET /api/exercises
```

### Users
```
POST /api/users
Body: { "username": "string" }
```

### Matches
```
GET /api/matches/active
GET /api/matches/:matchId
POST /api/matches/:matchId/result
```

### Leaderboard
```
GET /api/leaderboard
```

## WebSocket Events

### Client → Server
- `identify`: Identify user connection
- `join-queue`: Join matchmaking queue
- `leave-queue`: Leave queue
- `select-winner`: Vote for winner
- `webrtc-offer`: Send WebRTC offer
- `webrtc-answer`: Send WebRTC answer
- `webrtc-ice-candidate`: Send ICE candidate

### Server → Client
- `match-found`: Match created
- `countdown-start`: Countdown beginning
- `duel-start`: Duel starting
- `duel-end`: Time's up
- `vote-update`: Voting status
- `winner-declared`: Winner announced
- `webrtc-offer`: Receive offer
- `webrtc-answer`: Receive answer
- `webrtc-ice-candidate`: Receive ICE candidate

## Architecture

```
backend/
├── src/
│   ├── index.ts          # Server entry point
│   ├── routes/           # API routes
│   │   └── index.ts
│   ├── socket/           # Socket.io handlers
│   │   └── index.ts
│   └── services/         # Business logic
│       ├── QueueManager.ts
│       └── MatchManager.ts
```

## Production Deployment

1. Build:
```bash
npm run build
```

2. Start:
```bash
npm start
```

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication (JWT)
- Video storage (S3/Azure Blob)
- Rate limiting
- Analytics
- Admin dashboard
