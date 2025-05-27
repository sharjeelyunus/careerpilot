import { Card } from '@/components/ui/card';
import { SkillData } from '@/lib/services/analytics.service';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SkillBreakdownProps {
  skillData: SkillData[];
}

const SkillBreakdown = ({ skillData }: SkillBreakdownProps) => {
  if (!skillData || skillData.length === 0) {
    return (
      <Card className='p-6 dark-gradient text-center'>
        <h3 className='text-xl font-semibold text-light-100 mb-4'>Feedback Breakdown</h3>
        <p className="text-light-100/70">No feedback data available yet. Complete interviews with feedback to see your skill breakdown.</p>
      </Card>
    );
  }

  return (
    <Card className='p-6 dark-gradient'>
      <h3 className='text-xl font-semibold text-light-100 mb-4'>Feedback Breakdown</h3>
      <div className='h-[400px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="80%" 
            data={skillData}
          >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey='name' stroke="#9CA3AF" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" />
            <Radar
              name='Score'
              dataKey='value'
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.6}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6',
              }}
              formatter={(value: number) => [`${value}%`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SkillBreakdown; 