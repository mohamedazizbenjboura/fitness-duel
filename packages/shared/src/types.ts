// Exercise Types
export enum ExerciseType {
  SQUATS = 'squats',
  PUSH_UPS = 'push-ups',
  SIT_UPS = 'sit-ups',
  JUMPING_JACKS = 'jumping-jacks',
  BURPEES = 'burpees',
  PLANK = 'plank',
  WALL_SIT = 'wall-sit'
}

export enum ExerciseCategory {
  REP_BASED = 'rep-based',
  TIME_BASED = 'time-based'
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  category: ExerciseCategory;
  duration: number; // in seconds
  description: string;
  instructions: string[];
  videoUrl?: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  avatar?: string;
  stats: UserStats;
  createdAt: Date;
}

export interface UserStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  streak: number;
  rank?: number;
}

// Match Types
export enum MatchStatus {
  WAITING = 'waiting',
  COUNTDOWN = 'countdown',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  VOTING = 'voting',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Match {
  id: string;
  exerciseType: ExerciseType;
  player1: Player;
  player2: Player;
  status: MatchStatus;
  startTime?: Date;
  endTime?: Date;
  duration: number;
  winner?: string; // player ID
  createdAt: Date;
}

export interface Player {
  userId: string;
  socketId: string;
  username: string;
  avatar?: string;
  ready: boolean;
  vote?: string; // voted winner's userId
  reps?: number;
  recordingUrl?: string;
}

// Queue Types
export interface QueueEntry {
  userId: string;
  socketId: string;
  username: string;
  avatar?: string;
  exerciseType: ExerciseType;
  joinedAt: Date;
}

// WebRTC Signaling Types
export interface WebRTCSignal {
  from: string;
  to: string;
  signal: RTCSessionDescriptionInit | RTCIceCandidateInit;
  type: 'offer' | 'answer' | 'ice-candidate';
}

// Socket Event Types
export enum SocketEvent {
  // Queue events
  JOIN_QUEUE = 'join-queue',
  LEAVE_QUEUE = 'leave-queue',
  QUEUE_STATUS = 'queue-status',
  
  // Match events
  MATCH_FOUND = 'match-found',
  COUNTDOWN_START = 'countdown-start',
  DUEL_START = 'duel-start',
  DUEL_END = 'duel-end',
  MATCH_STATUS_UPDATE = 'match-status-update',
  
  // Voting events
  SELECT_WINNER = 'select-winner',
  WINNER_DECLARED = 'winner-declared',
  VOTE_UPDATE = 'vote-update',
  
  // WebRTC signaling
  WEBRTC_OFFER = 'webrtc-offer',
  WEBRTC_ANSWER = 'webrtc-answer',
  WEBRTC_ICE_CANDIDATE = 'webrtc-ice-candidate',
  
  // Voice chat
  VOICE_OFFER = 'voice-offer',
  VOICE_ANSWER = 'voice-answer',
  VOICE_ICE_CANDIDATE = 'voice-ice-candidate',
  
  // General
  ERROR = 'error',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MatchResult {
  matchId: string;
  winner: string;
  player1: {
    userId: string;
    reps?: number;
    time?: number;
  };
  player2: {
    userId: string;
    reps?: number;
    time?: number;
  };
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  wins: number;
  totalMatches: number;
  winRate: number;
  streak: number;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  userRank?: LeaderboardEntry;
  lastUpdated: Date;
}
