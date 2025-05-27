import { motion } from 'framer-motion';
import { Sparkles, Plus, Trophy, Clock, Code2 } from 'lucide-react';
import QuickActionCard from '@/components/QuickActionCard';
import { FEATURE_FLAGS } from '@/lib/config/featureFlags';

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
      <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
        <Sparkles className='w-5 h-5 text-primary-200' />
        Quick Actions
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <QuickActionCard
          title='Start Interview'
          description='Begin a new practice session'
          icon={Plus}
          onClick={onStartInterview}
          className='bg-gradient-to-br from-primary-200/20 via-primary-300/15 to-primary-300/10 hover:from-primary-200/30 hover:via-primary-300/20 hover:to-primary-300/15'
        />

        <QuickActionCard
          title='Technical Challenges'
          description='Practice coding problems'
          icon={Code2}
          href={FEATURE_FLAGS.TECHNICAL_CHALLENGES ? '/challenges' : undefined}
          onClick={!FEATURE_FLAGS.TECHNICAL_CHALLENGES ? () => {} : undefined}
          className='bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-600/10 hover:from-blue-500/30 hover:via-blue-600/20 hover:to-blue-600/15'
          comingSoon={!FEATURE_FLAGS.TECHNICAL_CHALLENGES}
        />

        <QuickActionCard
          title='Leaderboard'
          description='See top performers'
          icon={Trophy}
          href='/leaderboard'
          className='bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-amber-600/10 hover:from-amber-500/30 hover:via-amber-600/20 hover:to-amber-600/15'
        />

        <QuickActionCard
          title='Interview History'
          description='View your past interviews'
          icon={Clock}
          href='/interview-history'
          className='bg-gradient-to-br from-indigo-500/20 via-indigo-600/15 to-indigo-600/10 hover:from-indigo-500/30 hover:via-indigo-600/20 hover:to-indigo-600/15'
        />
      </div>
    </motion.section>
  );
};

export default QuickActionsSection; 