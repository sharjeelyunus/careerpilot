'use client';

import React, { useEffect, useState } from 'react';
import { UserProfileCard } from '@/components/UserProfileCard';
import { UserProgressCard } from '@/components/UserProgressCard';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Badge, User, UserProgress } from '@/types';
import { getCurrentUser } from '@/lib/actions/auth.action';
import useSWR, { mutate } from 'swr';
import {
  getInterviewByUserId,
  updateUserProfile,
} from '@/lib/actions/general.action';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { ACHIEVEMENTS } from '@/constants/achievemnts';
import { BADGES } from '@/constants/badges';

dayjs.extend(isSameOrAfter);

export default function ProfilePage() {
  const [hasSyncedRewards, setHasSyncedRewards] = useState(false);

  const { data: user } = useSWR('current-user', getCurrentUser);
  const { data: userInterviews } = useSWR(
    user?.id ? ['interviews-by-user', user.id] : null,
    () => getInterviewByUserId(user?.id ?? '')
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const completedInterviews =
    userInterviews?.filter((interview) => interview.feedback).length || 0;
  const totalScore =
    userInterviews?.reduce((acc, interview) => {
      return acc + (interview.feedback?.totalScore || 0);
    }, 0) || 0;

  const streak = (() => {
    if (!userInterviews || userInterviews.length === 0) return 0;

    const completedInterviews = userInterviews
      .filter((interview) => interview.feedback && interview.createdAt)
      .map((interview) => ({
        ...interview,
        date: dayjs(interview.createdAt),
      }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());

    let streakCount = 0;
    let currentDate = dayjs();

    for (const interview of completedInterviews) {
      if (interview.date.isSame(currentDate, 'day')) {
        streakCount++;
        currentDate = currentDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    return streakCount;
  })();

  const achievements = ACHIEVEMENTS.map((achievement) => {
    const progress = achievement.getProgress(
      completedInterviews,
      userInterviews ?? []
    );
    const completed = achievement.isCompleted(
      completedInterviews,
      userInterviews ?? []
    );

    return {
      ...achievement,
      progress,
      completed,
    };
  });

  const badges =
    user?.badges && user.badges.length > 0
      ? BADGES.filter((badge) => user.badges.some((b) => b.id === badge.id))
      : achievements
          .filter((a) => a.completed)
          .map((achievement) => {
            const matchedBadge = BADGES.find(
              (badge) =>
                badge.name === achievement.name ||
                badge.type === achievement.type
            );
            if (!matchedBadge) return null;

            return {
              ...matchedBadge,
            };
          })
          .filter(Boolean);

  const experiencePoints =
    completedInterviews * 100 +
    streak * 100 +
    badges.reduce((acc) => acc + 100, 0);

  const level = 1 + Math.floor(experiencePoints / 1000);

  useEffect(() => {
    if (!user || !userInterviews || hasSyncedRewards) return;

    const alreadyBadged = new Set((user.badges || []).map((b) => b.id));

    const newlyEarnedBadges = achievements
      .filter((a) => a.completed)
      .map((achievement) =>
        BADGES.find(
          (badge) =>
            badge.name === achievement.name || badge.type === achievement.type
        )
      )
      .filter(
        (b): b is (typeof BADGES)[number] => !!b && !alreadyBadged.has(b.id)
      )
      .map((b) => ({
        id: b.id,
        earnedAt: new Date().toISOString(),
      }));

    if (
      newlyEarnedBadges.length > 0 ||
      user.experiencePoints !== experiencePoints
    ) {
      updateUserProfile({
        ...user,
        badges: [...(user.badges || []), ...newlyEarnedBadges] as Badge[],
        experiencePoints,
      }).then(() => {
        mutate('current-user');
        setHasSyncedRewards(true);
      });
    } else {
      setHasSyncedRewards(true);
    }
  }, [achievements, user, userInterviews, hasSyncedRewards, experiencePoints]);

  const progress = {
    userId: user?.id ?? '',
    totalInterviews: userInterviews?.length,
    completedInterviews: completedInterviews,
    averageScore: userInterviews?.length
      ? totalScore / userInterviews.length
      : 0,
    streak: streak,
    badges,
    achievements:
      achievements?.filter((a) => !a.completed && a.progress > 0) ?? [],
    level,
    experiencePoints: user?.experiencePoints ?? experiencePoints ?? 0,
  } as unknown as UserProgress;

  const handleProfileEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleProfileSave = async (updatedProfile: User) => {
    await updateUserProfile(updatedProfile);
    await mutate('current-user');
  };

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <UserProfileCard
        profile={user as User}
        progress={progress}
        onEdit={handleProfileEdit}
      />

      <UserProgressCard progress={progress} />

      <EditProfileModal
        profile={user as User}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProfileSave}
      />
    </div>
  );
}
