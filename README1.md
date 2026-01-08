# 💪 Fitness Duel - 1v1 Live Fitness Competition Platform

A real-time, interactive fitness duel platform where two players compete in bodyweight exercises with live video streaming, voice chat, and mutual winner selection.

## 🎯 Features

- **Live 1v1 Duels**: Real-time video streaming between competitors
- **Bodyweight Exercises**: Squats, push-ups, sit-ups, jumping jacks, burpees, planks, wall-sits
- **Auto Matchmaking**: Pair with opponents based on exercise selection
- **Automatic Recording**: All duels are recorded for review
- **Live Voice Chat**: Communicate during review phase
- **Mutual Winner Selection**: Fair winner declaration system
- **Cross-Platform**: Web and mobile (iOS/Android) support

## 🏗️ Project Structure

```
fitness-duel-monorepo/
├── apps/
│   ├── backend/          # Node.js + Express + Socket.io + WebRTC signaling
│   ├── web/              # Next.js web application
│   └── mobile/           # React Native mobile app (Expo)
├── packages/
│   └── shared/           # Shared types, utilities, and constants
└── package.json          # Monorepo root
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- For mobile: Expo CLI and Expo Go app on your phone

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Running the Applications

**Option 1: Run all (backend + web)**
```bash
npm run dev
```

**Option 2: Run individually**
```bash
# Backend server (port 3001)
npm run dev:backend

# Web app (port 3000)
npm run dev:web

# Mobile app
npm run dev:mobile
```

### Environment Setup

Create `.env` files in each app directory:

**apps/backend/.env**
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**apps/web/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**apps/mobile/.env**
```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3001
EXPO_PUBLIC_WS_URL=ws://YOUR_LOCAL_IP:3001
```

## 📱 Technology Stack

### Backend
- **Node.js + Express**: REST API
- **Socket.io**: Real-time matchmaking and signaling
- **WebRTC**: Peer-to-peer video/audio streaming
- **MongoDB/PostgreSQL**: User data and match history (optional)

### Web Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **WebRTC**: Video streaming
- **Socket.io-client**: Real-time communication

### Mobile App
- **React Native (Expo)**: Cross-platform mobile development
- **TypeScript**: Type safety
- **Expo Camera**: Video capture
- **Expo AV**: Video playback
- **Socket.io-client**: Real-time communication

## 🎮 How to Play

1. **Select Exercise**: Choose from bodyweight exercises
2. **Auto-Match**: System pairs you with another player
3. **Countdown**: 3...2...1... GO!
4. **Live Duel**: Perform exercise while seeing opponent (30-90 seconds)
5. **Review**: Watch recordings and discuss via voice chat
6. **Vote**: Both players select winner
7. **Winner Declared**: Mutual agreement declares the champion 🏆

## 🔧 Development

### Backend Development
```bash
cd apps/backend
npm run dev
```

### Web Development
```bash
cd apps/web
npm run dev
```

### Mobile Development
```bash
cd apps/mobile
npm start
```

## 📦 Building for Production

```bash
# Build all apps
npm run build

# Build specific app
npm run build --workspace=apps/web
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 API Endpoints

- `POST /api/queue/join` - Join matchmaking queue
- `POST /api/queue/leave` - Leave queue
- `GET /api/exercises` - Get available exercises
- `POST /api/match/result` - Submit match result
- `GET /api/leaderboard` - Get rankings

## 🔌 WebSocket Events

### Client → Server
- `join-queue`: Join matchmaking
- `leave-queue`: Leave matchmaking
- `select-winner`: Vote for winner
- `offer`, `answer`, `ice-candidate`: WebRTC signaling

### Server → Client
- `match-found`: Match created
- `countdown-start`: Duel starting
- `duel-end`: Time's up
- `winner-declared`: Match result
- `offer`, `answer`, `ice-candidate`: WebRTC signaling

## 🤝 Contributing

This is a personal project. Feel free to fork and customize!

## 📄 License

MIT License - Feel free to use this for your own fitness app!

## 🎯 Roadmap

- [ ] User authentication
- [ ] AI rep counting
- [ ] Leaderboards and rankings
- [ ] Friend system
- [ ] Custom challenges
- [ ] Video highlights
- [ ] Social sharing
- [ ] Tournament mode

---

**Built with ❤️ for fitness enthusiasts who love competition!**
