'use client';

import InterviewCard from '@/components/InterviewCard';
import InterviewForm from '@/components/InterviewForm';
import LandingPage from '@/components/LandingPage';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import SpinnerLoader from '@/components/ui/loader';
import { InterviewSuggestions } from '@/components/InterviewSuggestions';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getCurrentUser } from '@/lib/actions/auth.action';
import {
  getInterviewByUserId,
  getLatestInterviews,
  getFilterOptions,
} from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';
import Search from '@/components/Search';
import {
  MessageSquare,
  Code,
  ArrowRight,
  Calendar,
  Clock,
  BarChart,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

const HomePage = () => {
  const [userInterviewsPage, setUserInterviewsPage] = useState(1);
  const [latestInterviewsPage, setLatestInterviewsPage] = useState(1);
  const [filters, setFilters] = useState({
    type: [] as string[],
    techstack: [] as string[],
    level: [] as string[],
  });

  const { data: user, isLoading: isUserLoading } = useSWR(
    'current-user',
    getCurrentUser,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30 * 60 * 1000,
    }
  );

  const { data: filterOptions } = useSWR('filter-options', getFilterOptions, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });

  const { data: userInterviewsData, isLoading: isUserInterviewsLoading } =
    useSWR(
      !isUserLoading
        ? user?.id
          ? ['interviews-by-user', user.id, userInterviewsPage, filters]
          : null
        : null,
      () =>
        getInterviewByUserId(
          user?.id ?? '',
          userInterviewsPage,
          ITEMS_PER_PAGE,
          '',
          filters
        ),
      {
        revalidateOnFocus: false,
        dedupingInterval: 30000,
      }
    );

  const { data: latestInterviewsData, isLoading: isLatestInterviewsLoading } =
    useSWR(
      !isUserLoading
        ? ['latest-interviews', latestInterviewsPage, user?.id, filters]
        : null,
      () =>
        getLatestInterviews({
          userId: user?.id,
          page: latestInterviewsPage,
          limit: ITEMS_PER_PAGE,
          filters,
        }),
      {
        revalidateOnFocus: false,
        dedupingInterval: 30000,
      }
    );

  const hasPastInterviews = (userInterviewsData?.interviews ?? []).length > 0;
  const hasUpcomingInterviews =
    (latestInterviewsData?.interviews ?? []).length > 0;

  const totalUserPages = Math.ceil(
    (userInterviewsData?.total ?? 0) / ITEMS_PER_PAGE
  );
  const totalLatestPages = Math.ceil(
    (latestInterviewsData?.total ?? 0) / ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[key];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
    setUserInterviewsPage(1);
    setLatestInterviewsPage(1);
  };

  const removeFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
    setUserInterviewsPage(1);
    setLatestInterviewsPage(1);
  };

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
    <div className='min-h-screen'>
      {/* Welcome Section */}
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
                <Sparkles className='w-6 h-6 text-primary-200' />
              </div>
              <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent'>
                Welcome, {user.name || 'Interviewer'}!
              </h1>
            </div>
            <p className='text-lg text-light-100/90'>
              Continue your interview preparation journey with our AI-powered
              platform.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 mt-2'>
              <Modal title='Start an Interview' className='btn-primary group'>
                <InterviewForm />
              </Modal>
              <Button asChild variant='outline' className='btn-secondary group'>
                <Link href='/leaderboard' className='flex items-center gap-2'>
                  View Leaderboard
                  <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-4 bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10 w-full md:w-auto'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-primary-200/10 rounded-full flex items-center justify-center'>
                <Calendar className='w-5 h-5 text-primary-200' />
              </div>
              <div>
                <p className='text-sm text-light-100/70'>Your Interviews</p>
                <p className='text-xl font-bold'>
                  {userInterviewsData?.total || 0}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-primary-200/10 rounded-full flex items-center justify-center'>
                <Clock className='w-5 h-5 text-primary-200' />
              </div>
              <div>
                <p className='text-sm text-light-100/70'>
                  Available Interviews
                </p>
                <p className='text-xl font-bold'>
                  {latestInterviewsData?.total || 0}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-primary-200/10 rounded-full flex items-center justify-center'>
                <BarChart className='w-5 h-5 text-primary-200' />
              </div>
              <div className='flex-1'>
                <p className='text-sm text-light-100/70'>Your Progress</p>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-2 bg-dark-300 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-gradient-to-r from-primary-200 to-primary-300 rounded-full'
                      style={{
                        width: `${Math.min(
                          100,
                          ((userInterviewsData?.total || 0) / 10) * 100
                        )}%`,
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </div>
                  <span className='text-sm font-medium'>
                    {Math.min(
                      100,
                      Math.round(((userInterviewsData?.total || 0) / 10) * 100)
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.div
        className='mb-12 bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Search
          filterOptions={
            filterOptions ?? { type: [], techstack: [], level: [] }
          }
          onSearchChange={() => {}}
          onFilterChange={handleFilterChange}
          onRemoveFilter={removeFilter}
          filters={filters}
        />
      </motion.div>

      {/* Interview Suggestions */}
      {user.id && (
        <motion.section
          className='mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <InterviewSuggestions userId={user.id} />
        </motion.section>
      )}

      {/* Your Interviews Section */}
      {isUserInterviewsLoading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <SpinnerLoader />
        </div>
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
                <Calendar className='w-6 h-6 text-primary-200' />
                Your Interviews
              </h2>
              <p className='text-light-100/70 mt-1'>
                Track your progress and improvement
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {hasPastInterviews ? (
              userInterviewsData?.interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  className='transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-200/5'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <InterviewCard {...interview} />
                </motion.div>
              ))
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
                  You haven&apos;t taken any interviews yet
                </p>
                <Modal title='Start an Interview' className='btn-primary group'>
                  <InterviewForm />
                </Modal>
              </motion.div>
            )}
          </div>

          {totalUserPages > 1 && (
            <div className='mt-8 flex justify-center'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setUserInterviewsPage((p) => Math.max(1, p - 1))
                      }
                      className={cn(
                        'transition-opacity',
                        userInterviewsPage === 1 &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalUserPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setUserInterviewsPage(page)}
                          isActive={userInterviewsPage === page}
                          className='transition-all duration-200'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setUserInterviewsPage((p) =>
                          Math.min(totalUserPages, p + 1)
                        )
                      }
                      className={cn(
                        'transition-opacity',
                        userInterviewsPage === totalUserPages &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </motion.section>
      )}

      {/* Available Interviews Section */}
      {isLatestInterviewsLoading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <SpinnerLoader />
        </div>
      ) : (
        <motion.section
          className='mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-3xl font-bold flex items-center gap-2'>
                <Sparkles className='w-6 h-6 text-primary-200' />
                Available Interviews
              </h2>
              <p className='text-light-100/70 mt-1'>
                Practice with real scenarios
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {hasUpcomingInterviews ? (
              latestInterviewsData?.interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  className='transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-200/5'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <InterviewCard {...interview} userId={user?.id} />
                </motion.div>
              ))
            ) : (
              <motion.div
                className='col-span-full flex flex-col items-center justify-center p-12 bg-dark-200/50 rounded-2xl border border-primary-200/10'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className='w-20 h-20 bg-primary-200/10 rounded-full flex items-center justify-center mb-6'>
                  <Code className='w-10 h-10 text-primary-200' />
                </div>
                <p className='text-lg text-light-100/70 mb-4'>
                  No interviews available at the moment
                </p>
                <p className='text-sm text-light-100/50 mb-6'>
                  Check back later for new opportunities
                </p>
                <Button asChild className='btn-secondary group'>
                  <Link href='/interview' className='flex items-center gap-2'>
                    Browse All Interviews
                    <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>

          {totalLatestPages > 1 && user?.id && (
            <div className='mt-8 flex justify-center'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setLatestInterviewsPage((p) => Math.max(1, p - 1))
                      }
                      className={cn(
                        'transition-opacity',
                        latestInterviewsPage === 1 &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: totalLatestPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setLatestInterviewsPage(page)}
                        isActive={latestInterviewsPage === page}
                        className='transition-all duration-200'
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setLatestInterviewsPage((p) =>
                          Math.min(totalLatestPages, p + 1)
                        )
                      }
                      className={cn(
                        'transition-opacity',
                        latestInterviewsPage === totalLatestPages &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
};

export default HomePage;
