'use client';

import InterviewCard from '@/components/InterviewCard';
import InterviewForm from '@/components/InterviewForm';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import SpinnerLoader from '@/components/ui/loader';
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
} from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';

const ITEMS_PER_PAGE = 6;

const HomePage = () => {
  const [userInterviewsPage, setUserInterviewsPage] = useState(1);
  const [latestInterviewsPage, setLatestInterviewsPage] = useState(1);

  const { data: user, isLoading: isUserLoading } = useSWR(
    'current-user',
    getCurrentUser
  );

  const { data: userInterviewsData, isLoading: isUserInterviewsLoading } =
    useSWR(
      user?.id ? ['interviews-by-user', user.id, userInterviewsPage] : null,
      () =>
        getInterviewByUserId(user?.id ?? '', userInterviewsPage, ITEMS_PER_PAGE)
    );

  const { data: latestInterviewsData, isLoading: isLatestInterviewsLoading } =
    useSWR(['latest-interviews', latestInterviewsPage], () =>
      getLatestInterviews({
        userId: user?.id,
        page: latestInterviewsPage,
        limit: ITEMS_PER_PAGE,
      })
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

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className='text-lg'>
            Practice on ready interview questions & get instant feedback
          </p>
          {user?.id ? (
            <Modal
              title='Start an Interview'
              description='Generate an interview based on your role. Practice with it and get feedback on your performance.'
            >
              <InterviewForm />
            </Modal>
          ) : (
            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href='/sign-in'>Start an Interview</Link>
            </Button>
          )}
        </div>
        <Image
          src='/robot.png'
          alt='robot'
          height={400}
          width={400}
          className='max-sm:hidden'
        />
      </section>

      {isUserLoading || isUserInterviewsLoading ? (
        <SpinnerLoader />
      ) : (
        <>
          <section
            className={cn('flex flex-col gap-6 mt-8', !user?.id && 'hidden')}
          >
            <h2>Your Interviews</h2>
            <div className='interviews-section'>
              {hasPastInterviews ? (
                userInterviewsData?.interviews.map((interview) => (
                  <InterviewCard key={interview.id} {...interview} />
                ))
              ) : (
                <p>You haven&apos;t taken any interviews yet</p>
              )}
            </div>
            {totalUserPages > 1 && (
              <Pagination className='mt-4'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setUserInterviewsPage((p) => Math.max(1, p - 1))
                      }
                      className={cn(
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
                        userInterviewsPage === totalUserPages &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </section>
        </>
      )}

      {isUserLoading || isLatestInterviewsLoading ? (
        <SpinnerLoader />
      ) : (
        <>
          <section className='flex flex-col gap-6 mt-8'>
            <h2>Take an Interview</h2>
            <div className='interviews-section'>
              {hasUpcomingInterviews ? (
                latestInterviewsData?.interviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    {...interview}
                    userId={user?.id}
                  />
                ))
              ) : (
                <p>There are no new interviews available</p>
              )}
            </div>
            {totalLatestPages > 1 && (
              <Pagination className='mt-4'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setLatestInterviewsPage((p) => Math.max(1, p - 1))
                      }
                      className={cn(
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
                        latestInterviewsPage === totalLatestPages &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default HomePage;
