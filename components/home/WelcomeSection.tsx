import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock } from 'lucide-react';
import StatsCard from '@/components/StatsCard';

interface WelcomeSectionProps {
  userName: string;
  totalUserInterviews: number;
  totalLatestInterviews: number;
  progressPercentage: number;
  hasPastInterviews: boolean;
}

const WelcomeSection = ({
  userName,
  totalUserInterviews,
  totalLatestInterviews,
  progressPercentage,
  hasPastInterviews,
}: WelcomeSectionProps) => {
  // Get current time for personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.section
      className='mb-12 bg-gradient-to-br from-dark-300 to-dark-100 rounded-3xl p-8 md:p-12 relative overflow-hidden'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
      <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-3xl' />
      <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/20 to-transparent blur-3xl' />

      <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
        <div className='flex flex-col gap-4 max-w-2xl'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-primary-200/10 rounded-full flex items-center justify-center'>
              <Sparkles className='w-6 h-6 text-primary-200' />
            </div>
            <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent'>
              {getGreeting()}, {userName || 'Interviewer'}!
            </h1>
          </div>
          <p className='text-lg text-light-100/90'>
            {hasPastInterviews
              ? `You've completed ${totalUserInterviews} interviews. Keep up the great work!`
              : 'Start your interview preparation journey with our AI-powered platform.'}
          </p>

          {/* Progress Overview */}
          <div className='mt-4 bg-dark-200/30 rounded-xl p-4 border border-primary-200/10'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-light-100/70'>
                Your Progress
              </span>
              <span className='text-sm font-bold text-primary-200'>
                {progressPercentage}%
              </span>
            </div>
            <div className='w-full h-2 bg-dark-300 rounded-full overflow-hidden'>
              <motion.div
                className='h-full bg-gradient-to-r from-primary-200 to-primary-300 rounded-full'
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 p-6 w-full md:w-auto'>
          <StatsCard
            title='Your Interviews'
            value={totalUserInterviews}
            icon={Calendar}
          />
          <StatsCard
            title='Available Interviews'
            value={totalLatestInterviews}
            icon={Clock}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default WelcomeSection; 