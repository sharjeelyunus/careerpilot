import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit2, Star, Trophy, Target, Zap } from 'lucide-react';
import { UserProfileCardProps } from '@/types';

export function UserProfileCard({
  profile,
  progress,
  onEdit,
}: UserProfileCardProps) {
  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center space-y-0 pb-2'>
        <div className='flex items-center space-x-4'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={profile?.photoURL} />
            <AvatarFallback>{profile?.name[0]}</AvatarFallback>
          </Avatar>
          <div className='flex-1 space-y-1'>
            <h3 className='text-xl font-semibold'>{profile?.name}</h3>
            <p className='text-sm text-muted-foreground'>{profile?.email}</p>
            {profile?.location && (
              <p className='text-sm text-muted-foreground'>
                {profile.location}
              </p>
            )}
          </div>
        </div>
        <Button variant='ghost' size='icon' onClick={onEdit}>
          <Edit2 className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent>
        {profile?.bio && (
          <div className='mt-4'>
            <h4 className='font-medium'>About</h4>
            <p className='text-sm text-muted-foreground'>{profile.bio}</p>
          </div>
        )}

        {profile?.skills && profile.skills.length > 0 && (
          <div className='mt-4'>
            <h4 className='font-medium'>Skills</h4>
            <div className='flex flex-wrap gap-2 mt-2'>
              {profile?.skills.map((skill: string) => (
                <Badge key={skill} variant='secondary'>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className='mt-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Star className='h-4 w-4 text-yellow-500' />
              <span className='text-sm font-medium'>
                Level {progress.level}
              </span>
            </div>
            <span className='text-sm text-muted-foreground'>
              {progress.experiencePoints} XP
            </span>
          </div>
          <Progress
            value={(progress.experiencePoints % 1000) / 10}
            className='h-2'
          />

          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col items-center'>
              <Trophy className='h-5 w-5 text-blue-500' />
              <span className='text-sm font-medium'>
                {progress.completedInterviews}
              </span>
              <span className='text-xs text-muted-foreground'>Interviews</span>
            </div>
            <div className='flex flex-col items-center'>
              <Target className='h-5 w-5 text-green-500' />
              <span className='text-sm font-medium'>
                {progress.averageScore}%
              </span>
              <span className='text-xs text-muted-foreground'>Avg Score</span>
            </div>
            <div className='flex flex-col items-center'>
              <Zap className='h-5 w-5 text-orange-500' />
              <span className='text-sm font-medium'>{progress.streak}</span>
              <span className='text-xs text-muted-foreground'>Day Streak</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
