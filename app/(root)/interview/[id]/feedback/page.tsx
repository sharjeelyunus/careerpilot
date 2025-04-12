'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { useState } from 'react';

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';
import SpinnerLoader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/types';

const FeedbackPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const { data: user, isLoading: isUserLoading } = useSWR(
    'current-user',
    getCurrentUser
  );

  const { data: feedbacks, isLoading: isFeedbackLoading } = useSWR(
    user?.id && id ? ['feedback', id, user.id] : null,
    () =>
      getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id ?? '',
      })
  );

  const { data: interview, isLoading: isInterviewLoading } = useSWR(
    id ? ['interview', id] : null,
    () => getInterviewById(id)
  );

  const isLoading = isUserLoading || isFeedbackLoading || isInterviewLoading;

  if (isLoading) return <SpinnerLoader />;
  if (!interview || !feedbacks) return null;

  const renderFeedbackCard = (feedback: Feedback) => (
    <div
      key={feedback.id}
      className='p-6 rounded-lg border border-primary-200/10 bg-dark-200/30 hover:border-primary-200/30 transition-all duration-300 cursor-pointer'
      onClick={() => setSelectedFeedback(feedback)}
    >
      <div className='flex flex-row gap-5 mb-4'>
        <div className='flex flex-row gap-2 items-center'>
          <Image src='/star.svg' width={22} height={22} alt='star' />
          <p>
            Score:{' '}
            <span className='text-primary-200 font-bold'>
              {feedback.totalScore}
            </span>
            /100
          </p>
        </div>
        <div className='flex flex-row gap-2'>
          <Image src='/calendar.svg' width={22} height={22} alt='calendar' />
          <p>{dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')}</p>
        </div>
      </div>
      <p className='text-light-100/80 line-clamp-2'>
        {feedback.finalAssessment}
      </p>
    </div>
  );

  const renderFeedbackDetails = (feedback: Feedback) => (
    <div className='space-y-6'>
      <div className='flex flex-row justify-center'>
        <h1 className='text-4xl font-semibold'>
          Feedback on the Interview -{' '}
          <span className='capitalize'>{interview.role}</span>
        </h1>
      </div>

      <div className='flex flex-row justify-center'>
        <div className='flex flex-row gap-5'>
          <div className='flex flex-row gap-2 items-center'>
            <Image src='/star.svg' width={22} height={22} alt='star' />
            <p>
              Overall Impression:{' '}
              <span className='text-primary-200 font-bold'>
                {feedback.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className='flex flex-row gap-2'>
            <Image src='/calendar.svg' width={22} height={22} alt='calendar' />
            <p>{dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')}</p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback.finalAssessment}</p>

      <div className='flex flex-col gap-4'>
        <h2>Breakdown of the Interview:</h2>
        {feedback.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className='font-bold'>
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-3'>
        <h3>Strengths</h3>
        <ul>
          {feedback.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-3'>
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className='buttons'>
        <Button className='btn-secondary flex-1'>
          <Link href='/' className='flex w-full justify-center'>
            <p className='text-sm font-semibold text-primary-200 text-center'>
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className='btn-primary flex-1'>
          <Link
            href={`/interview/${interview.id}`}
            className='flex w-full justify-center'
          >
            <p className='text-sm font-semibold text-black text-center'>
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <section className='section-feedback'>
      {feedbacks.length === 1 ? (
        renderFeedbackDetails(feedbacks[0])
      ) : selectedFeedback ? (
        <div>
          <Button
            variant='ghost'
            className='mb-4'
            onClick={() => setSelectedFeedback(null)}
          >
            ← Back to all feedbacks
          </Button>
          {renderFeedbackDetails(selectedFeedback)}
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='flex flex-row justify-center'>
            <h1 className='text-4xl font-semibold'>
              Interview Feedbacks -{' '}
              <span className='capitalize'>{interview.role}</span>
            </h1>
          </div>
          <div className='flex flex-col gap-4'>
            {feedbacks.map(renderFeedbackCard)}
          </div>
        </div>
      )}
    </section>
  );
};

export default FeedbackPage;
