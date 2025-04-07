'use client';

import dayjs from 'dayjs';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { SiLevelsdotfyi } from 'react-icons/si';
import { InterviewCardProps } from '@/types';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Star,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  MessageSquare,
} from 'lucide-react';

const InterviewCard = React.memo(
  ({
    id,
    role,
    userId,
    type,
    techstack,
    createdAt,
    level,
    feedback,
  }: InterviewCardProps) => {
    const normalizedType = useMemo(
      () => (/mix/gi.test(type) ? 'Mixed' : type),
      [type]
    );

    const formattedDate = useMemo(
      () => dayjs(feedback?.createdAt || createdAt).format('MMM D, YYYY'),
      [feedback?.createdAt, createdAt]
    );

    const truncatedAssessment = useMemo(() => {
      if (!feedback?.finalAssessment) {
        return "You haven't taken the interview yet. Take it now to improve your skills.";
      }
      return feedback.finalAssessment.length > 100
        ? feedback.finalAssessment.slice(0, 100) + '...'
        : feedback.finalAssessment;
    }, [feedback?.finalAssessment]);

    const interviewLink = useMemo(() => {
      if (!userId) return 'sign-in';
      return feedback ? `/interview/${id}/feedback` : `/interview/${id}`;
    }, [userId, feedback, id]);

    const status = useMemo(() => {
      if (feedback) return 'completed';
      return 'available';
    }, [feedback]);

    const statusColor = useMemo(() => {
      return status === 'completed'
        ? 'bg-green-500/20 text-green-400'
        : 'bg-primary-200/20 text-primary-200';
    }, [status]);

    const statusIcon = useMemo(() => {
      return status === 'completed' ? (
        <CheckCircle className='w-4 h-4' />
      ) : (
        <PlayCircle className='w-4 h-4' />
      );
    }, [status]);

    const statusText = useMemo(() => {
      return status === 'completed' ? 'Completed' : 'Available';
    }, [status]);

    const scoreColor = useMemo(() => {
      if (!feedback?.totalScore) return 'text-light-100/70';
      const score = feedback.totalScore;
      if (score >= 80) return 'text-green-400';
      if (score >= 60) return 'text-yellow-400';
      return 'text-red-400';
    }, [feedback?.totalScore]);

    return (
      <motion.div
        className='w-full h-full overflow-hidden rounded-xl bg-dark-200/30 border border-primary-200/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary-200/5 hover:border-primary-200/30 flex flex-col'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='relative flex flex-col h-full'>
          {/* Header with gradient background */}
          <div className='h-24 bg-gradient-to-r from-dark-300 to-dark-200 relative overflow-hidden flex-shrink-0'>
            <div className='absolute inset-0 bg-[url("/pattern.png")] opacity-10' />
            <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-xl' />

            {/* Status Badge */}
            <div
              className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full ${statusColor} text-xs font-medium backdrop-blur-sm`}
            >
              {statusIcon}
              <span>{statusText}</span>
            </div>

            {/* Type Badge */}
            <div className='absolute top-4 left-4 px-3 py-1 rounded-full bg-light-600/10 text-light-100/90 text-xs font-medium backdrop-blur-sm'>
              {normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)}
            </div>

            {/* Role Title */}
            <div className='absolute bottom-4 left-4 right-4'>
              <h3 className='text-xl font-bold capitalize text-light-100 truncate' title={role}>
                {role}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className='p-6 flex flex-col flex-grow'>
            {/* Metadata */}
            <div className='flex flex-wrap gap-4 mb-4'>
              <div className='flex items-center gap-1.5 text-light-100/70 bg-dark-300/50 px-3 py-1.5 rounded-full'>
                <SiLevelsdotfyi size={16} className='text-primary-200' />
                <span className='text-sm font-medium'>{level}</span>
              </div>
              <div className='flex items-center gap-1.5 text-light-100/70 bg-dark-300/50 px-3 py-1.5 rounded-full'>
                <Calendar size={16} className='text-primary-200' />
                <span className='text-sm font-medium'>{formattedDate}</span>
              </div>
              {feedback && (
                <div
                  className={`flex items-center gap-1.5 ${scoreColor} bg-dark-300/50 px-3 py-1.5 rounded-full`}
                >
                  <Star size={16} className='text-current' />
                  <span className='text-sm font-medium'>
                    {feedback.totalScore || '---'}/100
                  </span>
                </div>
              )}
            </div>

            {/* Assessment */}
            <div className='mb-6 bg-dark-300/30 p-4 rounded-lg border border-primary-200/10 flex-grow'>
              <p className='text-light-100/80 line-clamp-2'>
                {truncatedAssessment}
              </p>
            </div>

            {/* Tech Stack */}
            <div className='mb-6'>
              <DisplayTechIcons techStack={techstack} />
            </div>

            {/* Action Button */}
            <div className='flex justify-end mt-auto'>
              <Button
                className={`group flex items-center gap-2 ${
                  status === 'completed'
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                    : 'bg-primary-200/20 hover:bg-primary-200/30 text-primary-200 border border-primary-200/30'
                }`}
              >
                <Link href={interviewLink} className='flex items-center gap-2'>
                  {feedback ? (
                    <>
                      <MessageSquare className='w-4 h-4' />
                      <span>View Feedback</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className='w-4 h-4' />
                      <span>Start Interview</span>
                    </>
                  )}
                  <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

InterviewCard.displayName = 'InterviewCard';

export default InterviewCard;
