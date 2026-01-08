import { QueueEntry, ExerciseType, Match, MatchStatus } from '@fitness-duel/shared';
import { v4 as uuidv4 } from 'uuid';
import { getExerciseByType } from '@fitness-duel/shared';

class QueueManager {
  private queues: Map<ExerciseType, QueueEntry[]> = new Map();
  
  constructor() {
    // Initialize queues for all exercise types
    Object.values(ExerciseType).forEach(type => {
      this.queues.set(type, []);
    });
  }
  
  addToQueue(entry: QueueEntry): void {
    const queue = this.queues.get(entry.exerciseType);
    if (!queue) {
      throw new Error('Invalid exercise type');
    }
    
    // Remove existing entry if user is already in queue
    this.removeFromQueue(entry.socketId);
    
    queue.push(entry);
    console.log(`Added ${entry.username} to ${entry.exerciseType} queue. Queue size: ${queue.length}`);
  }
  
  removeFromQueue(socketId: string): void {
    this.queues.forEach((queue, type) => {
      const index = queue.findIndex(entry => entry.socketId === socketId);
      if (index !== -1) {
        const removed = queue.splice(index, 1)[0];
        console.log(`Removed ${removed.username} from ${type} queue`);
      }
    });
  }
  
  tryMatch(exerciseType: ExerciseType): Match | null {
    const queue = this.queues.get(exerciseType);
    if (!queue || queue.length < 2) {
      return null;
    }
    
    // Take first two players
    const player1Entry = queue.shift()!;
    const player2Entry = queue.shift()!;
    
    const exercise = getExerciseByType(exerciseType);
    if (!exercise) {
      throw new Error('Invalid exercise');
    }
    
    const match: Match = {
      id: uuidv4(),
      exerciseType,
      player1: {
        userId: player1Entry.userId,
        socketId: player1Entry.socketId,
        username: player1Entry.username,
        avatar: player1Entry.avatar,
        ready: false
      },
      player2: {
        userId: player2Entry.userId,
        socketId: player2Entry.socketId,
        username: player2Entry.username,
        avatar: player2Entry.avatar,
        ready: false
      },
      status: MatchStatus.WAITING,
      duration: exercise.duration,
      createdAt: new Date()
    };
    
    return match;
  }
  
  getQueuePosition(socketId: string, exerciseType: ExerciseType): number {
    const queue = this.queues.get(exerciseType);
    if (!queue) return -1;
    
    const index = queue.findIndex(entry => entry.socketId === socketId);
    return index + 1; // 1-indexed position
  }
  
  getQueueStats() {
    const stats: Record<string, number> = {};
    this.queues.forEach((queue, type) => {
      stats[type] = queue.length;
    });
    return stats;
  }
}

export const queueManager = new QueueManager();
