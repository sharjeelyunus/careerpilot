import { useEffect, useState, useCallback } from 'react';
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

  const syncBadges = useCallback(async () => {
    if (!user || !userInterviews || hasSynced) return;
    
    // Only get newly earned badges that the user doesn't already have
    const existingBadgeIds = new Set(user.badges?.map((b) => b.id) || []);
    const newlyEarnedBadges = progress.badges
      .filter((badge) => !existingBadgeIds.has(badge.id))
      .map((b) => ({
        id: b.id,
        earnedAt: new Date().toISOString(),
      }));

    if (newlyEarnedBadges.length === 0) return;

    // Update XP and badges in a single transaction
    await xpService.calculateAndUpdateXP(
      user.id,
      userInterviews,
      [...(user.badges || []), ...newlyEarnedBadges] as Badge[],
      achievements,
      streak
    );

    // Only mutate the necessary data
    await Promise.all([
      mutate(['user-by-id', user.id]),
      mutate('leaderboard'),
    ]);
    
    setHasSynced(true);
  }, [user, userInterviews, progress, achievements, streak, hasSynced]);

  useEffect(() => {
    const timeoutId = setTimeout(syncBadges, 1000); // Debounce for 1 second
    return () => clearTimeout(timeoutId);
  }, [syncBadges]);
}
