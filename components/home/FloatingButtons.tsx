import { motion } from 'framer-motion';
import { Plus, ChevronUp } from 'lucide-react';

interface FloatingButtonsProps {
  showScrollTop: boolean;
  onStartInterview: () => void;
}

const FloatingButtons = ({ showScrollTop, onStartInterview }: FloatingButtonsProps) => {
  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className='fixed bottom-6 right-6 w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center shadow-lg shadow-primary-200/20 hover:bg-primary-300 transition-colors z-50'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={onStartInterview}
      >
        <Plus className='w-6 h-6 text-dark-300' />
      </motion.button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          className='fixed bottom-6 left-6 w-12 h-12 bg-dark-200 rounded-full flex items-center justify-center shadow-lg shadow-dark-300/20 hover:bg-dark-100 transition-colors z-50'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='w-6 h-6 text-light-100' />
        </motion.button>
      )}
    </>
  );
};

export default FloatingButtons; 