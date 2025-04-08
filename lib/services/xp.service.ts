import { db } from '@/firebase/client';
import { XP_MULTIPLIERS, LEVEL_FORMULA } from '@/lib/xp';
import { Interview, Badge, Achievement } from '@/types';
import { doc, runTransaction } from 'firebase/firestore';

export class XPService {
  private static instance: XPService;
  private constructor() {}

  static getInstance(): XPService {
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

        // Only update if there's a significant change
        if (Math.abs(newXP - currentXP) > 10) {
          transaction.update(userRef, { experiencePoints: newXP });
        }

        return newXP;
      });
    } catch (error) {
      console.error('Error updating XP:', error);
      throw error;
    }
  }

  private calculateXP(
    interviews: Interview[],
    badges: Badge[],
    achievements: Achievement[],
    streak: number
  ): number {
    const completedInterviews = interviews.filter((i) => i.feedback).length;
    const perfectScores = interviews.filter(
      (i) => i.feedback?.totalScore === 100
    ).length;
    const highScores = interviews.filter(
      (i) => (i.feedback?.totalScore || 0) >= 90
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
    return Math.floor(
      1 +
        Math.log(xp / LEVEL_FORMULA.BASE_XP) /
          Math.log(LEVEL_FORMULA.SCALING_FACTOR)
    );
  }

  calculateXPToNextLevel(currentLevel: number): number {
    return Math.floor(
      LEVEL_FORMULA.BASE_XP *
        Math.pow(LEVEL_FORMULA.SCALING_FACTOR, currentLevel - 1)
    );
  }
}
