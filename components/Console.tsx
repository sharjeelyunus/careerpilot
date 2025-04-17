'use client';

import { Clock, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsoleProps {
  output: string;
  error: string | null;
  executionTime: number;
  className?: string;
}

export function Console({ output, error, executionTime, className = '' }: ConsoleProps) {
  const formatOutput = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className='flex'>
        <span className='select-none text-light-100/30 w-8 text-right mr-4 border-r border-primary-200/10 pr-2'>
          {index + 1}
        </span>
        <span className='flex-1'>{line || ' '}</span>
      </div>
    ));
  };

  if (!output && !error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full bg-dark-300/50 rounded-lg border border-primary-200/20 overflow-hidden ${className}`}
    >
      <div className='flex items-center justify-between p-3 bg-dark-400/50 border-b border-primary-200/10'>
        <div className='flex items-center gap-2'>
          <Terminal className='w-4 h-4 text-primary-200' />
          <span className='text-sm font-medium text-light-100'>Console</span>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='w-3 h-3 text-light-100/50' />
          <span className='text-xs text-light-100/50'>
            {executionTime.toFixed(2)}ms
          </span>
        </div>
      </div>
      <div className='relative'>
        <div className='p-4 font-mono text-sm text-light-100/90 bg-dark-300/30 overflow-x-auto'>
          {output && (
            <div className='space-y-0.5'>
              {formatOutput(output)}
            </div>
          )}
          {error && (
            <div className='mt-2 pt-2 border-t border-red-500/20'>
              <div className='text-red-200 space-y-0.5'>
                {formatOutput(error)}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 