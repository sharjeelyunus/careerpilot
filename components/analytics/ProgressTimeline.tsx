import {
  PerformanceData,
  ProgressData,
  SkillData,
} from '@/lib/services/analytics.service';
import AnalyticsGraph from './AnalyticsGraph';

interface ProgressTimelineProps {
  progressData: ProgressData[];
  performanceData: PerformanceData[];
  skillData: SkillData[];
}

const ProgressTimeline = ({
  progressData,
  performanceData,
  skillData,
}: ProgressTimelineProps) => {
  return (
    <div className='space-y-6'>
      <AnalyticsGraph
        progressData={progressData}
        performanceData={performanceData}
        skillData={skillData}
      />
    </div>
  );
};

export default ProgressTimeline;
