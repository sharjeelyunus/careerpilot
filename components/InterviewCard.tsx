'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { SiLevelsdotfyi } from 'react-icons/si';
import { InterviewCardProps } from '@/types';
import React, { useMemo } from 'react';

const InterviewCard = React.memo(({
  id,
  role,
  userId,
  type,
  techstack,
  createdAt,
  level,
  feedback,
}: InterviewCardProps) => {
  const normalizedType = useMemo(() => 
    /mix/gi.test(type) ? 'Mixed' : type,
    [type]
  );

  const formattedDate = useMemo(() => 
    dayjs(feedback?.createdAt || createdAt).format('MMM D, YYYY'),
    [feedback?.createdAt, createdAt]
  );

  const truncatedAssessment = useMemo(() => {
    if (!feedback?.finalAssessment) {
      return "You haven't taken the interview yet. Take it now to improve your skills.";
    }
    return feedback.finalAssessment.length > 100
      ? feedback.finalAssessment.slice(0, 100) + '...'
      : feedback.finalAssessment;
  }, [feedback?.finalAssessment]);

  const interviewLink = useMemo(() => {
    if (!userId) return 'sign-in';
    return feedback ? `/interview/${id}/feedback` : `/interview/${id}`;
  }, [userId, feedback, id]);

  return (
    <div className='card-border w-[360px] max-sm:w-full'>
      <div className='card-interview'>
        <div>
          <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
            <p className='badge-text'>{normalizedType}</p>
          </div>

          <h3 className='mt-5 capitalize'>{role}</h3>
          <div className='flex flex-row gap-5 mt-3'>
            <div className='flex flex-row gap-2 items-center'>
              <SiLevelsdotfyi size={18} color='#FEF1C5' />
              <p className='text-sm'>{level}</p>
            </div>
            <div className='flex flex-row gap-2'>
              <Image
                src='/calendar.svg'
                alt='calendar'
                width={22}
                height={22}
                loading="lazy"
                priority={false}
              />
              <p className='text-sm'>{formattedDate}</p>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <Image 
                src='/star.svg' 
                alt='star' 
                width={22} 
                height={22} 
                loading="lazy"
                priority={false}
              />
              <p className='text-sm'>{feedback?.totalScore || '---'}/100</p>
            </div>
          </div>
          <p className='line-clap-2 mt-5'>{truncatedAssessment}</p>
        </div>

        <div className='flex flex-row justify-between'>
          <DisplayTechIcons techStack={techstack} />

          <Button className='btn-primary'>
            <Link href={interviewLink}>
              {feedback ? 'Check Feedback' : 'View Interview'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
});

InterviewCard.displayName = 'InterviewCard';

export default InterviewCard;
