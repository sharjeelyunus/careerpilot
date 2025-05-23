'use client';

import React, { useEffect } from 'react';
import { useInterviewStore } from '@/lib/store/interviewStore';
import { getCurrentUser } from '@/lib/actions/auth.action';
import useSWR from 'swr';
import FeedbackCard from '@/components/FeedbackCard';
import { Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressTimeline from '@/components/analytics/ProgressTimeline';
import { useAnalyticsStore } from '@/lib/store/analytics.store';
import { Skeleton } from '@/components/ui/skeleton';
import { AppEvents } from '@/lib/services/app-events.service';

const InterviewHistoryPage = () => {
  const { data: user, isLoading: isUserLoading } = useSWR(
    'current-user',
    getCurrentUser,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30 * 60 * 1000,
    }
  );

  const { fetchAnalytics, analyticsData, isLoading: isAnalyticsLoading } = useAnalyticsStore();

  // Get state and actions from the Zustand store
  const {
    completedInterviews,
    totalCompletedInterviews,
    isLoadingCompletedInterviews,
    fetchCompletedInterviews,
  } = useInterviewStore();

  // Fetch data when user changes
  useEffect(() => {
    if (user?.id) {
      // Force refresh completed interviews on the history page to ensure we have the latest data
      fetchCompletedInterviews(user.id, true);
      AppEvents.trackPageView('interview_history', {
        user_id: user.id,
        interview_count: totalCompletedInterviews,
      });

      // Track user session
      const sessionStartTime = Date.now();
      return () => {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        AppEvents.trackUserSession(user.id, duration, {
          page: 'interview_history',
          interview_count: totalCompletedInterviews,
        });
      };
    }
  }, [user?.id, fetchCompletedInterviews, totalCompletedInterviews]);

  // Track analytics data loading
  useEffect(() => {
    if (completedInterviews.length > 0 && user?.id) {
      AppEvents.trackFeatureUsage('analytics', 'load_data', {
        interview_count: completedInterviews.length,
        user_id: user.id,
      });
      fetchAnalytics(completedInterviews);
    }
  }, [completedInterviews, fetchAnalytics, user?.id]);

  if (isUserLoading) {
    return (
      <div className='min-h-screen pb-16'>
        {/* Header Section Skeleton */}
        <motion.section
          className='mb-12 bg-gradient-to-br from-dark-300 to-dark-100 rounded-3xl p-8 md:p-12 relative overflow-hidden'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
          <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-3xl' />
          <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/20 to-transparent blur-3xl' />

          <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='flex flex-col gap-4 max-w-2xl'>
              <div className='flex items-center gap-3'>
                <Skeleton className='w-12 h-12 rounded-full' />
                <Skeleton className='h-10 w-48' />
              </div>
              <Skeleton className='h-6 w-96' />
            </div>
            <div className='flex flex-col gap-4 bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10 w-full md:w-auto'>
              <div className='flex items-center gap-3'>
                <Skeleton className='w-5 h-5' />
                <div>
                  <Skeleton className='h-4 w-32 mb-2' />
                  <Skeleton className='h-8 w-16' />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Progress Timeline Section Skeleton */}
        <motion.section
          className='mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className='bg-dark-200/30 rounded-2xl p-8 border border-primary-200/10'>
            <Skeleton className='h-8 w-48 mb-8' />
            <div className='space-y-8'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='space-y-4'>
                  <Skeleton className='h-6 w-32' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className='h-24 w-full rounded-lg' />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Interview History Section Skeleton */}
        <motion.section
          className='mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='flex items-center justify-between mb-8'>
            <div>
              <div className='flex items-center gap-2'>
                <Skeleton className='w-6 h-6' />
                <Skeleton className='h-8 w-48' />
              </div>
              <Skeleton className='h-4 w-64 mt-1' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className='bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-6 w-24' />
                  </div>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-4/6' />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    );
  }

  // If user is not authenticated, redirect to home
  if (!user?.id) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px]'>
        <h1 className='text-2xl font-bold mb-4'>
          Please log in to view your feedback history
        </h1>
        <p className='text-light-100/70'>
          You need to be logged in to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen pb-16'>
      {/* Header Section */}
      <motion.section
        className='mb-12 bg-gradient-to-br from-dark-300 to-dark-100 rounded-3xl p-8 md:p-12 relative overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-3xl' />
        <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/20 to-transparent blur-3xl' />

        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='flex flex-col gap-4 max-w-2xl'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary-200/10 rounded-full flex items-center justify-center'>
                <MessageSquare className='w-6 h-6 text-primary-200' />
              </div>
              <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent'>
                Interview History
              </h1>
            </div>
            <p className='text-lg text-light-100/90'>
              Review your interview feedback and track your improvement over time.
            </p>
          </div>
          {!isLoadingCompletedInterviews && (
            <div className='flex flex-col gap-4 bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10 w-full md:w-auto'>
              <div className='flex items-center gap-3'>
                <Calendar className='w-5 h-5 text-primary-200' />
                <div>
                  <h3 className='font-medium text-light-100'>Total Interviews</h3>
                  <p className='text-2xl font-bold text-primary-200'>
                    {totalCompletedInterviews}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Progress Timeline Section */}
      {isAnalyticsLoading ? (
        <motion.section
          className='mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className='bg-dark-200/30 rounded-2xl p-8 border border-primary-200/10'>
            <Skeleton className='h-8 w-48 mb-8' />
            <div className='space-y-8'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='space-y-4'>
                  <Skeleton className='h-6 w-32' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className='h-24 w-full rounded-lg' />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      ) : (
        analyticsData?.progressData && (
          <motion.section
            className='mb-12'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProgressTimeline
              progressData={analyticsData.progressData}
              performanceData={analyticsData.performanceData}
              skillData={analyticsData.skillData}
            />
          </motion.section>
        )
      )}

      {/* Interview History Section */}
      {isLoadingCompletedInterviews ? (
        <motion.section
          className='mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='flex items-center justify-between mb-8'>
            <div>
              <div className='flex items-center gap-2'>
                <Skeleton className='w-6 h-6' />
                <Skeleton className='h-8 w-48' />
              </div>
              <Skeleton className='h-4 w-64 mt-1' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className='bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-6 w-24' />
                  </div>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-4/6' />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ) : (
        <motion.section
          className='mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-3xl font-bold flex items-center gap-2'>
                <MessageSquare className='w-6 h-6 text-primary-200' />
                Your Interview Feedback
              </h2>
              <p className='text-light-100/70 mt-1'>
                Click on a card to view detailed feedback
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr'>
            {completedInterviews.length > 0 ? (
              completedInterviews.map((interview, index) => {
                const latestFeedback = interview.feedbacks?.[0];
                if (!latestFeedback) return null;

                return (
                  <motion.div
                    key={interview.id}
                    className='h-full'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <FeedbackCard
                      id={interview.id}
                      date={new Date(interview.createdAt).toLocaleDateString()}
                      role={interview.role}
                      type={interview.type}
                      overallScore={latestFeedback.totalScore}
                      strengths={latestFeedback.strengths}
                      areasForImprovement={latestFeedback.areasForImprovement}
                      keyTakeaways={[latestFeedback.finalAssessment]}
                    />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                className='col-span-full flex flex-col items-center justify-center p-12 bg-dark-200/50 rounded-2xl border border-primary-200/10'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className='w-20 h-20 bg-primary-200/10 rounded-full flex items-center justify-center mb-6'>
                  <MessageSquare className='w-10 h-10 text-primary-200' />
                </div>
                <p className='text-lg text-light-100/70 mb-4'>
                  You haven&apos;t received any feedback yet
                </p>
                <p className='text-sm text-light-100/50 mb-6 text-center max-w-md'>
                  Complete your first interview to receive detailed feedback and
                  insights to help you improve your skills.
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default InterviewHistoryPage;
