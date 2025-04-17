'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTechnicalChallengesStore } from '@/lib/store/technicalChallengesStore';
import {
  getTechnicalChallenges,
  generateTechnicalChallenge,
} from '@/lib/actions/technicalChallenges.action';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';
import { FEATURE_FLAGS } from '@/lib/config/featureFlags';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { getCurrentUser } from '@/lib/actions/auth.action';

interface TechnicalChallengesProps {
  userId: string;
}

export function TechnicalChallenges({ userId }: TechnicalChallengesProps) {
  const router = useRouter();
  const { data: user } = useSWR('current-user', getCurrentUser);
  const {
    challenges,
    filters,
    isLoading,
    error,
    setChallenges,
    setLoading,
    setError,
  } = useTechnicalChallengesStore();

  // Check if user has completed their profile
  const hasRequiredData = Boolean(
    user?.skills?.length && user?.experience && user?.preferredRoles?.length
  );

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!FEATURE_FLAGS.TECHNICAL_CHALLENGES) return;

      setLoading(true);
      try {
        const { challenges } = await getTechnicalChallenges(userId, filters);
        setChallenges(challenges);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to fetch challenges'
        );
        toast.error('Failed to load technical challenges');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [userId, filters, setChallenges, setLoading, setError, hasRequiredData]);

  const handleGenerateChallenge = async () => {
    if (!hasRequiredData) {
      toast.error(
        'Please complete your profile to generate technical challenges'
      );
      router.push(`/profile/${userId}`);
      return;
    }

    setLoading(true);
    try {
      const newChallenge = await generateTechnicalChallenge(
        userId,
        {
          skills: user?.skills || [],
          experience: user?.experience || '',
          preferredRoles: user?.preferredRoles || []
        },
        challenges
      );
      setChallenges([newChallenge, ...challenges]);
      toast.success('New challenge generated!');
    } catch (err) {
      console.error('Error generating challenge:', err);
      toast.error('Failed to generate challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChallenge = (challengeId: string) => {
    router.push(`/challenges/${challengeId}`);
  };

  if (!FEATURE_FLAGS.TECHNICAL_CHALLENGES) {
    return null;
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center bg-dark-200/30 rounded-2xl p-8 text-center space-y-4'>
        <p className='text-red-500'>{error}</p>
        <Button
          onClick={() => setError(null)}
          className='bg-primary-200/10 hover:bg-primary-200/20 text-primary-200'
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <Code className='w-6 h-6 text-primary-200' />
            <h2 className='text-3xl font-bold'>Technical Challenges</h2>
          </div>
          <p className='text-light-100/70 mt-1'>
            Practice coding challenges tailored to your skills
          </p>
        </div>
        <Button
          onClick={handleGenerateChallenge}
          disabled={isLoading}
          className='bg-primary-200 hover:bg-primary-200/90 text-dark-100'
        >
          {isLoading ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-dark-100 mr-2'></div>
              Generating...
            </>
          ) : !hasRequiredData ? (
            'Complete Profile to Generate'
          ) : (
            'Generate Challenge'
          )}
        </Button>
      </div>

      {isLoading && challenges.length === 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className='group bg-dark-200/30 rounded-2xl overflow-hidden border border-primary-200/10'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className='p-6 space-y-4'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                </div>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <div className='text-center text-light-100/70 bg-dark-200/30 p-8 rounded-xl border border-primary-200/10'>
          No challenges available. Generate your first challenge to get started!
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              className='group bg-dark-200/30 rounded-2xl overflow-hidden border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className='p-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-light-100/70 capitalize'>
                    {challenge.difficulty}
                  </span>
                  <div className='flex items-center gap-1'>
                    <Star className='w-4 h-4 text-primary-200' />
                    <span className='text-sm font-medium'>
                      {challenge.points}
                    </span>
                  </div>
                </div>
                <h3 className='text-xl font-semibold text-light-100'>
                  {challenge.title}
                </h3>
                <p className='text-light-100/70 text-sm line-clamp-2'>
                  {challenge.description}
                </p>
                <div className='flex items-center justify-between pt-4'>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-primary-200' />
                    <span className='text-sm text-light-100/70'>
                      {challenge.estimatedTime} min
                    </span>
                  </div>
                </div>
                <div className='relative z-10'>
                  <Button
                    className='w-full mt-4 bg-primary-200/10 hover:bg-primary-200/20 text-primary-200'
                    onClick={() => handleViewChallenge(challenge.id)}
                  >
                    View Challenge
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
