import { motion } from 'framer-motion';
import { InterviewSuggestions } from '@/components/InterviewSuggestions';

interface InterviewSuggestionsSectionProps {
  userId: string;
}

const InterviewSuggestionsSection = ({ userId }: InterviewSuggestionsSectionProps) => {
  return (
    <motion.section
      className='mb-12'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <InterviewSuggestions userId={userId} />
    </motion.section>
  );
};

export default InterviewSuggestionsSection; 