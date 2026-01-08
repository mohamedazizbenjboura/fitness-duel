# 📱 Mobile App Setup (React Native + Expo)

Cross-platform mobile app for Fitness Duel built with React Native and Expo.

## Features

- **Native Mobile Experience**: iOS and Android support
- **Camera Integration**: Expo Camera for workout recording
- **Live Video**: WebRTC for real-time streaming
- **Push Notifications**: Match notifications (future)
- **Offline Support**: Queue offline actions (future)

## Prerequisites

- Node.js 18+ and npm 9+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)
- For iOS: Xcode (Mac only)
- For Android: Android Studio

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3001
EXPO_PUBLIC_WS_URL=ws://192.168.1.100:3001
```

**Important**: Replace `192.168.1.100` with your computer's local IP address.

### Find Your Local IP:

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your network adapter
```

**Mac/Linux:**
```bash
ifconfig
# Look for "inet" under your network adapter
```

## Development

### Start Expo Dev Server
```bash
npm start
```

### Run on iOS Simulator (Mac only)
```bash
npm run ios
```

### Run on Android Emulator
```bash
npm run android
```

### Run on Physical Device

1. Install **Expo Go** app from App Store/Play Store
2. Run `npm start`
3. Scan QR code with your phone
4. Make sure phone and computer are on same WiFi network

## Project Structure

```
mobile/
├── App.tsx                    # Main app component
├── app.json                   # Expo configuration
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Username entry
│   │   ├── LobbyScreen.tsx    # Exercise selection
│   │   └── MatchScreen.tsx    # Live duel
│   └── stores/
│       ├── userStore.ts       # User state
│       └── socketStore.ts     # Socket connection
```

## Key Dependencies

- **Expo**: Development platform
- **React Native**: Mobile framework
- **Expo Camera**: Camera access
- **Expo AV**: Video playback
- **React Navigation**: Screen navigation
- **Socket.io-client**: Real-time communication
- **Zustand**: State management

## Permissions Required

The app requires:
- **Camera**: To record workout videos
- **Microphone**: For voice chat
- **Internet**: For real-time communication

Permissions are requested automatically when needed.

## Building for Production

### iOS (requires Mac + Apple Developer Account)

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## Testing on Real Device

1. Ensure backend server is running
2. Update `.env` with your local IP
3. Connect phone to same WiFi as computer
4. Open Expo Go app
5. Scan QR code from terminal

## Common Issues

### Cannot connect to server
- Verify phone and computer on same WiFi
- Check firewall settings
- Ensure backend is running
- Verify IP address in `.env`

### Camera not working
- Grant camera permissions
- Restart app
- Check device camera functionality

### WebRTC not connecting
- Use physical device (simulators have limited WebRTC)
- Check network connectivity
- Ensure STUN servers are accessible

## Future Enhancements

- Offline mode
- Push notifications
- Background recording
- Video editing
- Social features
- Achievements
