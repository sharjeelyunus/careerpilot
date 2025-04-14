import { motion } from 'framer-motion';
import { Sparkles, Plus, Trophy, Clock } from 'lucide-react';
import QuickActionCard from '@/components/QuickActionCard';

interface QuickActionsSectionProps {
  onStartInterview: () => void;
}

const QuickActionsSection = ({ onStartInterview }: QuickActionsSectionProps) => {
  return (
    <motion.section
      className='mb-12'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
        <Sparkles className='w-5 h-5 text-primary-200' />
        Quick Actions
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <QuickActionCard
          title='Start Interview'
          description='Begin a new practice session'
          icon={Plus}
          onClick={onStartInterview}
          className='bg-gradient-to-br from-primary-200/20 to-primary-300/10 hover:from-primary-200/30 hover:to-primary-300/20'
        />

        <QuickActionCard
          title='Leaderboard'
          description='See top performers'
          icon={Trophy}
          href='/leaderboard'
          className='bg-gradient-to-br from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20'
        />

        <QuickActionCard
          title='Interview History'
          description='View your past interviews'
          icon={Clock}
          href='/interview-history'
          className='bg-gradient-to-br from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 hover:to-blue-600/20'
        />
      </div>
    </motion.section>
  );
};

export default QuickActionsSection; 