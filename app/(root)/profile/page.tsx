'use client';

import React, { useState } from 'react';
import { UserProfileCard } from '@/components/UserProfileCard';
import { UserProgressCard } from '@/components/UserProgressCard';
import { EditProfileModal } from '@/components/EditProfileModal';
import { User } from '@/types';
import { getCurrentUser } from '@/lib/actions/auth.action';
import useSWR, { mutate } from 'swr';
import {
  getInterviewByUserId,
  updateUserProfile,
} from '@/lib/actions/general.action';
import { calculateUserProgress } from '@/lib/utils';
import { useBadgeSync } from '@/lib/hooks/useBadgeSync';

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: user } = useSWR('current-user', getCurrentUser);
  const { data: userInterviews } = useSWR(
    user?.id ? ['interviews-by-user', user.id] : null,
    () => getInterviewByUserId(user?.id ?? '')
  );

  const progress = calculateUserProgress(user as User, userInterviews);

  useBadgeSync({ user: user as User, progress, userInterviews });

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
