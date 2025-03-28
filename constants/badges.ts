import { Interview } from '@/types';

export const BADGES = [
  {
    id: 'badge-1',
    name: 'First Step',
    description: 'Completed your first interview',
    icon: '👣',
    type: 'interview_count',
    condition: (completed: number) => completed >= 1,
  },
  {
    id: 'badge-2',
    name: 'Enthusiast',
    description: 'Completed 5 interviews',
    icon: '🎯',
    type: 'interview_count',
    condition: (completed: number) => completed >= 5,
  },
  {
    id: 'badge-3',
    name: 'Interview Master',
    description: 'Completed 10 interviews',
    icon: '🏆',
    type: 'interview_count',
    condition: (completed: number) => completed >= 10,
  },
  {
    id: 'badge-4',
    name: 'Grind Guru',
    description: 'Completed 30 interviews',
    icon: '🚀',
    type: 'interview_count',
    condition: (completed: number) => completed >= 30,
  },
  {
    id: 'badge-5',
    name: 'Perfect Scorer',
    description: 'Scored 100% in an interview',
    icon: '💯',
    type: 'score_threshold',
    condition: (_: number, __: number, interviews: Interview[]) =>
      interviews.some((i) => i.feedback?.totalScore === 100),
  },
  {
    id: 'badge-6',
    name: 'Double Perfection',
    description: 'Two perfect scores',
    icon: '⚡',
    type: 'score_threshold',
    condition: (_: number, __: number, interviews: Interview[]) =>
      interviews.filter((i) => i.feedback?.totalScore === 100).length >= 2,
  },
  {
    id: 'badge-7',
    name: 'High Scorer',
    description: 'Average score above 90%',
    icon: '📈',
    type: 'average_score',
    condition: (_: number, __: number, interviews: Interview[]) => {
      const scores = interviews.map((i) => i.feedback?.totalScore || 0);
      const avg = scores.length
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
      return avg >= 90;
    },
  },
  {
    id: 'badge-8',
    name: 'Try Harder',
    description: '3 interviews under 50% score',
    icon: '😅',
    type: 'low_score',
    condition: (_: number, __: number, interviews: Interview[]) =>
      interviews.filter((i) => (i.feedback?.totalScore || 0) < 50).length >= 3,
  },
  {
    id: 'badge-9',
    name: 'Redemption Arc',
    description: 'Came back from failure to success',
    icon: '🔁',
    type: 'score_comeback',
    condition: (_: number, __: number, interviews: Interview[]) => {
      const lowScoreDates = interviews
        .filter((i) => (i.feedback?.totalScore || 0) < 50)
        .map((i) => i.createdAt);
      return interviews.some(
        (i) =>
          (i.feedback?.totalScore || 0) >= 90 &&
          lowScoreDates.some((d) => i.createdAt > d)
      );
    },
  },
  {
    id: 'badge-10',
    name: 'Consistency Beast',
    description: 'Completed interviews for 4 weeks',
    icon: '📆',
    type: 'weekly_activity',
    condition: (_: number, __: number, interviews: Interview[]) => {
      const weeks = new Set(
        interviews.map((i) => {
          const d = new Date(i.createdAt);
          return `${d.getFullYear()}-W${Math.ceil(
            (d.getDate() + 6 - d.getDay()) / 7
          )}`;
        })
      );
      return weeks.size >= 4;
    },
  },
];
