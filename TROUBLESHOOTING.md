# 🐛 Troubleshooting Guide

Common issues and solutions for Fitness Duel.

## Installation Issues

### Node version mismatch
**Problem**: `Error: Unsupported Node.js version`

**Solution**:
```bash
# Check Node version
node --version

# Should be 18.x or higher
# Install nvm (Node Version Manager)
# Then:
nvm install 18
nvm use 18
```

### npm install fails
**Problem**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Workspace dependencies not found
**Problem**: `Cannot find module '@fitness-duel/shared'`

**Solution**:
```bash
# From root directory
npm run install:all

# Or install workspaces
npm install --workspaces
```

## Backend Issues

### Port already in use
**Problem**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Find process using port 3001
# Windows:
netstat -ano | findstr :3001

# Mac/Linux:
lsof -i :3001

# Kill the process
# Windows:
taskkill /PID <PID> /F

# Mac/Linux:
kill -9 <PID>

# Or change port in .env
PORT=3002
```

### WebSocket connection failed
**Problem**: `WebSocket connection failed`

**Solution**:
1. Check if backend is running
2. Verify CORS settings in backend `.env`
3. Check firewall settings
4. Ensure WebSocket transports are enabled

### Socket.io not connecting
**Problem**: Clients can't connect to Socket.io

**Solution**:
```javascript
// Check Socket.io configuration
const io = new SocketServer(httpServer, {
  cors: {
    origin: "*", // For development only
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});
```

## Web Frontend Issues

### Next.js build fails
**Problem**: `Error: Build failed`

**Solution**:
```bash
# Clear .next directory
rm -rf .next

# Rebuild
npm run build
```

### Environment variables not working
**Problem**: `process.env.NEXT_PUBLIC_API_URL is undefined`

**Solution**:
1. Ensure `.env.local` file exists
2. Variables must start with `NEXT_PUBLIC_`
3. Restart dev server after changing env vars
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Camera/Microphone not working
**Problem**: `getUserMedia failed`

**Solution**:
1. Use HTTPS or localhost (HTTP won't work)
2. Check browser permissions
3. Allow camera/microphone in browser settings
4. Try different browser (Chrome recommended)

### WebRTC connection fails
**Problem**: Video not showing

**Solution**:
1. Check STUN/TURN server configuration
2. Verify both peers are connected
3. Check browser console for errors
4. Ensure firewall allows WebRTC
5. Try incognito mode

### Black screen during match
**Problem**: Camera shows black screen

**Solution**:
1. Check if camera is being used by another app
2. Grant browser camera permissions
3. Try refreshing the page
4. Check if correct camera is selected
5. Test camera in browser settings

## Mobile App Issues

### Expo won't start
**Problem**: `Error starting Expo`

**Solution**:
```bash
# Clear Expo cache
expo start -c

# Or
rm -rf .expo
npm start
```

### Can't connect to dev server
**Problem**: `Unable to connect to server`

**Solution**:
1. Ensure phone and computer on same WiFi
2. Check IP address in `.env` is correct
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```
3. Disable firewall temporarily
4. Try tunnel mode:
```bash
expo start --tunnel
```

### Camera permission denied
**Problem**: `Camera permission denied`

**Solution**:
1. Uninstall and reinstall app
2. Check phone settings → App permissions
3. Grant camera and microphone permissions
4. Restart app

### Build fails
**Problem**: `eas build` fails

**Solution**:
```bash
# Clear cache
expo prebuild --clean

# Update Expo
npm install -g expo-cli@latest

# Retry build
eas build --platform ios
```

## Match/Gameplay Issues

### Players can't match
**Problem**: Stuck in "Finding Opponent" screen

**Solution**:
1. Check if backend is running
2. Verify Socket.io connection
3. Both players must select same exercise
4. Check browser console for errors
5. Try leaving and rejoining queue

### Countdown doesn't start
**Problem**: Match found but countdown never begins

**Solution**:
1. Check Socket.io events in console
2. Verify match manager is working
3. Check for JavaScript errors
4. Refresh both browsers

### Video not streaming
**Problem**: Can't see opponent's video

**Solution**:
1. Check WebRTC connection status
2. Verify both peers granted camera access
3. Check STUN server connectivity
4. Ensure firewall allows UDP
5. Try different network

### Recording not working
**Problem**: Video not recording

**Solution**:
1. Check MediaRecorder support in browser
2. Verify camera is active
3. Check available disk space
4. Try different browser
5. Check console for errors

### Voting doesn't work
**Problem**: Can't select winner

**Solution**:
1. Verify both players are in review phase
2. Check Socket.io connection
3. Look for vote-related errors in console
4. Refresh page if needed

## Network Issues

### High latency
**Problem**: Lag during matches

**Solution**:
1. Use wired connection instead of WiFi
2. Close other applications
3. Check internet speed (min 1 Mbps)
4. Move closer to router
5. Reduce video quality

### Connection drops
**Problem**: Frequent disconnections

**Solution**:
1. Check internet stability
2. Implement reconnection logic
3. Use mobile data instead of WiFi
4. Contact ISP if persistent

## Performance Issues

### Web app slow
**Problem**: UI is laggy

**Solution**:
1. Clear browser cache
2. Close unused tabs
3. Disable browser extensions
4. Update browser
5. Use modern browser (Chrome 90+)

### Mobile app slow
**Problem**: App freezes or crashes

**Solution**:
1. Close background apps
2. Restart phone
3. Clear app cache
4. Update Expo Go app
5. Reduce video quality

## Development Issues

### Hot reload not working
**Problem**: Changes not reflecting

**Solution**:
```bash
# Next.js
# Delete .next folder
rm -rf .next
npm run dev

# Expo
expo start -c
```

### TypeScript errors
**Problem**: Type errors

**Solution**:
```bash
# Check TypeScript version
npx tsc --version

# Rebuild shared package
cd packages/shared
npm run build
```

### Import errors
**Problem**: `Module not found`

**Solution**:
1. Check import path is correct
2. Ensure package is installed
3. Check tsconfig paths
4. Restart dev server

## Database Issues (Future)

### Connection failed
**Problem**: Can't connect to database

**Solution**:
1. Check connection string
2. Verify database is running
3. Check firewall rules
4. Ensure credentials are correct

## Deployment Issues

### Build fails in production
**Problem**: Production build errors

**Solution**:
1. Test build locally first
2. Check environment variables
3. Review build logs
4. Verify dependencies

### SSL certificate errors
**Problem**: HTTPS not working

**Solution**:
1. Verify certificate is valid
2. Check domain configuration
3. Renew certificate if expired
4. Use Let's Encrypt for free SSL

## Getting Help

If you can't resolve an issue:

1. **Check Logs**:
   - Backend: `npm run dev` output
   - Browser: Console (F12)
   - Mobile: Expo console

2. **Search Issues**: Check GitHub Issues

3. **Ask Community**:
   - Open GitHub Issue
   - Stack Overflow
   - Discord (coming soon)

4. **Provide Details**:
   - Error messages
   - Screenshots
   - Steps to reproduce
   - Environment (OS, browser, versions)

---

**Still having issues? Open an issue on GitHub!**
