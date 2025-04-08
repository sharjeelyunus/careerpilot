import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Target,
  Zap,
  Star,
  Award,
  Medal,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { UserProgress } from '@/types';
import { motion } from 'framer-motion';
import { XPService } from '@/lib/services/xp.service';

interface UserProgressCardProps {
  progress: UserProgress;
}

export function UserProgressCard({ progress }: UserProgressCardProps) {
  const xpService = XPService.getInstance();
  const levelProgress = (progress.experiencePoints % 1000) / 10;
  const nextLevelXP = xpService.calculateXPToNextLevel(progress.level);

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

          {/* Header */}
          <CardHeader className='relative z-10 flex flex-row items-center space-y-0 pb-2 pt-6'>
            <div className='flex items-center space-x-2'>
              <div className='bg-primary-200/10 p-2 rounded-full'>
                <Trophy className='h-5 w-5 text-primary-200' />
              </div>
              <h3 className='text-xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent'>
                Your Progress
              </h3>
            </div>
          </CardHeader>
        </div>

        <CardContent className='relative z-10 px-6 pb-8'>
          <div className='space-y-6'>
            {/* Level Progress */}
            <div className='bg-dark-300/30 p-5 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
              <div className='flex items-center justify-between mb-4'>
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
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-3 gap-4'>
              <div className='flex flex-col items-center bg-dark-200/50 p-3 rounded-xl border border-primary-200/10 hover:border-primary-200/30 transition-colors group'>
                <div className='bg-primary-200/10 p-2 rounded-full mb-2 group-hover:bg-primary-200/20 transition-colors'>
                  <Target className='h-5 w-5 text-primary-200' />
                </div>
                <span className='text-lg font-bold text-light-100'>
                  {progress.completedInterviews}
                </span>
                <span className='text-xs text-light-100/50'>Interviews</span>
              </div>
              <div className='flex flex-col items-center bg-dark-200/50 p-3 rounded-xl border border-primary-200/10 hover:border-primary-200/30 transition-colors group'>
                <div className='bg-primary-200/10 p-2 rounded-full mb-2 group-hover:bg-primary-200/20 transition-colors'>
                  <Award className='h-5 w-5 text-primary-200' />
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

            {/* Achievements */}
            {progress.achievements && progress.achievements.length > 0 && (
              <div className='bg-dark-300/30 p-5 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
                <h4 className='font-medium text-primary-200 mb-3 flex items-center gap-2'>
                  <span className='w-1 h-4 bg-primary-200 rounded-full'></span>
                  Achievements
                </h4>
                <div className='grid grid-cols-1 gap-3'>
                  {progress.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className='group flex flex-col space-y-2 bg-dark-200/50 p-4 rounded-xl border border-primary-200/10 hover:border-primary-200/30 transition-colors'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                          <div className='bg-primary-200/10 p-2 rounded-full group-hover:bg-primary-200/20 transition-colors'>
                            {achievement.type === 'interview_count' ? (
                              <Target className='h-4 w-4 text-primary-200' />
                            ) : achievement.type === 'score_threshold' ? (
                              <Award className='h-4 w-4 text-primary-200' />
                            ) : achievement.type === 'streak' ? (
                              <Zap className='h-4 w-4 text-primary-200' />
                            ) : (
                              <Medal className='h-4 w-4 text-primary-200' />
                            )}
                          </div>
                          <div>
                            <p className='text-sm font-medium text-light-100'>
                              {achievement.name}
                            </p>
                            <p className='text-xs text-light-100/50'>
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='text-xs font-medium text-primary-200'>
                            {achievement.progress.value}/{achievement.target}
                          </span>
                          <ChevronRight className='h-4 w-4 text-primary-200/50 group-hover:text-primary-200 transition-colors' />
                        </div>
                      </div>
                      <div className='w-full bg-dark-300/50 rounded-full h-1.5 overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-primary-200 to-primary-300 transition-all duration-300'
                          style={{
                            width: `${
                              (achievement.progress.value / achievement.target) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {progress.badges && progress.badges.length > 0 && (
              <div className='bg-dark-300/30 p-5 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
                <h4 className='font-medium text-primary-200 mb-3 flex items-center gap-2'>
                  <span className='w-1 h-4 bg-primary-200 rounded-full'></span>
                  Earned Badges
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {progress.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className='group relative flex flex-col items-center p-4 rounded-xl border border-primary-200/20 hover:border-primary-200/40 transition-all duration-300 bg-gradient-to-b from-dark-200/50 to-dark-300/50 hover:from-dark-200/70 hover:to-dark-300/70'
                    >
                      <div className='absolute inset-0 bg-gradient-to-b from-primary-200/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl' />
                      <div className='relative z-10 flex flex-col items-center space-y-2'>
                        <div className='bg-primary-200/10 p-3 rounded-full group-hover:bg-primary-200/20 transition-colors'>
                          <Crown className='h-6 w-6 text-primary-200' />
                        </div>
                        <div className='text-center'>
                          <p className='text-sm font-medium text-light-100'>
                            {badge.name}
                          </p>
                          <p className='text-xs text-light-100/50 mt-1'>
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
