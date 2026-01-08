# 🌐 Web Frontend Setup

Next.js web application for Fitness Duel with live video streaming and real-time matchmaking.

## Features

- **Modern UI**: Built with Next.js 14 and TailwindCSS
- **Live Video**: WebRTC peer-to-peer video streaming
- **Real-time Updates**: Socket.io integration
- **Responsive Design**: Works on desktop and mobile browsers
- **State Management**: Zustand for global state

## Prerequisites

- Node.js 18+ and npm 9+
- Modern browser with WebRTC support

## Installation

```bash
npm install
```

## Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Development

```bash
npm run dev
```

App will start on http://localhost:3000

## Pages

- `/` - Home page with username creation
- `/lobby` - Exercise selection and matchmaking
- `/match/[matchId]` - Live duel and review

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── lobby/
│   │   │   └── page.tsx       # Lobby page
│   │   ├── match/
│   │   │   └── [matchId]/
│   │   │       └── page.tsx   # Match page
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── stores/
│       ├── userStore.ts       # User state
│       └── socketStore.ts     # Socket connection
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first CSS
- **Socket.io-client**: Real-time communication
- **WebRTC**: Video/audio streaming
- **Zustand**: State management

## Building for Production

```bash
npm run build
npm start
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires WebRTC support.

## Tips

- Use headphones to avoid echo during matches
- Allow camera and microphone permissions
- Stable internet connection recommended (1+ Mbps)
- Use modern browser for best experience

## Future Features

- User profiles with avatars
- Match history
- Video replay
- Friend challenges
- Tournaments
- Social sharing
