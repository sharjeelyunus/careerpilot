'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLeaderboard } from '@/lib/actions/general.action';
import useSWR from 'swr';
import SpinnerLoader from '@/components/ui/loader';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BADGES } from '@/constants/badges';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';

const LeaderboardPage = () => {
  const { data: users, isLoading } = useSWR('leaderboard', getLeaderboard, {
    refreshInterval: 60000, // Refresh every 60 seconds
    revalidateOnFocus: false,
    revalidateOnMount: true,
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
    keepPreviousData: true,
  });

  if (isLoading) return <SpinnerLoader />;

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className='h-6 w-6 text-yellow-400' />;
      case 1:
        return <Medal className='h-6 w-6 text-gray-400' />;
      case 2:
        return <Award className='h-6 w-6 text-amber-600' />;
      default:
        return (
          <span className='text-lg font-bold text-light-100/70'>
            {index + 1}
          </span>
        );
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 border-yellow-400/30';
      case 1:
        return 'bg-gradient-to-br from-gray-400/20 to-gray-400/5 border-gray-400/30';
      case 2:
        return 'bg-gradient-to-br from-amber-600/20 to-amber-600/5 border-amber-600/30';
      default:
        return 'bg-dark-200/50 border-primary-200/10';
    }
  };

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent mb-4'>
          Leaderboard
        </h1>
        <p className='text-light-100/70 max-w-2xl mx-auto'>
          Compete with other developers and climb the ranks. Complete
          interviews, earn badges, and gain experience points to rise to the
          top!
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        {users &&
          users.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative group cursor-pointer h-full',
                index === 0
                  ? 'md:order-1'
                  : index === 1
                  ? 'md:order-2'
                  : 'md:order-3'
              )}
              onClick={() => redirect(`/profile/${user.id}`)}
            >
              <div
                className={cn(
                  'p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary-200/5 h-full flex flex-col',
                  getRankStyle(index)
                )}
              >
                <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                  {getRankIcon(index)}
                </div>
                <div className='flex flex-col items-center gap-4 pt-4 flex-grow'>
                  <Avatar className='h-20 w-20 border-2 border-primary-200/20'>
                    <AvatarImage src={user?.photoURL} />
                    <AvatarFallback className='text-lg'>
                      {user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className='text-center'>
                    <h2 className='text-xl font-bold text-light-100'>
                      {user.name}
                    </h2>
                    <div className='flex items-center justify-center gap-1 mt-1'>
                      <Star className='h-4 w-4 text-primary-200' />
                      <span className='text-primary-200 font-medium'>
                        {user.experiencePoints} XP
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-row gap-2 mt-auto'>
                    {user?.badges?.slice(0, 3).map(({ id }, badgeIndex) => (
                      <div
                        key={id}
                        className={cn(
                          'relative group/badge bg-dark-300/50 rounded-full p-2 flex-center transition-transform hover:scale-110',
                          badgeIndex >= 1 && '-ml-3'
                        )}
                      >
                        <span className='absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-300 text-xs rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap'>
                          {BADGES.find((badge) => badge.id === id)?.name}
                        </span>
                        <div className='p-2 rounded-full bg-primary-200/10 h-5 w-5 flex items-center justify-center'>
                          {BADGES.find((badge) => badge.id === id)?.icon}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Rest of the Leaderboard */}
      <div className='space-y-4'>
        {users &&
          users.slice(3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className='group cursor-pointer'
              onClick={() => redirect(`/profile/${user.id}`)}
            >
              <div className='bg-dark-200/30 p-4 rounded-xl border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-200/5'>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-4 flex-1'>
                    <span className='text-lg font-medium text-light-100/70 w-8'>
                      {index + 4}
                    </span>
                    <Avatar className='h-10 w-10 border border-primary-200/20'>
                      <AvatarImage src={user?.photoURL} />
                      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className='text-lg font-medium text-light-100'>
                        {user.name}
                      </h2>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Star className='h-4 w-4 text-primary-200' />
                    <span className='text-primary-200 font-medium'>
                      {user.experiencePoints} XP
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
