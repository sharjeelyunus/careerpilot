import { useEffect, useState } from 'react';
import { User, Badge, Achievement, Interview, UserProgress } from '@/types';
import { XPService } from '@/lib/services/xp.service';
import { mutate } from 'swr';

interface UseBadgeSyncProps {
  user: User | undefined;
  progress: UserProgress;
  userInterviews: Interview[];
  achievements: Achievement[];
  streak: number;
}

export function useBadgeSync({
  user,
  progress,
  userInterviews,
  achievements,
  streak,
}: UseBadgeSyncProps) {
  const [hasSynced, setHasSynced] = useState(false);
  const xpService = XPService.getInstance();

  useEffect(() => {
    if (!user || !userInterviews || hasSynced) return;

    // Only get newly earned badges that the user doesn't already have
    const existingBadgeIds = new Set(user.badges?.map((b) => b.id) || []);
    const newlyEarnedBadges = progress.badges
      .filter((badge) => !existingBadgeIds.has(badge.id))
      .map((b) => ({
        id: b.id,
        earnedAt: new Date().toISOString(),
      }));

    // Only update if there are new badges
    if (newlyEarnedBadges.length > 0) {
      // Update XP and badges in a single transaction
      xpService
        .calculateAndUpdateXP(
          user.id,
          userInterviews,
          [...(user.badges || []), ...newlyEarnedBadges] as Badge[],
          achievements,
          streak
        )
        .then(() => {
          // Batch the mutations together
          Promise.all([
            mutate('current-user'),
            mutate('leaderboard'),
            mutate(['user-by-id', user.id]),
            mutate(['interviews-by-user', user.id]),
          ]).then(() => {
            window.dispatchEvent(new CustomEvent('experience-updated'));
            setHasSynced(true);
          });
        });
    } else {
      setHasSynced(true);
    }
  }, [user, userInterviews, progress, achievements, streak, hasSynced]);
}
