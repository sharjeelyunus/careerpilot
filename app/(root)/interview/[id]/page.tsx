'use client';

import React, { useEffect } from 'react';
import { useParams, redirect } from 'next/navigation';
import { useInterviewStore } from '@/lib/store/interviewStore';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewById } from '@/lib/actions/general.action';
import useSWR from 'swr';
import SpinnerLoader from '@/components/ui/loader';
import Agent from '@/components/Agent';

export default function InterviewPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const { fetchUserInterviews } = useInterviewStore();

  const { data: user } = useSWR('current-user', getCurrentUser);
  const { data: interview, isLoading: isInterviewLoading } = useSWR(
    id ? ['interview', id] : null,
    () => getInterviewById(id)
  );

  useEffect(() => {
    if (user?.id) {
      fetchUserInterviews(user.id, 1, 10);
    }
  }, [fetchUserInterviews, user?.id]);

  if (isInterviewLoading) return <SpinnerLoader />;

  if (!interview) redirect('/');

  return (
    <>
      <div className='flex flex-row gap-4 justify-between'>
        <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
          <h3 className='capitalize'>{interview.role}</h3>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>
        <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize'>
          {interview.level}
        </p>
      </div>

      <Agent
        userName={user?.name || ''}
        userId={user?.id || ''}
        interviewId={id}
        type='interview'
        questions={interview.questions}
      />
    </>
  );
}
