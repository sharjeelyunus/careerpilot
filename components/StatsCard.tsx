'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  progress?: number;
  progressMax?: number;
  progressLabel?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <motion.div
      className='flex items-center gap-3 bg-dark-300/20 rounded-xl p-4 border border-primary-200/10 hover:border-primary-200/20 transition-all duration-300'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className='w-12 h-12 bg-primary-200/10 rounded-full flex items-center justify-center'>
        <Icon className='w-6 h-6 text-primary-200' />
      </div>
      <div className='flex-1'>
        <p className='text-sm text-light-100/70'>{title}</p>
        <motion.p
          className='text-xl font-bold'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
