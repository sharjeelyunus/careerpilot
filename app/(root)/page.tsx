'use client';

import InterviewForm from '@/components/InterviewForm';
import LandingPage from '@/components/LandingPage';
import { Modal } from '@/components/Modal';
import SpinnerLoader from '@/components/ui/loader';
import { getCurrentUser } from '@/lib/actions/auth.action';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useInterviewStore } from '@/lib/store/interviewStore';
import { useAnalyticsStore } from '@/lib/store/analytics.store';
import { Calendar, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Import the new components
import WelcomeSection from '@/components/home/WelcomeSection';
import QuickActionsSection from '@/components/home/QuickActionsSection';
import SearchSection from '@/components/home/SearchSection';
import InterviewSuggestionsSection from '@/components/home/InterviewSuggestionsSection';
import InterviewsSection from '@/components/home/InterviewsSection';
import FloatingButtons from '@/components/home/FloatingButtons';

const ITEMS_PER_PAGE = 6;

const HomePage = () => {
  const { data: user, isLoading: isUserLoading } = useSWR(
    'current-user',
    getCurrentUser,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30 * 60 * 1000,
    }
  );

  const {
    fetchAnalytics,
    analyticsData,
    isLoading: isAnalyticsLoading,
  } = useAnalyticsStore();

  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Get state and actions from the Zustand store
  const {
    userInterviews,
    latestInterviews,
    filterOptions,
    filters,
    userInterviewsPage,
    latestInterviewsPage,
    totalUserInterviews,
    totalLatestInterviews,
    isLoadingUserInterviews,
    isLoadingLatestInterviews,
    setUserInterviewsPage,
    setLatestInterviewsPage,
    fetchUserInterviews,
    fetchLatestInterviews,
    fetchFilterOptions,
    handleFilterChange,
    removeFilter,
    fetchCompletedInterviews,
    completedInterviews,
  } = useInterviewStore();

  // Fetch data when user or pagination changes
  useEffect(() => {
    if (user?.id) {
      fetchUserInterviews(user.id, userInterviewsPage, ITEMS_PER_PAGE);
      fetchLatestInterviews(user.id, latestInterviewsPage, ITEMS_PER_PAGE);
      fetchFilterOptions();
      // Only fetch completed interviews if we don't have them or if they're stale
      fetchCompletedInterviews(user.id);
    }
  }, [
    user?.id,
    userInterviewsPage,
    latestInterviewsPage,
    filters,
    fetchUserInterviews,
    fetchLatestInterviews,
    fetchFilterOptions,
    fetchCompletedInterviews,
  ]);

  // Separate effect for analytics to avoid circular dependency
  useEffect(() => {
    if (completedInterviews.length > 0) {
      fetchAnalytics(completedInterviews);
    }
  }, [completedInterviews, fetchAnalytics]);

  // Add scroll event listener to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasPastInterviews = userInterviews.length > 0;

  const totalUserPages = Math.ceil(totalUserInterviews / ITEMS_PER_PAGE);
  const totalLatestPages = Math.ceil(totalLatestInterviews / ITEMS_PER_PAGE);

  // Calculate user's progress percentage towards the next badge
  const calculateProgressPercentage = (
    completedCount: number,
    totalInterviews: number
  ): number => {
    const progress = (completedCount / totalInterviews) * 100;
    return Math.min(100, Math.round(progress));
  };

  const progressPercentage = calculateProgressPercentage(
    analyticsData?.totalInterviews ?? 0,
    totalUserInterviews
  );

  if (isUserLoading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <SpinnerLoader />
      </div>
    );
  }

  // If user is not authenticated, show the landing page
  if (!user?.id) {
    return <LandingPage />;
  }

  return (
    <div className='min-h-screen pb-16 relative'>
      <div className='container mx-auto px-4 pt-6'>
        {/* Welcome Section */}
        <WelcomeSection
          userName={user.name || 'Interviewer'}
          totalUserInterviews={totalUserInterviews}
          totalLatestInterviews={totalLatestInterviews}
          totalCompletedInterviews={analyticsData?.totalInterviews ?? 0}
          progressPercentage={progressPercentage}
          hasPastInterviews={hasPastInterviews}
        />

        {/* Analytics Overview */}
        <div className='mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {isAnalyticsLoading ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className='p-6 dark-gradient'>
                    <Skeleton className='h-6 w-48 mb-2 bg-primary-200/10' />
                    <Skeleton className='h-8 w-24 mb-2 bg-primary-200/10' />
                    <Skeleton className='h-4 w-32 bg-primary-200/10' />
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className='p-6 dark-gradient'>
                    <Skeleton className='h-6 w-48 mb-2 bg-primary-200/10' />
                    <Skeleton className='h-8 w-24 mb-2 bg-primary-200/10' />
                    <Skeleton className='h-4 w-32 bg-primary-200/10' />
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card className='p-6 dark-gradient'>
                    <Skeleton className='h-6 w-48 mb-2 bg-primary-200/10' />
                    <Skeleton className='h-8 w-24 mb-2 bg-primary-200/10' />
                    <Skeleton className='h-4 w-32 bg-primary-200/10' />
                  </Card>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className='p-6 dark-gradient'>
                    <h3 className='text-lg font-semibold text-light-100 mb-2'>
                      Total Completed Interviews
                    </h3>
                    <p className='text-3xl font-bold text-primary-200'>
                      {analyticsData?.totalInterviews ?? 0}
                    </p>
                    <p className='text-sm text-light-100/70 mt-2'>
                      {(analyticsData?.totalInterviews ?? 0) > 0
                        ? 'Keep practicing!'
                        : 'Start your first interview'}
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className='p-6 dark-gradient'>
                    <h3 className='text-lg font-semibold text-light-100 mb-2'>
                      Average Score
                    </h3>
                    <p className='text-3xl font-bold text-primary-200'>
                      {analyticsData?.averageScore ?? 0}%
                    </p>
                    <p className='text-sm text-light-100/70 mt-2'>
                      {(analyticsData?.averageScore ?? 0) > 80
                        ? 'Excellent!'
                        : (analyticsData?.averageScore ?? 0) > 60
                        ? 'Good progress!'
                        : 'Keep practicing!'}
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card className='p-6 dark-gradient'>
                    <h3 className='text-lg font-semibold text-light-100 mb-2'>
                      Practice Streak
                    </h3>
                    <p className='text-3xl font-bold text-primary-200'>
                      {analyticsData?.practiceStreak ?? 0} days
                    </p>
                    <p className='text-sm text-light-100/70 mt-2'>
                      {(analyticsData?.practiceStreak ?? 0) > 5
                        ? 'Amazing streak!'
                        : 'Build your streak!'}
                    </p>
                  </Card>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <QuickActionsSection
          onStartInterview={() => setShowInterviewForm(true)}
        />

        {/* Search and Filters */}
        <SearchSection
          filterOptions={filterOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onRemoveFilter={removeFilter}
        />

        {/* Interview Suggestions */}
        {user.id && <InterviewSuggestionsSection userId={user.id} />}

        {/* Your Interviews Section */}
        {user.id && (
          <InterviewsSection
            title='Your Interviews'
            subtitle='Track your progress and improvement'
            icon={Calendar}
            isLoading={isLoadingUserInterviews}
            interviews={userInterviews}
            currentPage={userInterviewsPage}
            totalPages={totalUserPages}
            onPageChange={setUserInterviewsPage}
            onStartInterview={() => setShowInterviewForm(true)}
            emptyStateTitle="You haven't taken any interviews yet"
            emptyStateDescription='Start your interview preparation journey by taking your first practice interview. Our AI-powered platform will help you improve your skills.'
            emptyStateActionText='Start Your First Interview'
            delay={0.2}
            userId={user.id}
          />
        )}

        {/* Available Interviews Section */}
        {user.id && (
          <InterviewsSection
            title='Available Interviews'
            subtitle='Practice with real scenarios'
            icon={Sparkles}
            isLoading={isLoadingLatestInterviews}
            interviews={latestInterviews}
            currentPage={latestInterviewsPage}
            totalPages={totalLatestPages}
            onPageChange={setLatestInterviewsPage}
            userId={user.id}
            emptyStateTitle='No interviews available at the moment'
            emptyStateDescription="We're constantly adding new interview scenarios. Check back later for new opportunities or browse our full interview library."
            emptyStateActionText='Browse All Interviews'
            emptyStateActionHref='/interview'
            delay={0.3}
          />
        )}
      </div>

      {/* Floating Buttons */}
      <FloatingButtons
        showScrollTop={showScrollTop}
        onStartInterview={() => setShowInterviewForm(true)}
      />

      {/* Interview Form Modal */}
      {showInterviewForm && (
        <Modal
          title='Start an Interview'
          className='btn-primary group'
          open={showInterviewForm}
          onClose={() => setShowInterviewForm(false)}
        >
          <InterviewForm />
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
