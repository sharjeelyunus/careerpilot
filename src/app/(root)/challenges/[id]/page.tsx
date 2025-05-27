'use client';

import { getChallengeById } from '@/lib/actions/technicalChallenges.action';
import { ChallengeDetails } from '@/components/ChallengeDetails';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import SpinnerLoader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '@/lib/actions/auth.action';

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: user, isLoading: userLoading } = useSWR(
    'current-user',
    getCurrentUser
  );
  const { data: challenge, isLoading: challengeLoading } = useSWR(
    user?.id ? ['challenge', id, user.id] : null,
    () => (user?.id ? getChallengeById(id, user.id) : null)
  );

  const handleBack = () => {
    router.back();
  };

  if (userLoading || challengeLoading) return <SpinnerLoader />;

  if (!user?.id) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center justify-center min-h-[60vh] bg-dark-200/30 rounded-2xl border border-primary-200/10'>
          <p className='text-lg text-light-100/70'>
            Please sign in to view challenges
          </p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Button
          onClick={handleBack}
          variant='ghost'
          className='mb-6 hover:bg-primary-200/10'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Challenges
        </Button>
        <div className='flex items-center justify-center min-h-[60vh] bg-dark-200/30 rounded-2xl border border-primary-200/10'>
          <p className='text-lg text-light-100/70'>Challenge not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <Button
              onClick={handleBack}
              variant='ghost'
              className='hover:bg-primary-200/10'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Challenges
            </Button>
          </div>
        </div>
        <ChallengeDetails challenge={challenge} />
      </motion.div>
    </div>
  );
}
