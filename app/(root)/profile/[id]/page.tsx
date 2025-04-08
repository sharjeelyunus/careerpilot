'use client';

import React, { useState, useEffect } from 'react';
import { UserProfileCard } from '@/components/UserProfileCard';
import { UserProgressCard } from '@/components/UserProgressCard';
import { EditProfileModal } from '@/components/EditProfileModal';
import { User, UserProgress } from '@/types';
import { getUserById } from '@/lib/actions/auth.action';
import useSWR from 'swr';
import {
  getInterviewByUserId,
  updateUserProfile,
} from '@/lib/actions/general.action';
import { calculateUserProgress } from '@/lib/utils';
import { useBadgeSync } from '@/lib/hooks/useBadgeSync';
import { useParams } from 'next/navigation';
import SpinnerLoader from '@/components/ui/loader';

export default function ProfilePage() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Optimize SWR configuration to reduce unnecessary fetches
  const {
    data: user,
    isLoading: userIsLoading,
    mutate: mutateUser,
  } = useSWR(['user-by-id', id], () => getUserById(id as string), {
    refreshInterval: 30000, // Refresh every 30 seconds instead of 5
    revalidateOnFocus: false, // Don't revalidate on focus
    revalidateOnMount: true,
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
    keepPreviousData: true, // Keep showing old data while fetching
  });

  const {
    data: userInterviews,
    isLoading: userInterviewsIsLoading,
    mutate: mutateInterviews,
  } = useSWR(
    user?.id ? ['interviews-by-user', user.id] : null,
    () => getInterviewByUserId(user?.id ?? '', 1, 10000),
    {
      refreshInterval: 30000, // Refresh every 30 seconds instead of 5
      revalidateOnFocus: false, // Don't revalidate on focus
      revalidateOnMount: true,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
      keepPreviousData: true, // Keep showing old data while fetching
    }
  );

  const progress = calculateUserProgress(
    user as User,
    userInterviews?.interviews ?? []
  );

  // Only force refresh on mount
  useEffect(() => {
    mutateUser();
    if (user?.id) {
      mutateInterviews();
    }
  }, [mutateUser, mutateInterviews, user?.id]);

  useBadgeSync({
    user: user as User,
    progress: progress as UserProgress,
    userInterviews: userInterviews?.interviews ?? [],
    achievements: progress.achievements,
    streak: progress.streak,
  });

  const handleProfileEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleProfileSave = async (updatedProfile: User) => {
    await updateUserProfile(updatedProfile);
    await Promise.all([mutateUser(), mutateInterviews()]);
  };

  if (userIsLoading || userInterviewsIsLoading) return <SpinnerLoader />;

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-1'>
          <UserProfileCard
            profile={user as User}
            progress={progress}
            onEdit={handleProfileEdit}
          />
        </div>
        <div className='lg:col-span-2'>
          <UserProgressCard progress={progress} />
        </div>
      </div>

      <EditProfileModal
        profile={user as User}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProfileSave}
      />
    </div>
  );
}
