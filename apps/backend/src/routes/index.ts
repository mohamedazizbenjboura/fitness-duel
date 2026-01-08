import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { EXERCISES } from '@fitness-duel/shared';
import { matchManager } from '../services/MatchManager';
import { queueManager } from '../services/QueueManager';

const router = Router();

// Get all exercises
router.get('/exercises', (req, res) => {
  res.json({
    success: true,
    data: EXERCISES
  });
});

// Get queue status
router.get('/queue/status', (req, res) => {
  const stats = queueManager.getQueueStats();
  res.json({
    success: true,
    data: stats
  });
});

// Get active matches
router.get('/matches/active', (req, res) => {
  const matches = matchManager.getActiveMatches();
  res.json({
    success: true,
    data: matches
  });
});

// Get match by ID
router.get('/matches/:matchId', (req, res) => {
  const { matchId } = req.params;
  const match = matchManager.getMatch(matchId);
  
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found'
    });
  }
  
  res.json({
    success: true,
    data: match
  });
});

// Submit match result
router.post('/matches/:matchId/result', (req, res) => {
  const { matchId } = req.params;
  const { userId, reps, time } = req.body;
  
  try {
    matchManager.updatePlayerResult(matchId, userId, { reps, time });
    res.json({
      success: true,
      message: 'Result submitted'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get leaderboard (mock for now)
router.get('/leaderboard', (req, res) => {
  // TODO: Implement database integration
  const mockLeaderboard = {
    entries: [
      {
        rank: 1,
        userId: '1',
        username: 'FitnessBeast',
        wins: 45,
        totalMatches: 50,
        winRate: 90,
        streak: 5
      },
      {
        rank: 2,
        userId: '2',
        username: 'IronWarrior',
        wins: 38,
        totalMatches: 45,
        winRate: 84,
        streak: 3
      }
    ],
    lastUpdated: new Date()
  };
  
  res.json({
    success: true,
    data: mockLeaderboard
  });
});

// Create user (temporary - for testing)
router.post('/users', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({
      success: false,
      error: 'Username is required'
    });
  }
  
  const user = {
    id: uuidv4(),
    username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    stats: {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      streak: 0
    },
    createdAt: new Date()
  };
  
  res.json({
    success: true,
    data: user
  });
});

export const apiRouter = router;
