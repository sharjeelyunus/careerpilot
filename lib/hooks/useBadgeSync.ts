import { useEffect, useState } from 'react';
import { User, UserProgress, Interview, Badge } from '@/types';
import { updateUserProfile } from '@/lib/actions/general.action';
import { mutate } from 'swr';

interface UseBadgeSyncProps {
  user: User | undefined;
  progress: UserProgress;
  userInterviews: Interview[];
}

export function useBadgeSync({
  user,
  progress,
  userInterviews,
}: UseBadgeSyncProps) {
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    if (!user || !userInterviews || hasSynced) return;

    // Only get newly earned badges that the user doesn't already have
    const existingBadgeIds = new Set(user.badges?.map(b => b.id) || []);
    const newlyEarnedBadges = progress.badges
      .filter(badge => !existingBadgeIds.has(badge.id))
      .map(b => ({
        id: b.id,
        earnedAt: new Date().toISOString(),
      }));

    // Only update if there are new badges or experience points have changed significantly
    const shouldUpdate =
      newlyEarnedBadges.length > 0 ||
      Math.abs(user.experiencePoints - progress.experiencePoints) > 10;

    if (shouldUpdate) {
      updateUserProfile({
        ...user,
        badges: [...(user.badges || []), ...newlyEarnedBadges] as Badge[],
        experiencePoints: progress.experiencePoints,
      }).then(() => {
        // Batch the mutations together
        Promise.all([
          mutate('current-user'),
          mutate('leaderboard'),
          mutate(['user-by-id', user.id]),
          mutate(['interviews-by-user', user.id])
        ]).then(() => {
          window.dispatchEvent(new CustomEvent('experience-updated'));
          setHasSynced(true);
        });
      });
    } else {
      setHasSynced(true);
    }
  }, [user, userInterviews, progress, hasSynced]);
}
