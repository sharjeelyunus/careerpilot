'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from '@/lib/actions/general.action';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { useEffect, useState } from 'react';
import SpinnerLoader from '@/components/ui/loader';

const Feedback = ({ params }: RouteParams) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { id } = await params;
      const user = await getCurrentUser();

      const fetchedInterview = await getInterviewById(id);
      if (!fetchedInterview) redirect('/');

      const fetchedFeedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id || '',
      });

      setInterview(fetchedInterview);
      setFeedback(fetchedFeedback);
      setIsLoading(false);
    };

    fetchData();
  }, [params]);

  if (isLoading) return <SpinnerLoader />;

  if (!interview || !feedback) return null;

  return (
    <section className='section-feedback'>
      <div className='flex flex-row justify-center'>
        <h1 className='text-4xl font-semibold'>
          Feedback on the Interview -{' '}
          <span className='capitalize'>{interview.role}</span> Interview
        </h1>
      </div>

      <div className='flex flex-row justify-center '>
        <div className='flex flex-row gap-5'>
          {/* Overall Impression */}
          <div className='flex flex-row gap-2 items-center'>
            <Image src='/star.svg' width={22} height={22} alt='star' />
            <p>
              Overall Impression:{' '}
              <span className='text-primary-200 font-bold'>
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className='flex flex-row gap-2'>
            <Image src='/calendar.svg' width={22} height={22} alt='calendar' />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className='flex flex-col gap-4'>
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
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
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col gap-3'>
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
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
    </section>
  );
};

export default Feedback;
