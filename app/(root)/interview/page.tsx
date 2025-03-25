'use client';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import React from 'react';
import useSWR from 'swr';

const InterviewGeneration = () => {
  const { data: user } = useSWR('current-user', getCurrentUser);

  return (
    <>
      <h3>Interview Generation</h3>

      <Agent userName={user?.name ?? ''} userId={user?.id} type='generate' />
    </>
  );
};

export default InterviewGeneration;
