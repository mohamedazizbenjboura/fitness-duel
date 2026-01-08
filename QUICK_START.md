# 🚀 Quick Start Guide

Get Fitness Duel up and running in minutes!

## Step 1: Install Dependencies

From the project root directory:

```bash
npm run install:all
```

This installs dependencies for:
- Root workspace
- Backend server
- Web frontend
- Shared packages
- Mobile app

## Step 2: Configure Environment

### Backend
Create `apps/backend/.env`:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Web
Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Mobile (Optional)
Create `apps/mobile/.env`:
```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3001
EXPO_PUBLIC_WS_URL=ws://YOUR_LOCAL_IP:3001
```

Replace `YOUR_LOCAL_IP` with your computer's IP address (e.g., 192.168.1.100).

## Step 3: Start Development Servers

### Option 1: Run Everything (Backend + Web)
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:3001
- Web app on http://localhost:3000

### Option 2: Run Individually

**Backend only:**
```bash
npm run dev:backend
```

**Web only:**
```bash
npm run dev:web
```

**Mobile:**
```bash
npm run dev:mobile
```

## Step 4: Test the App

### Web Browser Testing

1. Open http://localhost:3000
2. Enter a username (e.g., "Player1")
3. Click "Start Fighting!"
4. Select an exercise
5. Open another browser/incognito window
6. Enter different username (e.g., "Player2")
7. Select same exercise
8. Both players will be matched! 🎉

### Mobile Testing

1. Install Expo Go on your phone
2. Run `npm run dev:mobile`
3. Scan QR code with phone
4. Follow same steps as web

## First Match Walkthrough

1. **Home Screen**: Enter username → Start Fighting
2. **Lobby**: Choose exercise (e.g., Push-ups)
3. **Searching**: Wait for opponent (open second window to match yourself)
4. **Match Found**: Get ready!
5. **Countdown**: 3...2...1...
6. **Duel**: Perform exercise for 60 seconds
7. **Review**: Watch recordings
8. **Vote**: Both players select winner
9. **Winner Declared**: Results shown! 🏆

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Run `npm install` in `apps/backend/`

### Web app shows connection error
- Ensure backend is running on port 3001
- Check `.env.local` configuration
- Clear browser cache

### Mobile can't connect
- Verify phone and computer on same WiFi
- Update `.env` with correct local IP
- Check firewall settings

### No camera/microphone
- Allow permissions when prompted
- Check browser settings
- Ensure HTTPS (or localhost)

### Match not starting
- Need 2 players for same exercise
- Open incognito window to test alone
- Check browser console for errors

## Testing Solo (Development)

To test by yourself:

1. Open browser window 1 → create user "Player1"
2. Open incognito window → create user "Player2"
3. Both select same exercise
4. Match will begin!

## Next Steps

✅ **You're ready to go!**

- Try all 7 exercises
- Test on different devices
- Invite friends to test
- Check console logs for debugging
- Read individual app READMEs for details

## Need Help?

- Check individual README files in each app directory
- Review console logs for errors
- Ensure all prerequisites are installed
- Verify network connectivity

---

**Happy Dueling! 💪🔥**
