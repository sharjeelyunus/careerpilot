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
  comingSoon?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  className,
  comingSoon = false,
}) => {
  const CardContent = () => (
    <div className='flex flex-col gap-4 h-full'>
      <div className='flex items-center gap-2 justify-between'>
        <div className='w-12 h-12 bg-primary-200/10 rounded-full flex items-center justify-center group-hover:bg-primary-200/20 transition-colors'>
          <Icon className='w-6 h-6 text-primary-200' />
        </div>
        {comingSoon && (
          <span className='text-xs font-medium px-2 py-0.5 bg-primary-200/10 text-primary-200 rounded-full'>
            Coming Soon
          </span>
        )}
      </div>
      <div className='space-y-1.5'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-semibold text-light-100'>{title}</h3>
        </div>
        <p className='text-sm text-light-100/70'>{description}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      className={`bg-dark-200/50 backdrop-blur-sm rounded-2xl p-6 border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300 cursor-pointer group relative overflow-hidden min-h-[160px] ${
        comingSoon ? 'opacity-80 hover:opacity-90' : ''
      } ${className || ''}`}
      whileHover={!comingSoon ? { y: -5 } : undefined}
      whileTap={!comingSoon ? { scale: 0.98 } : undefined}
      onClick={!comingSoon ? onClick : undefined}
    >
      {/* Background gradient effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary-200/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      {/* Pattern overlay */}
      <div className='absolute inset-0 bg-[url("/pattern.png")] opacity-0 group-hover:opacity-5 transition-opacity duration-300' />

      {/* Content */}
      <div className='relative z-10 h-full'>
        {href && !comingSoon ? (
          <Link href={href} className='block h-full'>
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
