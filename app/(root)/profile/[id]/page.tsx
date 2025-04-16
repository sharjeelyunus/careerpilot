'use client';

import React, { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Optimize SWR configuration to reduce unnecessary fetches
  const {
    data: user,
    isLoading: userIsLoading,
    mutate: mutateUser,
  } = useSWR(['user-by-id', id], () => getUserById(id as string), {
    refreshInterval: 60000, // Refresh every 60 seconds
    revalidateOnFocus: false,
    revalidateOnMount: true,
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
    keepPreviousData: true,
  });

  const {
    data: userInterviews,
    isLoading: userInterviewsIsLoading,
    mutate: mutateInterviews,
  } = useSWR(
    user?.id ? ['interviews-by-user', user.id] : null,
    () => getInterviewByUserId(user?.id ?? '', 1, 10000),
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
      keepPreviousData: true,
    }
  );

  const progress = calculateUserProgress(
    user as User,
    userInterviews?.interviews ?? []
  );

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

  if (userIsLoading || userInterviewsIsLoading) {
    return (
      <div className='container mx-auto py-8 space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* UserProfileCard Skeleton */}
          <div className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='w-full'
            >
              <div className='w-full overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300/80 to-dark-200/80 border border-primary-200/20 shadow-xl shadow-primary-200/5'>
                <div className='relative'>
                  {/* Background elements */}
                  <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
                  <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-2xl' />
                  <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/10 to-transparent blur-2xl' />

                  {/* Header with gradient background */}
                  <div className='relative h-32 bg-gradient-to-br from-dark-400 to-dark-300'>
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
                    <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-xl' />

                    {/* Avatar */}
                    <div className='absolute -bottom-12 left-6 z-20'>
                      <Skeleton className='h-24 w-24 rounded-full' />
                    </div>
                  </div>

                  {/* User info */}
                  <div className='relative pt-16 px-6 pb-4 z-20'>
                    <Skeleton className='h-8 w-48 mb-2' />
                    <div className='flex flex-col gap-1 mt-2'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-40' />
                    </div>
                  </div>
                </div>

                <div className='relative z-10 pt-6 px-6 pb-8'>
                  <div className='mb-6 bg-dark-300/30 p-4 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
                    <Skeleton className='h-6 w-24 mb-2' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                  </div>

                  <div className='mb-6'>
                    <Skeleton className='h-6 w-24 mb-2' />
                    <div className='flex flex-wrap gap-2'>
                      {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} className='h-6 w-20' />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* UserProgressCard Skeleton */}
          <div className='lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='w-full'
            >
              <div className='w-full overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300/80 to-dark-200/80 border border-primary-200/20 shadow-xl shadow-primary-200/5'>
                <div className='relative'>
                  {/* Background elements */}
                  <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
                  <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-2xl' />
                  <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/10 to-transparent blur-2xl' />

                  {/* Header */}
                  <div className='relative z-10 flex flex-row items-center space-y-0 pb-2 pt-6 px-6'>
                    <div className='flex items-center space-x-2'>
                      <Skeleton className='h-9 w-9 rounded-full' />
                      <Skeleton className='h-6 w-32' />
                    </div>
                  </div>
                </div>

                <div className='relative z-10 px-6 pb-8'>
                  <div className='space-y-6'>
                    {/* Level Progress */}
                    <div className='bg-dark-300/30 p-5 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-2'>
                          <Skeleton className='h-7 w-7 rounded-full' />
                          <Skeleton className='h-5 w-24' />
                        </div>
                        <div className='flex flex-col items-end'>
                          <Skeleton className='h-5 w-16 mb-1' />
                          <Skeleton className='h-4 w-32' />
                        </div>
                      </div>
                      <Skeleton className='h-2.5 w-full rounded-full' />
                    </div>

                    {/* Stats Grid */}
                    <div className='grid grid-cols-3 gap-4'>
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className='flex flex-col items-center bg-dark-200/50 p-3 rounded-xl border border-primary-200/10'>
                          <Skeleton className='h-9 w-9 rounded-full mb-2' />
                          <Skeleton className='h-6 w-12 mb-1' />
                          <Skeleton className='h-4 w-16' />
                        </div>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div className='bg-dark-300/30 p-5 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
                      <Skeleton className='h-6 w-32 mb-3' />
                      <div className='grid grid-cols-1 gap-3'>
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className='group flex flex-col space-y-2 bg-dark-200/50 p-4 rounded-xl border border-primary-200/10'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <Skeleton className='h-8 w-8 rounded-full' />
                                <div>
                                  <Skeleton className='h-4 w-32 mb-1' />
                                  <Skeleton className='h-3 w-48' />
                                </div>
                              </div>
                              <div className='flex items-center space-x-2'>
                                <Skeleton className='h-4 w-16' />
                                <Skeleton className='h-4 w-4' />
                              </div>
                            </div>
                            <Skeleton className='h-1.5 w-full rounded-full' />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className='bg-dark-300/30 p-5 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
                      <Skeleton className='h-6 w-32 mb-3' />
                      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                        {[...Array(6)].map((_, index) => (
                          <div key={index} className='group relative flex flex-col items-center p-4 rounded-xl border border-primary-200/20 bg-gradient-to-b from-dark-200/50 to-dark-300/50'>
                            <div className='relative z-10 flex flex-col items-center space-y-2'>
                              <Skeleton className='h-12 w-12 rounded-full' />
                              <div className='text-center'>
                                <Skeleton className='h-4 w-24 mb-1' />
                                <Skeleton className='h-3 w-32' />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

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
