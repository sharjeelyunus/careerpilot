'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLeaderboard } from '@/lib/actions/general.action';
import useSWR from 'swr';
import SpinnerLoader from '@/components/ui/loader';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BADGES } from '@/constants/badges';

const LeaderboardPage = () => {
  const { data: users, isLoading } = useSWR('leaderboard', getLeaderboard);

  if (isLoading) return <SpinnerLoader />;

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {users &&
          users.slice(0, 3).map((user, index) => (
            <div
              key={user.id}
              className='card-border w-full'
              onClick={() => redirect(`/profile/${user.id}`)}
            >
              <div className='card p-4'>
                <div className='text-light-100'>{index + 1}.</div>
                <div className=' flex flex-col text-center items-center gap-4'>
                  <Avatar>
                    <AvatarImage src={user?.photoURL} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col gap-2 items-center'>
                    <h2 className='text-lg font-bold'>{user.name}</h2>
                    <p className='text-light-100'>{user.experiencePoints} XP</p>
                    <div className='flex flex-row'>
                      {user?.badges?.slice(0, 3).map(({ id }, index) => (
                        <div
                          key={id}
                          className={cn(
                            'relative group bg-dark-300 rounded-full p-2 flex-center',
                            index >= 1 && '-ml-3'
                          )}
                        >
                          <span className='tech-tooltip'>
                            {BADGES.find((badge) => badge.id === id)?.name}
                          </span>
                          <div className='p-2 rounded-full bg-primary/10 h-5 w-5 flex items-center justify-center'>
                            {BADGES.find((badge) => badge.id === id)?.icon}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {users &&
        users.slice(3).map((user, index) => (
          <div
            key={user.id}
            className='card-border w-full'
            onClick={() => redirect(`/profile/${user.id}`)}
          >
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
