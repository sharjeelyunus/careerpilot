'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { getCurrentUser } from '@/lib/actions/auth.action';
import useSWR from 'swr';
import { generateInterview } from '@/lib/actions/general.action';
import { toast } from 'sonner';

interface Suggestion {
  role: string;
  type: string;
  level: string;
  techstack: string;
  amount: number;
}

export function InterviewSuggestions({ userId }: { userId: string }) {
  const router = useRouter();
  const { data: user } = useSWR('current-user', getCurrentUser);
  const [loadingInterviews, setLoadingInterviews] = React.useState<
    Record<string, boolean>
  >({});

  const {
    data: suggestions,
    error,
    isLoading,
  } = useSWR(
    user ? ['interview-suggestions', userId] : null,
    async ([, userId]) => {
      if (!user) return null;

      // Check if user has the required profile data
      const skills = user.skills || [];
      const preferredRoles = user.preferredRoles || [];

      const hasRequiredData =
        skills.length > 0 && user.experience && preferredRoles.length > 0;

      if (!hasRequiredData) {
        throw new Error(
          'Please complete your profile to get personalized interview suggestions'
        );
      }

      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch suggestions');
      }

      return data.suggestions;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 24 * 60 * 60 * 1000,
      keepPreviousData: true,
    }
  );

  const handleStartInterview = async (suggestion: Suggestion) => {
    setLoadingInterviews((prev) => ({ ...prev, [suggestion.role]: true }));
    try {
      const response = await generateInterview({
        role: suggestion.role,
        type: suggestion.type,
        level: suggestion.level,
        techstack: suggestion.techstack,
        amount: suggestion.amount,
        userid: user?.id || '',
      });

      if (response.success) {
        if (response.interviewId) {
          router.push(`/interview/${response.interviewId}`);
        } else {
          router.push('/');
        }
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Error generating interview:', error);
      toast.error('Failed to generate interview. Please try again.');
    } finally {
      setLoadingInterviews((prev) => ({ ...prev, [suggestion.role]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center gap-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-200'></div>
        <p className='text-light-100/70'>Loading Suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center bg-dark-200/30 rounded-2xl p-8 text-center space-y-4'>
        <p className='text-red-500'>{error.message}</p>
        {error.message.includes('complete your profile') && (
          <Button
            onClick={() => router.push(`/profile/${user?.id}`)}
            className='bg-primary-200/10 hover:bg-primary-200/20 text-primary-200'
          >
            Complete Profile
          </Button>
        )}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className='text-center text-light-100/70 bg-dark-200/30 p-8 rounded-xl border border-primary-200/10'>
        No suggestions available at the moment
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div>
        <div className='flex items-center gap-2'>
          <Star className='w-6 h-6 text-primary-200' />
          <h2 className='text-3xl font-bold'>Recommended Interviews</h2>
        </div>
        <p className='text-light-100/70 mt-1'>
          Personalized suggestions based on your profile
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {suggestions.map((suggestion: Suggestion, index: number) => (
          <motion.div
            key={index}
            className='group bg-dark-200/30 rounded-2xl overflow-hidden border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300 flex flex-col'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {/* Header Section */}
            <motion.div 
              className='h-24 bg-gradient-to-r from-dark-300 to-dark-200 relative overflow-hidden flex-shrink-0 p-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
              <motion.div 
                className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-xl'
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              />

              {/* Content inside header */}
              <motion.div 
                className='relative z-10'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
              >
                <div className='flex items-center gap-2 mb-3'>
                  {suggestion.type === 'technical' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    >
                      <Code className='w-5 h-5 text-primary-200' />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    >
                      <MessageSquare className='w-5 h-5 text-primary-200' />
                    </motion.div>
                  )}
                  <span className='text-sm text-light-100/70 capitalize'>
                    {suggestion.type}
                  </span>
                </div>
                <h3 className='text-xl font-semibold text-light-100'>
                  {suggestion.role}
                </h3>
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <motion.div 
              className='flex-1 flex flex-col p-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
            >
              <div className='flex-1 space-y-4'>
                <motion.div 
                  className='grid grid-cols-[100px_1fr] items-center'
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.7 }}
                >
                  <span className='text-sm text-light-100/70'>Level:</span>
                  <span className='text-sm font-medium'>
                    {suggestion.level}
                  </span>
                </motion.div>
                <motion.div 
                  className='grid grid-cols-[100px_1fr] items-start'
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
                >
                  <span className='text-sm text-light-100/70'>Tech Stack:</span>
                  <span className='text-sm font-medium'>
                    {suggestion.techstack}
                  </span>
                </motion.div>
                <motion.div 
                  className='grid grid-cols-[100px_1fr] items-center'
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.9 }}
                >
                  <span className='text-sm text-light-100/70'>Questions:</span>
                  <span className='text-sm font-medium'>
                    {suggestion.amount}
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
              >
                <Button
                  onClick={() => handleStartInterview(suggestion)}
                  className='w-full btn-primary hover:bg-dark-300 text-light-100 transition-colors mt-6'
                  disabled={loadingInterviews[suggestion.role]}
                >
                  {loadingInterviews[suggestion.role] ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-light-100 mr-2'></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      Start Interview
                      <ArrowRight className='w-4 h-4 ml-2' />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
