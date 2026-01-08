import { Exercise, ExerciseType, EXERCISES } from '.';

/**
 * Get exercise by type
 */
export function getExerciseByType(type: ExerciseType): Exercise | undefined {
  return EXERCISES.find(ex => ex.type === type);
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  const trimmed = username.trim();
  return trimmed.length >= 3 && trimmed.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

/**
 * Get avatar URL for user
 */
export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if two players have mutual agreement
 */
export function hasMutualAgreement(player1Vote?: string, player2Vote?: string): boolean {
  if (!player1Vote || !player2Vote) return false;
  return player1Vote === player2Vote;
}

/**
 * Get rank emoji
 */
export function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '🏅';
}

/**
 * Format large numbers (1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Get exercise emoji
 */
export function getExerciseEmoji(type: ExerciseType): string {
  const emojiMap: Record<ExerciseType, string> = {
    [ExerciseType.SQUATS]: '🦵',
    [ExerciseType.PUSH_UPS]: '💪',
    [ExerciseType.SIT_UPS]: '🔥',
    [ExerciseType.JUMPING_JACKS]: '⚡',
    [ExerciseType.BURPEES]: '🏃',
    [ExerciseType.PLANK]: '🧘',
    [ExerciseType.WALL_SIT]: '🪑'
  };
  return emojiMap[type] || '💪';
}
