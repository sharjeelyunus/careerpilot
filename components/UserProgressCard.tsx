import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Target, Star } from 'lucide-react';
import { UserProgress } from '@/types';

interface UserProgressCardProps {
  progress: UserProgress;
}

export function UserProgressCard({ progress }: UserProgressCardProps) {
  return (
    <Card className='w-full card'>
      <CardContent className='space-y-6'>
        {/* Achievements Section */}
        {progress.achievements.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Trophy className='h-5 w-5 text-yellow-500' />
              Achievements
            </h3>
            <div className='space-y-4'>
              {progress.achievements.map((achievement) => (
                <div key={achievement.id} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Award className='h-4 w-4 text-blue-500' />
                      <span className='font-medium'>{achievement.name}</span>
                    </div>
                    <span className='text-sm text-muted-foreground'>
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <Progress
                    value={(achievement.progress / achievement.target) * 100}
                    className='h-2'
                  />
                  <p className='text-sm text-muted-foreground'>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Section */}
        {progress.badges.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Star className='h-5 w-5 text-purple-500' />
              Badges
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              {progress.badges.map((badge) => (
                <div className='card-border w-full' key={badge.id}>
                  <div className='flex items-center gap-3 p-3 rounded-lg border card'>
                    <div className='p-2 rounded-full bg-primary/10 h-10 w-10 flex items-center justify-center'>
                      {badge?.icon ? (
                        <span>{badge.icon}</span>
                      ) : (
                        <Target className='h-4 w-4 text-primary' />
                      )}
                    </div>
                    <div>
                      <p className='font-medium'>{badge.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Statistics</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='card-border w-full'>
              <div className='p-4 rounded-lg border card'>
                <p className='text-sm text-muted-foreground'>
                  Total Interviews
                </p>
                <p className='text-2xl font-bold'>{progress.totalInterviews}</p>
              </div>
            </div>
            <div className='card-border w-full'>
              <div className='p-4 rounded-lg border card'>
                <p className='text-sm text-muted-foreground'>Completion Rate</p>
                <p className='text-2xl font-bold'>
                  {Math.round(
                    ((progress.completedInterviews || 0) /
                      (progress.totalInterviews || 1)) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
