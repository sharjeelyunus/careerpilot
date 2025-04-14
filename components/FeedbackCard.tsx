import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star } from 'lucide-react';
import Link from 'next/link';

interface FeedbackCardProps {
  id: string;
  date: string;
  duration: string;
  role: string;
  company: string;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  keyTakeaways: string[];
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  id,
  date,
  duration,
  role,
  company,
  overallScore,
  strengths,
}) => {
  return (
    <Link href={`/interview/${id}/feedback`}>
      <motion.div
        className="bg-dark-200/30 rounded-2xl p-6 border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300 h-full"
        whileHover={{ y: -5 }}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-light-100 mb-1">{role}</h3>
            <p className="text-light-100/70">{company}</p>
          </div>
          <div className="flex items-center gap-2 bg-primary-200/10 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-primary-200" />
            <span className="text-primary-200 font-medium">{overallScore}/10</span>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center gap-4 mb-4 text-sm text-light-100/70">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>

        {/* Preview of Strengths */}
        <div className="text-sm text-light-100/80">
          <p className="text-primary-200/80 mb-2">Key Strengths:</p>
          <ul className="list-disc list-inside space-y-1">
            {strengths.slice(0, 2).map((strength, index) => (
              <li key={index} className="truncate">{strength}</li>
            ))}
            {strengths.length > 2 && (
              <li className="text-primary-200/60">+ {strengths.length - 2} more</li>
            )}
          </ul>
        </div>
      </motion.div>
    </Link>
  );
};

export default FeedbackCard; 