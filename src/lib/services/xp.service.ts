import { db } from '@/firebase/client';
import { XP_MULTIPLIERS, LEVEL_FORMULA } from '@/lib/xp';
import { Interview, Badge, Achievement } from '@/types';
import { doc, runTransaction } from 'firebase/firestore';

export class XPService {
  private static instance: XPService;
  private constructor() {}

  public static getInstance(): XPService {
    if (!XPService.instance) {
      XPService.instance = new XPService();
    }
    return XPService.instance;
  }

  async calculateAndUpdateXP(
    userId: string,
    interviews: Interview[],
    badges: Badge[],
    achievements: Achievement[],
    streak: number
  ): Promise<number> {
    const userRef = doc(db, 'users', userId);
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        return await runTransaction(db, async (transaction) => {
          const userDoc = await transaction.get(userRef);
          const currentXP = userDoc.data()?.experiencePoints || 0;

          // Calculate new XP
          const newXP = this.calculateXP(
            interviews,
            badges,
            achievements,
            streak
          );

          if (newXP !== currentXP) {
            transaction.update(userRef, { experiencePoints: newXP });
          }

          return newXP;
        });
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && 
            error.code === 'FAILED_PRECONDITION' && retryCount < maxRetries - 1) {
          retryCount++;
          console.log(`Retry attempt ${retryCount} due to version conflict`);
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
          continue;
        }
        console.error('Error updating XP:', error);
        throw error;
      }
    }

    throw new Error('Failed to update XP after maximum retries');
  }

  public calculateXP(
    interviews: Interview[],
    badges: Badge[],
    achievements: Achievement[],
    streak: number
  ): number {
    const completedInterviews = interviews.filter(
      (i) => i.feedbacks?.length
    ).length;
    const perfectScores = interviews.filter((i) =>
      i.feedbacks?.every((f) => f.totalScore === 100)
    ).length;
    const highScores = interviews.filter((i) =>
      i.feedbacks?.every((f) => f.totalScore >= 90)
    ).length;
    const completedAchievements = achievements.filter((a) => a.progress).length;

    return (
      completedInterviews * XP_MULTIPLIERS.INTERVIEW_COMPLETION +
      perfectScores * XP_MULTIPLIERS.PERFECT_SCORE +
      highScores * XP_MULTIPLIERS.HIGH_SCORE +
      streak * XP_MULTIPLIERS.STREAK_DAY +
      completedAchievements * XP_MULTIPLIERS.ACHIEVEMENT_COMPLETION +
      badges.length * XP_MULTIPLIERS.BADGE_EARNED
    );
  }

  calculateLevel(xp: number): number {
    if (xp < LEVEL_FORMULA.BASE_XP) {
      return 1;
    }
    return Math.floor(
      1 +
        Math.log(xp / LEVEL_FORMULA.BASE_XP) /
          Math.log(LEVEL_FORMULA.SCALING_FACTOR)
    );
  }

  calculateXPToNextLevel(currentLevel: number): number {
    if (currentLevel < 1) {
      return LEVEL_FORMULA.BASE_XP;
    }
    // Calculate XP needed for the next level
    return Math.floor(
      LEVEL_FORMULA.BASE_XP *
        Math.pow(LEVEL_FORMULA.SCALING_FACTOR, currentLevel)
    );
  }

  calculateXPForLevel(level: number): number {
    if (level <= 1) {
      return 0;
    }
    // Calculate XP needed to reach this level
    return Math.floor(
      LEVEL_FORMULA.BASE_XP *
        Math.pow(LEVEL_FORMULA.SCALING_FACTOR, level - 1)
    );
  }
}
