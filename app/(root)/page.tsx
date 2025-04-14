'use client';

import InterviewForm from '@/components/InterviewForm';
import LandingPage from '@/components/LandingPage';
import { Modal } from '@/components/Modal';
import SpinnerLoader from '@/components/ui/loader';
import { getCurrentUser } from '@/lib/actions/auth.action';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useInterviewStore } from '@/lib/store/interviewStore';

// Import the new components
import WelcomeSection from '@/components/home/WelcomeSection';
import QuickActionsSection from '@/components/home/QuickActionsSection';
import SearchSection from '@/components/home/SearchSection';
import InterviewSuggestionsSection from '@/components/home/InterviewSuggestionsSection';
import InterviewsSection from '@/components/home/InterviewsSection';
import FloatingButtons from '@/components/home/FloatingButtons';
import { Calendar, Sparkles } from 'lucide-react';

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
  } = useInterviewStore();

  // Fetch data when user or pagination changes
  useEffect(() => {
    if (user?.id) {
      fetchUserInterviews(user.id, userInterviewsPage, ITEMS_PER_PAGE);
      fetchLatestInterviews(user.id, latestInterviewsPage, ITEMS_PER_PAGE);
      fetchFilterOptions();
    }
  }, [
    user?.id,
    userInterviewsPage,
    latestInterviewsPage,
    filters,
    fetchUserInterviews,
    fetchLatestInterviews,
    fetchFilterOptions,
  ]);

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

  // Calculate user's progress percentage
  const progressPercentage = Math.min(
    100,
    Math.round((totalUserInterviews / 10) * 100)
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
          progressPercentage={progressPercentage}
          hasPastInterviews={hasPastInterviews}
        />

        {/* Quick Actions Section */}
        <QuickActionsSection onStartInterview={() => setShowInterviewForm(true)} />

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
        <InterviewsSection
          title="Your Interviews"
          subtitle="Track your progress and improvement"
          icon={Calendar}
          isLoading={isLoadingUserInterviews}
          interviews={userInterviews}
          currentPage={userInterviewsPage}
          totalPages={totalUserPages}
          onPageChange={setUserInterviewsPage}
          onStartInterview={() => setShowInterviewForm(true)}
          emptyStateTitle="You haven't taken any interviews yet"
          emptyStateDescription="Start your interview preparation journey by taking your first practice interview. Our AI-powered platform will help you improve your skills."
          emptyStateActionText="Start Your First Interview"
          delay={0.2}
          userId={user?.id}
        />

        {/* Available Interviews Section */}
        <InterviewsSection
          title="Available Interviews"
          subtitle="Practice with real scenarios"
          icon={Sparkles}
          isLoading={isLoadingLatestInterviews}
          interviews={latestInterviews}
          currentPage={latestInterviewsPage}
          totalPages={totalLatestPages}
          onPageChange={setLatestInterviewsPage}
          userId={user?.id}
          emptyStateTitle="No interviews available at the moment"
          emptyStateDescription="We're constantly adding new interview scenarios. Check back later for new opportunities or browse our full interview library."
          emptyStateActionText="Browse All Interviews"
          emptyStateActionHref="/interview"
          delay={0.3}
        />
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
