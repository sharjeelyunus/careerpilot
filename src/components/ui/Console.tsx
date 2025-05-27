/**
 * @file Console.tsx
 * @description A UI component for displaying formatted output, errors, and execution time, resembling a terminal console.
 *
 * @module components/ui/Console
 *
 * @param {string} output - The main output string to display. Can contain newline characters.
 * @param {string | null} error - An error string to display. If provided, it's shown below the main output, styled as an error.
 * @param {number} executionTime - The execution time in milliseconds, displayed in the console header.
 * @param {string} [className] - Optional additional CSS classes for the root element.
 *
 * @returns {JSX.Element | null} The Console component. Returns null if both output and error are empty.
 *
 * @example
 * <Console output="Hello\nWorld" error={null} executionTime={123.45} />
 * <Console output="" error="An error occurred" executionTime={10.0} />
 *
 * @version 1.0.0
 * @date 2023-10-27 (Placeholder, actual date may vary)
 *
 * @note Uses framer-motion for entry animation. Line numbers are displayed for output and error messages.
 */

'use client';

// React/Next.js
import React from 'react';

// External Libraries
import { Clock, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

// Type Definitions
interface ConsoleProps {
  output: string;
  error: string | null;
  executionTime: number;
  className?: string;
}

export function Console({
  output,
  error,
  executionTime,
  className = '',
}: ConsoleProps): JSX.Element | null {
  const formatOutput = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className='flex'>
        <span className='select-none text-light-100/30 w-8 text-right mr-4 border-r border-primary-200/10 pr-2'>
          {index + 1}
        </span>
        <span className='flex-1'>{line || ' '}</span> {/* Ensure non-empty content for flex item */}
      </div>
    ));
  };

  // Do not render if there's nothing to show
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
        {executionTime >= 0 && ( // Only show execution time if it's valid
          <div className='flex items-center gap-2'>
            <Clock className='w-3 h-3 text-light-100/50' />
            <span className='text-xs text-light-100/50'>
              {executionTime.toFixed(2)}ms
            </span>
          </div>
        )}
      </div>
      {/* Console Content Area */}
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