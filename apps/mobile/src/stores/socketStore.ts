import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  connect: (userId: string, username: string) => void;
  disconnect: () => void;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  
  connect: (userId: string, username: string) => {
    const socket = io(API_URL, {
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      socket.emit('identify', { userId, username });
      set({ isConnected: true });
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      set({ isConnected: false });
    });
    
    set({ socket });
  },
  
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  }
}));
