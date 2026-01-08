import { Exercise, ExerciseType, ExerciseCategory } from './types';

// Exercise definitions
export const EXERCISES: Exercise[] = [
  {
    id: 'squats',
    name: 'Squats',
    type: ExerciseType.SQUATS,
    category: ExerciseCategory.REP_BASED,
    duration: 60,
    description: 'Classic bodyweight squats - go low and count your reps!',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body by bending knees and hips',
      'Keep your back straight and chest up',
      'Go down until thighs are parallel to ground',
      'Push through heels to return to starting position'
    ]
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    type: ExerciseType.PUSH_UPS,
    category: ExerciseCategory.REP_BASED,
    duration: 60,
    description: 'Standard push-ups - chest to the ground!',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Keep your body in a straight line',
      'Lower your chest to the ground',
      'Push back up to starting position',
      'Maintain proper form throughout'
    ]
  },
  {
    id: 'sit-ups',
    name: 'Sit-ups',
    type: ExerciseType.SIT_UPS,
    category: ExerciseCategory.REP_BASED,
    duration: 60,
    description: 'Core crushing sit-ups!',
    instructions: [
      'Lie on your back with knees bent',
      'Place hands behind your head or across chest',
      'Lift your upper body toward your knees',
      'Lower back down with control',
      'Keep core engaged throughout'
    ]
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    type: ExerciseType.JUMPING_JACKS,
    category: ExerciseCategory.REP_BASED,
    duration: 60,
    description: 'Fast-paced jumping jacks to get your heart rate up!',
    instructions: [
      'Start with feet together, arms at sides',
      'Jump and spread feet wide',
      'Raise arms overhead',
      'Jump back to starting position',
      'Maintain a steady rhythm'
    ]
  },
  {
    id: 'burpees',
    name: 'Burpees',
    type: ExerciseType.BURPEES,
    category: ExerciseCategory.REP_BASED,
    duration: 90,
    description: 'Full-body burpees - the ultimate test!',
    instructions: [
      'Start standing, feet shoulder-width apart',
      'Drop into a squat and place hands on ground',
      'Jump feet back into plank position',
      'Do a push-up (optional but recommended)',
      'Jump feet back to squat',
      'Explosively jump up with arms overhead'
    ]
  },
  {
    id: 'plank',
    name: 'Plank Hold',
    type: ExerciseType.PLANK,
    category: ExerciseCategory.TIME_BASED,
    duration: 90,
    description: 'Hold that plank as long as you can!',
    instructions: [
      'Start in forearm plank position',
      'Keep body in straight line from head to heels',
      'Engage your core',
      'Hold position without sagging',
      'Breathe steadily'
    ]
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    type: ExerciseType.WALL_SIT,
    category: ExerciseCategory.TIME_BASED,
    duration: 90,
    description: 'Quad-burning wall sit challenge!',
    instructions: [
      'Stand with back against wall',
      'Slide down until thighs are parallel to ground',
      'Keep knees at 90-degree angle',
      'Press back firmly against wall',
      'Hold position and endure the burn'
    ]
  }
];

// Timing constants (in milliseconds)
export const TIMING = {
  COUNTDOWN_DURATION: 3000, // 3 seconds
  MATCH_TIMEOUT: 300000, // 5 minutes max per match
  QUEUE_TIMEOUT: 120000, // 2 minutes queue timeout
  RECONNECT_TIMEOUT: 30000, // 30 seconds to reconnect
  VOTE_TIMEOUT: 60000 // 1 minute to vote
};

// WebRTC configuration
export const WEBRTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10
};

// Video constraints
export const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: true
};

// Recording settings
export const RECORDING_CONFIG = {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 2500000, // 2.5 Mbps
  audioBitsPerSecond: 128000 // 128 kbps
};

// UI Constants
export const UI = {
  PIP_SIZE: {
    width: 180,
    height: 240
  },
  COLORS: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    success: '#95E1D3',
    warning: '#FFE66D',
    danger: '#FF6B6B',
    dark: '#1A1A2E',
    light: '#F7F7F7'
  }
};

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'Fitness Duel',
  VERSION: '1.0.0',
  MAX_USERNAME_LENGTH: 20,
  MIN_USERNAME_LENGTH: 3,
  DEFAULT_AVATAR: 'https://api.dicebear.com/7.x/avataaars/svg?seed=',
  SUPPORT_EMAIL: 'support@fitnessduel.com'
};
