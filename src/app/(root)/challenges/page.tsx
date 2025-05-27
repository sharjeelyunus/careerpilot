'use client';

import React from 'react';
import { TechnicalChallenges } from '@/components/TechnicalChallenges';
import { FEATURE_FLAGS } from '@/lib/config/featureFlags';
import { getCurrentUser } from '@/lib/actions/auth.action';
import useSWR from 'swr';
import SpinnerLoader from '@/components/ui/loader';

export default function ChallengesPage() {
  const { data: user, isLoading: userIsLoading } = useSWR(
    'current-user',
    getCurrentUser
  );
  if (!FEATURE_FLAGS.TECHNICAL_CHALLENGES) {
    return null;
  }

  if (userIsLoading) {
    return <SpinnerLoader />;
  }

  if (!user?.id) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
        <h2 className='text-2xl font-bold mb-4'>Access Denied</h2>
        <p className='text-light-100/70'>
          Please sign in to access technical challenges.
        </p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <TechnicalChallenges userId={user.id} />
    </div>
  );
}
