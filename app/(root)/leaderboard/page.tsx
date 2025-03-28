'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLeaderboard } from '@/lib/actions/general.action';
import useSWR from 'swr';
import SpinnerLoader from '@/components/ui/loader';

const LeaderboardPage = () => {
  const { data: users, isLoading } = useSWR('leaderboard', getLeaderboard);

  if (isLoading) return <SpinnerLoader />;

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {users &&
          users.slice(0, 3).map((user, index) => (
            <div key={user.id} className='card-border w-full'>
              <div className='card p-4'>
                <div className='text-light-100'>{index + 1}.</div>
                <div className=' flex flex-col text-center items-center gap-4'>
                  <Avatar>
                    <AvatarImage src={user?.photoURL} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <h2 className='text-lg font-bold'>{user.name}</h2>
                    <p className='text-light-100'>{user.experiencePoints} XP</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {users &&
        users.slice(3).map((user, index) => (
          <div key={user.id} className='card-border w-full'>
            <div className='card p-4'>
              <div className=' flex text-center items-center gap-4'>
                <div className='text-light-100'>{index + 4}.</div>
                <Avatar>
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className='flex justify-between w-full'>
                  <h2 className='text-lg font-bold'>{user.name}</h2>
                  <p className='text-light-100'>{user.experiencePoints} XP</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default LeaderboardPage;
