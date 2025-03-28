import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { updateUserProfile } from '@/lib/actions/general.action';
import { User, Badge, UserProgress, Interview } from '@/types';

interface UseBadgeSyncProps {
  user: User | undefined;
  progress: UserProgress;
  userInterviews: Interview[] | undefined;
}

export function useBadgeSync({
  user,
  progress,
  userInterviews,
}: UseBadgeSyncProps) {
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    if (!user || !userInterviews || hasSynced) return;

    const newlyEarnedBadges = progress.badges.map((b) => ({
      id: b.id,
      earnedAt: new Date().toISOString(),
    }));

    const shouldUpdate =
      newlyEarnedBadges.length != user.badges?.length ||
      user.experiencePoints !== progress.experiencePoints;

    if (shouldUpdate) {
      updateUserProfile({
        ...user,
        badges: [...(user.badges || []), ...newlyEarnedBadges] as Badge[],
        experiencePoints: progress.experiencePoints,
      }).then(() => {
        mutate('current-user');
        setHasSynced(true);
      });
    } else {
      setHasSynced(true);
    }
  }, [user, userInterviews, progress, hasSynced]);
}
