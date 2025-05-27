'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronUp, MessageSquarePlus, X } from 'lucide-react';
import { FeedbackDialog } from '../feedback/feedback-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingButtonsProps {
  showScrollTop: boolean;
  onStartInterview: () => void;
}

const FloatingButtons = ({ showScrollTop, onStartInterview }: FloatingButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <TooltipProvider>
      <>
        {/* Speed Dial Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/20 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              
              {/* Interview Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className="fixed bottom-24 right-6 w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center shadow-lg shadow-primary-200/20 hover:bg-primary-300 transition-colors z-50"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    onClick={() => {
                      setIsOpen(false);
                      onStartInterview();
                    }}
                  >
                    <Plus className="w-6 h-6 text-dark-300" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="left" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <p>Start New Interview</p>
                </TooltipContent>
              </Tooltip>

              {/* Feedback Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className="fixed bottom-40 right-6 w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center shadow-lg shadow-primary-200/20 hover:bg-primary-300 transition-colors z-50"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    onClick={() => {
                      setIsOpen(false);
                      setShowFeedbackDialog(true);
                    }}
                  >
                    <MessageSquarePlus className="w-6 h-6 text-dark-300" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="left" className="flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4" />
                  <p>Send Feedback</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              className="fixed bottom-6 right-6 w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center shadow-lg shadow-primary-200/20 hover:bg-primary-300 transition-colors z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggleMenu}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-dark-300" />
              ) : (
                <Plus className="w-6 h-6 text-dark-300" />
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isOpen ? 'Close Menu' : 'Open Actions Menu'}
          </TooltipContent>
        </Tooltip>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="fixed bottom-6 left-6 w-12 h-12 bg-dark-200 rounded-full flex items-center justify-center shadow-lg shadow-dark-300/20 hover:bg-dark-100 transition-colors z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <ChevronUp className="w-6 h-6 text-light-100" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Scroll to Top
            </TooltipContent>
          </Tooltip>
        )}

        {/* Feedback Dialog */}
        {showFeedbackDialog && (
          <FeedbackDialog
            open={showFeedbackDialog}
            onOpenChange={setShowFeedbackDialog}
          />
        )}
      </>
    </TooltipProvider>
  );
};

export default FloatingButtons; 