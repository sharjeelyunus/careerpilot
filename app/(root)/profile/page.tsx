'use client';

import React, { useState } from 'react';
import { UserProfileCard } from '@/components/UserProfileCard';
import { UserProgressCard } from '@/components/UserProgressCard';
import { EditProfileModal } from '@/components/EditProfileModal';
import { User, UserProgress } from '@/types';
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
  const { data: profile } = useSWR('current-user', getCurrentUser);
  const { data: userInterviews } = useSWR(
    profile?.id ? ['interviews-by-user', profile.id] : null,
    () => getInterviewByUserId(profile?.id ?? '')
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

  const experiencePoints = completedInterviews * 100 + streak * 100;
  const level = 1 + Math.floor(experiencePoints / 1000);

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

  const badges = achievements
    .filter((a) => a.completed)
    .map((achievement) => {
      const matchedBadge = BADGES.find(
        (badge) =>
          badge.name === achievement.name || badge.type === achievement.type
      );
      if (!matchedBadge) return null;

      return {
        ...matchedBadge,
      };
    })
    .filter(Boolean);

  const progress = {
    userId: profile?.id ?? '',
    totalInterviews: userInterviews?.length,
    completedInterviews: completedInterviews,
    averageScore: userInterviews?.length
      ? totalScore / userInterviews.length
      : 0,
    streak: streak,
    badges,
    achievements: achievements.filter((a) => !a.completed && a.progress > 0),
    level,
    experiencePoints,
  } as UserProgress;

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
        profile={profile as User}
        progress={progress}
        onEdit={handleProfileEdit}
      />

      <UserProgressCard progress={progress} />

      <EditProfileModal
        profile={profile as User}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProfileSave}
      />
    </div>
  );
}
