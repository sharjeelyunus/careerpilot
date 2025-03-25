'use client';

import InterviewCard from '@/components/InterviewCard';
import InterviewForm from '@/components/InterviewForm';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import SpinnerLoader from '@/components/ui/loader';
import { getCurrentUser } from '@/lib/actions/auth.action';
import {
  getInterviewByUserId,
  getLatestInterviews,
} from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInterviews, setUserInterviews] = useState<Interview[]>([]);
  const [latestInterviews, setLatestInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      setUser(user);

      const [userInterviews, latestInterviews] = await Promise.all([
        user?.id ? await getInterviewByUserId(user.id) : [],
        await getLatestInterviews({ userId: user?.id }),
      ]);
      setUserInterviews(userInterviews ?? []);
      setLatestInterviews(latestInterviews ?? []);
      setIsLoading(false);
    };
    fetchInterviews();
  }, [user?.id]);

  const hasPastInterviews = (userInterviews ?? []).length > 0;
  const hasUpcomingInterviews = (latestInterviews ?? []).length > 0;

  // if (isLoading) return <SpinnerLoader />;

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

      {isLoading ? (
        <SpinnerLoader />
      ) : (
        <>
          <section
            className={cn('flex flex-col gap-6 mt-8', !user?.id && 'hidden')}
          >
            <h2>Your Interviews</h2>

            <div className='interviews-section'>
              {hasPastInterviews ? (
                userInterviews?.map((interview) => (
                  <InterviewCard key={interview.id} {...interview} />
                ))
              ) : (
                <p>You haven&apos;t taken any interviews yet</p>
              )}
            </div>
          </section>

          <section className='flex flex-col gap-6 mt-8'>
            <h2>Take an Interview</h2>

            <div className='interviews-section'>
              {hasUpcomingInterviews ? (
                latestInterviews?.map((interview) => (
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
          </section>
        </>
      )}
    </>
  );
};

export default HomePage;
