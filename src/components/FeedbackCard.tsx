import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface FeedbackCardProps {
  id: string;
  date: string;
  role: string;
  type: string;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  keyTakeaways: string[];
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  id,
  date,
  role,
  type,
  overallScore,
  strengths,
}) => {
  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Calculate progress percentage for the score
  const scorePercentage = (overallScore / 100) * 100;

  return (
    <Link
      href={`/interview/${id}/feedback`}
      aria-label={`View feedback for ${role} interview`}
    >
      <motion.div
        className='bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300 h-full relative overflow-hidden group flex flex-col'
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Decorative element */}
        <div className='absolute top-0 right-0 w-24 h-24 bg-primary-200/5 rounded-bl-full -z-10 group-hover:bg-primary-200/10 transition-all duration-300'></div>
        
        <div className="flex-1">
          {/* Header Section */}
          <div className='flex items-start justify-between mb-5'>
            <div>
              <h3 className='text-xl font-semibold text-light-100 mb-1'>
                {role}
              </h3>
              <p className='text-light-100/70 text-sm'>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </p>
            </div>
            <div className='flex flex-col items-end'>
              <div
                className={`flex items-center gap-1.5 bg-primary-200/10 px-3 py-1.5 rounded-full ${getScoreColor(
                  overallScore
                )}`}
              >
                <Star className='w-4 h-4' />
                <span className='font-medium'>{overallScore}/100</span>
              </div>
              {/* Score progress bar */}
              <div className='w-16 h-1.5 bg-dark-100/30 rounded-full mt-2 overflow-hidden'>
                <div
                  className={`h-full ${getScoreColor(overallScore)} bg-current`}
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className='flex items-center gap-4 mb-5 text-sm text-light-100/70'>
            <div className='flex items-center gap-1.5 bg-dark-100/20 px-3 py-1.5 rounded-full'>
              <Calendar className='w-4 h-4' />
              <span>{date}</span>
            </div>
          </div>

          {/* Preview of Strengths */}
          <div className='text-sm text-light-100/80'>
            <p className='text-primary-200/80 mb-3 font-medium flex items-center gap-1.5'>
              <CheckCircle2 className='w-4 h-4' />
              Key Strengths:
            </p>
            <ul className='space-y-2'>
              {strengths.slice(0, 2).map((strength, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <span className='text-primary-200/60 mt-1'>•</span>
                  <span className='line-clamp-2'>{strength}</span>
                </li>
              ))}
              {strengths.length > 2 && (
                <li className='text-primary-200/60 flex items-center gap-1.5'>
                  <span>+ {strengths.length - 2} more</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* View details indicator */}
        <div className='mt-5 pt-4 border-t border-primary-200/10 flex items-center justify-end text-primary-200/60 text-sm'>
          <span>View details</span>
          <ChevronRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
        </div>
      </motion.div>
    </Link>
  );
};

export default FeedbackCard;
