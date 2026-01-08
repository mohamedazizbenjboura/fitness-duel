import { Match, MatchStatus } from '@fitness-duel/shared';

class MatchManager {
  private matches: Map<string, Match> = new Map();
  
  createMatch(match: Match): void {
    this.matches.set(match.id, match);
    console.log(`Match created: ${match.id}`);
  }
  
  getMatch(matchId: string): Match | undefined {
    return this.matches.get(matchId);
  }
  
  updateMatchStatus(matchId: string, status: MatchStatus): void {
    const match = this.matches.get(matchId);
    if (match) {
      match.status = status;
      
      if (status === 'in-progress' && !match.startTime) {
        match.startTime = new Date();
      }
      
      if (status === 'completed' && !match.endTime) {
        match.endTime = new Date();
      }
      
      console.log(`Match ${matchId} status updated to: ${status}`);
    }
  }
  
  updatePlayerResult(matchId: string, userId: string, result: { reps?: number; time?: number }): void {
    const match = this.matches.get(matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    
    if (match.player1.userId === userId) {
      match.player1.reps = result.reps;
    } else if (match.player2.userId === userId) {
      match.player2.reps = result.reps;
    } else {
      throw new Error('User not in this match');
    }
  }
  
  getActiveMatches(): Match[] {
    return Array.from(this.matches.values()).filter(
      match => match.status !== MatchStatus.COMPLETED && match.status !== MatchStatus.CANCELLED
    );
  }
  
  deleteMatch(matchId: string): void {
    this.matches.delete(matchId);
  }
  
  // Clean up old completed matches (call periodically)
  cleanupOldMatches(maxAgeHours: number = 24): void {
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;
    
    this.matches.forEach((match, id) => {
      if (match.status === MatchStatus.COMPLETED && match.endTime) {
        const age = now - match.endTime.getTime();
        if (age > maxAge) {
          this.matches.delete(id);
        }
      }
    });
  }
}

export const matchManager = new MatchManager();

// Clean up old matches every hour
setInterval(() => {
  matchManager.cleanupOldMatches(24);
}, 60 * 60 * 1000);
