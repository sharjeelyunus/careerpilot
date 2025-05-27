import { Card } from '@/components/ui/card';
import {
  PerformanceData,
  ProgressData,
  SkillData,
} from '@/lib/services/analytics.service';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface AnalyticsGraphProps {
  progressData: ProgressData[];
  performanceData: PerformanceData[];
  skillData: SkillData[];
}

type GraphType = 'volume' | 'score' | 'performance' | 'skills';

const AnalyticsGraph = ({
  progressData,
  performanceData,
  skillData,
}: AnalyticsGraphProps) => {
  const [selectedGraph, setSelectedGraph] = useState<GraphType>('score');

  // Helper function to format week key (YYYY-WW) to a readable string
  const formatWeekLabel = (weekKey: unknown) => {
    if (typeof weekKey !== 'string') return '';
    const parts = weekKey.split('-');
    if (parts.length !== 2) return weekKey as string;
    const [year, week] = parts;
    if (!year || !week || isNaN(parseInt(year)) || isNaN(parseInt(week))) {
      return weekKey as string;
    }
    return `W${week}, ${year}`;
  };

  const renderGraph = () => {
    switch (selectedGraph) {
      case 'volume':
        return (
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis
                  dataKey='week'
                  stroke='#9CA3AF'
                  tickFormatter={formatWeekLabel}
                />
                <YAxis stroke='#9CA3AF' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6',
                  }}
                  labelFormatter={formatWeekLabel}
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'interviews' ? 'Interviews' : name,
                  ]}
                />
                <Area
                  type='monotone'
                  dataKey='interviews'
                  stroke='#6366F1'
                  fill='#6366F1'
                  fillOpacity={0.2}
                  name='Interviews'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      case 'score':
        return (
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis
                  dataKey='week'
                  stroke='#9CA3AF'
                  tickFormatter={formatWeekLabel}
                />
                <YAxis stroke='#9CA3AF' domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6',
                  }}
                  labelFormatter={formatWeekLabel}
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name === 'score' ? 'Average Score' : name,
                  ]}
                />
                <Line
                  type='monotone'
                  dataKey='score'
                  stroke='#10B981'
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                  name='Average Score'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'performance':
        return (
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis
                  dataKey='week'
                  stroke='#9CA3AF'
                  tickFormatter={formatWeekLabel}
                />
                <YAxis stroke='#9CA3AF' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6',
                  }}
                  labelFormatter={formatWeekLabel}
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'score' ? 'Score' : name,
                  ]}
                />
                <Line
                  type='monotone'
                  dataKey='score'
                  stroke='#6366F1'
                  strokeWidth={2}
                  dot={{ fill: '#6366F1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'skills':
        if (!skillData || skillData.length === 0) {
          return (
            <div className='h-[300px] flex items-center justify-center'>
              <p className="text-light-100/70">No feedback data available yet. Complete interviews with feedback to see your skill breakdown.</p>
            </div>
          );
        }
        return (
          <div className='h-[300px]'>
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
        );
      default:
        return null;
    }
  };

  const getGraphTitle = () => {
    switch (selectedGraph) {
      case 'volume':
        return 'Interview Volume Over Time';
      case 'score':
        return 'Average Score Over Time';
      case 'performance':
        return 'Performance Trends';
      case 'skills':
        return 'Feedback Breakdown';
      default:
        return '';
    }
  };

  return (
    <Card className='p-6 dark-gradient'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-semibold text-light-100'>
          {getGraphTitle()}
        </h3>
        <Select
          value={selectedGraph}
          onValueChange={(value: GraphType) => setSelectedGraph(value)}
        >
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Select graph' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='volume'>Interview Volume</SelectItem>
            <SelectItem value='score'>Average Score</SelectItem>
            <SelectItem value='performance'>Performance Trends</SelectItem>
            <SelectItem value='skills'>Feedback Breakdown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderGraph()}
    </Card>
  );
};

export default AnalyticsGraph; 