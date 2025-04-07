import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Edit2,
  Star,
  Trophy,
  Target,
  Zap,
  MapPin,
  Mail,
  User,
} from 'lucide-react';
import { UserProfileCardProps } from '@/types';
import useSWR from 'swr';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { motion } from 'framer-motion';

export function UserProfileCard({
  profile,
  progress,
  onEdit,
}: UserProfileCardProps) {
  const { data: user } = useSWR('current-user', getCurrentUser);

  const levelProgress = (progress.experiencePoints % 1000) / 10;
  const nextLevelXP = 1000 - (progress.experiencePoints % 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full'
    >
      <Card className='w-full overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300/80 to-dark-200/80 border border-primary-200/20 shadow-xl shadow-primary-200/5'>
        <div className='relative'>
          {/* Background elements */}
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
          <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-2xl' />
          <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/10 to-transparent blur-2xl' />

          {/* Header with gradient background */}
          <div className='relative h-32 bg-gradient-to-br from-dark-400 to-dark-300'>
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
            <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-xl' />

            {/* Edit button */}
            {user?.id === profile?.id && (
              <Button
                variant='outline'
                size='icon'
                onClick={onEdit}
                className='absolute top-4 right-4 z-10 bg-dark-300/50 border-primary-200/20 hover:bg-primary-200/10 hover:border-primary-200/30 backdrop-blur-sm'
              >
                <Edit2 className='h-4 w-4 text-primary-200' />
              </Button>
            )}

            {/* Avatar */}
            <div className='absolute -bottom-12 left-6 z-10'>
              <Avatar className='h-24 w-24 border-4 border-dark-300 shadow-lg ring-2 ring-primary-200/30'>
                <AvatarImage src={profile?.photoURL} />
                <AvatarFallback className='bg-primary-200/10 text-primary-200 text-xl'>
                  {profile?.name ? (
                    profile.name[0].toUpperCase()
                  ) : (
                    <User className='h-8 w-8' />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* User info */}
          <div className='pt-16 px-6 pb-4'>
            <h3 className='text-2xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent'>
              {profile?.name || 'Anonymous User'}
            </h3>
            <div className='flex flex-col gap-1 mt-2'>
              <div className='flex items-center gap-2 text-light-100/70'>
                <Mail className='h-4 w-4 text-primary-200' />
                <p className='text-sm'>{profile?.email}</p>
              </div>
              {profile?.location && (
                <div className='flex items-center gap-2 text-light-100/70'>
                  <MapPin className='h-4 w-4 text-primary-200' />
                  <p className='text-sm'>{profile.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className='relative z-10 pt-6 px-6 pb-8'>
          {profile?.bio && (
            <div className='mb-6 bg-dark-300/30 p-4 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
              <h4 className='font-medium text-primary-200 mb-2 flex items-center gap-2'>
                <span className='w-1 h-4 bg-primary-200 rounded-full'></span>
                About
              </h4>
              <p className='text-sm text-light-100/80'>{profile.bio}</p>
            </div>
          )}

          {profile?.skills && profile.skills.length > 0 && (
            <div className='mb-6'>
              <h4 className='font-medium text-primary-200 mb-2 flex items-center gap-2'>
                <span className='w-1 h-4 bg-primary-200 rounded-full'></span>
                Skills
              </h4>
              <div className='flex flex-wrap gap-2'>
                {profile?.skills.map((skill: string) => (
                  <Badge
                    key={skill}
                    variant='outline'
                    className='bg-primary-200/10 text-primary-200 border-primary-200/20 hover:bg-primary-200/20 transition-colors'
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className='mt-6 space-y-4 bg-dark-300/30 p-5 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='bg-primary-200/10 p-1.5 rounded-full'>
                  <Star className='h-4 w-4 text-primary-200' />
                </div>
                <span className='text-sm font-medium text-light-100'>
                  Level {progress.level}
                </span>
              </div>
              <div className='flex flex-col items-end'>
                <span className='text-sm font-medium text-primary-200'>
                  {progress.experiencePoints} XP
                </span>
                <span className='text-xs text-light-100/50'>
                  {nextLevelXP} XP to next level
                </span>
              </div>
            </div>
            <Progress
              value={levelProgress}
              className='h-2.5 bg-dark-200 rounded-full overflow-hidden'
            />

            <div className='grid grid-cols-3 gap-4 mt-6'>
              <div className='flex flex-col items-center bg-dark-200/50 p-3 rounded-xl border border-primary-200/10 hover:border-primary-200/30 transition-colors group'>
                <div className='bg-primary-200/10 p-2 rounded-full mb-2 group-hover:bg-primary-200/20 transition-colors'>
                  <Trophy className='h-5 w-5 text-primary-200' />
                </div>
                <span className='text-lg font-bold text-light-100'>
                  {progress.completedInterviews}
                </span>
                <span className='text-xs text-light-100/50'>Interviews</span>
              </div>
              <div className='flex flex-col items-center bg-dark-200/50 p-3 rounded-xl border border-primary-200/10 hover:border-primary-200/30 transition-colors group'>
                <div className='bg-primary-200/10 p-2 rounded-full mb-2 group-hover:bg-primary-200/20 transition-colors'>
                  <Target className='h-5 w-5 text-primary-200' />
                </div>
                <span className='text-lg font-bold text-light-100'>
                  {progress.averageScore.toFixed(1)}%
                </span>
                <span className='text-xs text-light-100/50'>Avg Score</span>
              </div>
              <div className='flex flex-col items-center bg-dark-200/50 p-3 rounded-xl border border-primary-200/10 hover:border-primary-200/30 transition-colors group'>
                <div className='bg-primary-200/10 p-2 rounded-full mb-2 group-hover:bg-primary-200/20 transition-colors'>
                  <Zap className='h-5 w-5 text-primary-200' />
                </div>
                <span className='text-lg font-bold text-light-100'>
                  {progress.streak}
                </span>
                <span className='text-xs text-light-100/50'>Day Streak</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
