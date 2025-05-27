// XP multipliers for different activities
export const XP_MULTIPLIERS = {
  INTERVIEW_COMPLETION: 100,
  PERFECT_SCORE: 200,
  HIGH_SCORE: 150,
  STREAK_DAY: 50,
  ACHIEVEMENT_COMPLETION: 300,
  BADGE_EARNED: 250,
  WEEKLY_ACTIVITY: 100,
} as const;

// Level progression formula
export const LEVEL_FORMULA = {
  BASE_XP: 1000,
  SCALING_FACTOR: 1.5,
} as const; 