'use client';

import React, { useState, useEffect } from 'react';
import { UserProfileCard } from '@/components/UserProfileCard';
import { UserProgressCard } from '@/components/UserProgressCard';
import { EditProfileModal } from '@/components/EditProfileModal';
import { User } from '@/types';
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

  // Use more aggressive refresh settings
  const { data: user, isLoading: userIsLoading, mutate: mutateUser } = useSWR(
    ['user-by-id', id],
    () => getUserById(id as string),
    {
      refreshInterval: 5000, // Refresh every 5 seconds
      revalidateOnFocus: true, // Revalidate when the page regains focus
      revalidateOnMount: true, // Always revalidate on mount
      dedupingInterval: 0, // Don't dedupe requests
    }
  );
  
  const { data: userInterviews, isLoading: userInterviewsIsLoading, mutate: mutateInterviews } = useSWR(
    user?.id ? ['interviews-by-user', user.id] : null,
    () => getInterviewByUserId(user?.id ?? '', 1, 10000),
    {
      refreshInterval: 5000, // Refresh every 5 seconds
      revalidateOnFocus: true, // Revalidate when the page regains focus
      revalidateOnMount: true, // Always revalidate on mount
      dedupingInterval: 0, // Don't dedupe requests
    }
  );

  const progress = calculateUserProgress(
    user as User,
    userInterviews?.interviews ?? []
  );

  // Force a refresh of user data when the component mounts
  useEffect(() => {
    mutateUser();
    if (user?.id) {
      mutateInterviews();
    }
  }, [mutateUser, mutateInterviews, user?.id]);

  useBadgeSync({
    user: user as User,
    progress,
    userInterviews: userInterviews?.interviews ?? [],
  });

  const handleProfileEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleProfileSave = async (updatedProfile: User) => {
    await updateUserProfile(updatedProfile);
    await mutateUser();
    await mutateInterviews();
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
