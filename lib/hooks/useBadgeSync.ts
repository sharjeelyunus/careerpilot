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

    const newlyEarnedBadges = progress.badges
      .filter((badge) => !user.badges?.some((b) => b.id === badge.id))
      .map((b) => ({
        id: b.id,
        earnedAt: new Date().toISOString(),
      }));

    const shouldUpdate =
      newlyEarnedBadges.length > 0 ||
      user.experiencePoints !== progress.experiencePoints;

    if (shouldUpdate) {
      updateUserProfile({
        ...user,
        badges: [...(user.badges || []), ...newlyEarnedBadges] as Badge[],
        experiencePoints: progress.experiencePoints,
      }).then(() => {
        mutate('current-user');
        mutate('leaderboard');
        window.dispatchEvent(new CustomEvent('experience-updated'));
        setHasSynced(true);
      });
    } else {
      setHasSynced(true);
    }
  }, [user, userInterviews, progress, hasSynced]);
}
