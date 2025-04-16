import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InterviewCard from '@/components/InterviewCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { InterviewCardProps } from '@/types';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface InterviewsSectionProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  isLoading: boolean;
  interviews: InterviewCardProps[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStartInterview?: () => void;
  userId?: string;
  emptyStateIcon?: React.ElementType;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateActionText?: string;
  emptyStateActionHref?: string;
  showPagination?: boolean;
  delay?: number;
}

const InterviewsSection = ({
  title,
  subtitle,
  icon: Icon,
  isLoading,
  interviews,
  currentPage,
  totalPages,
  onPageChange,
  onStartInterview,
  userId,
  emptyStateIcon: EmptyStateIcon = MessageSquare,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionText,
  emptyStateActionHref,
  showPagination = true,
  delay = 0.2,
}: InterviewsSectionProps) => {
  const hasInterviews = interviews.length > 0;

  if (isLoading) {
    return (
      <motion.section
        className='mb-16'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <div className='flex items-center justify-between mb-8'>
          <div>
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-64' />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, index) => (
            <div key={index} className='space-y-4'>
              <Skeleton className='h-48 w-full rounded-lg' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className='mb-16'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h2 className='text-3xl font-bold flex items-center gap-2'>
            <Icon className='w-6 h-6 text-primary-200' />
            {title}
          </h2>
          <p className='text-light-100/70 mt-1'>{subtitle}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {hasInterviews ? (
          interviews.map((interview, index) => (
            <motion.div
              key={interview.id}
              className='transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-200/5'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <InterviewCard {...interview} userId={userId} />
            </motion.div>
          ))
        ) : (
          <motion.div
            className='col-span-full flex flex-col items-center justify-center p-12 bg-dark-200/50 rounded-2xl border border-primary-200/10'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className='w-20 h-20 bg-primary-200/10 rounded-full flex items-center justify-center mb-6'>
              <EmptyStateIcon className='w-10 h-10 text-primary-200' />
            </div>
            <p className='text-lg text-light-100/70 mb-4'>{emptyStateTitle}</p>
            <p className='text-sm text-light-100/50 mb-6 text-center max-w-md'>
              {emptyStateDescription}
            </p>
            {emptyStateActionText &&
              (onStartInterview ? (
                <Button
                  onClick={onStartInterview}
                  className='btn-primary group'
                >
                  {emptyStateActionText}
                  <ArrowRight className='w-4 h-4 ml-2 transition-transform group-hover:translate-x-1' />
                </Button>
              ) : emptyStateActionHref ? (
                <Button asChild className='btn-secondary group'>
                  <Link
                    href={emptyStateActionHref}
                    className='flex items-center gap-2'
                  >
                    {emptyStateActionText}
                    <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                  </Link>
                </Button>
              ) : null)}
          </motion.div>
        )}
      </div>

      {showPagination && totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={cn(
                    'transition-opacity',
                    currentPage === 1 && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                      className='transition-all duration-200'
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={cn(
                    'transition-opacity',
                    currentPage === totalPages &&
                      'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </motion.section>
  );
};

export default InterviewsSection;
