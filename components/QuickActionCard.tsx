'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  className,
}) => {
  const CardContent = () => (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 bg-primary-200/10 rounded-full flex items-center justify-center group-hover:bg-primary-200/20 transition-colors'>
        <Icon className='w-6 h-6 text-primary-200' />
      </div>
      <div>
        <h3 className='font-medium text-light-100'>{title}</h3>
        <p className='text-sm text-light-100/70'>{description}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      className={`bg-dark-200/30 rounded-xl p-5 border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300 cursor-pointer group relative overflow-hidden ${className || ''}`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Background gradient effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary-200/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      
      {/* Pattern overlay */}
      <div className='absolute inset-0 bg-[url("/pattern.png")] opacity-0 group-hover:opacity-5 transition-opacity duration-300' />
      
      {/* Content */}
      <div className='relative z-10'>
        {href ? (
          <Link href={href} className='block'>
            <CardContent />
          </Link>
        ) : (
          <CardContent />
        )}
      </div>
    </motion.div>
  );
};

export default QuickActionCard; 