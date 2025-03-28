import { Interview } from '@/types';

export const ACHIEVEMENTS = [
  {
    id: 'achievement-1',
    name: 'First Step',
    description: 'Complete your first interview',
    target: 1,
    type: 'interview_count',
    getProgress: (completed: number) => completed,
    isCompleted: (completed: number) => completed >= 1,
  },
  {
    id: 'achievement-2',
    name: 'Interview Enthusiast',
    description: 'Complete 5 interviews',
    target: 5,
    type: 'interview_count',
    getProgress: (completed: number) => completed,
    isCompleted: (completed: number) => completed >= 5,
  },
  {
    id: 'achievement-3',
    name: 'Interview Master',
    description: 'Complete 10 interviews',
    target: 10,
    type: 'interview_count',
    getProgress: (completed: number) => completed,
    isCompleted: (completed: number) => completed >= 10,
  },
  {
    id: 'achievement-4',
    name: 'Grind Guru',
    description: 'Complete 30 interviews',
    target: 30,
    type: 'interview_count',
    getProgress: (completed: number) => completed,
    isCompleted: (completed: number) => completed >= 30,
  },
  {
    id: 'achievement-5',
    name: 'Perfect Score',
    description: 'Get a 100% score in an interview',
    target: 1,
    type: 'score_threshold',
    getProgress: (_: number, interviews: Interview[]) =>
      interviews.some((i) => i.feedback?.totalScore === 100) ? 1 : 0,
    isCompleted: (_: number, interviews: Interview[]) =>
      interviews.some((i) => i.feedback?.totalScore === 100),
  },
  {
    id: 'achievement-6',
    name: 'Double Perfection',
    description: 'Get 100% score in 2 interviews',
    target: 2,
    type: 'score_threshold',
    getProgress: (_: number, interviews: Interview[]) =>
      interviews.filter((i) => i.feedback?.totalScore === 100).length,
    isCompleted: (_: number, interviews: Interview[]) =>
      interviews.filter((i) => i.feedback?.totalScore === 100).length >= 2,
  },
  {
    id: 'achievement-7',
    name: 'High Scorer',
    description: 'Average score above 90%',
    target: 90,
    type: 'average_score',
    getProgress: (_: number, interviews: Interview[]) => {
      const scores = interviews.map((i) => i.feedback?.totalScore || 0);
      return scores.length
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    },
    isCompleted: (_: number, interviews: Interview[]) => {
      const scores = interviews.map((i) => i.feedback?.totalScore || 0);
      const avg = scores.length
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
      return avg >= 90;
    },
  },
  {
    id: 'achievement-8',
    name: 'Try Harder',
    description: 'Get 3 interviews with a score below 50%',
    target: 3,
    type: 'low_score',
    getProgress: (_: number, interviews: Interview[]) =>
      interviews.filter((i) => (i.feedback?.totalScore || 0) < 50).length,
    isCompleted: (_: number, interviews: Interview[]) =>
      interviews.filter((i) => (i.feedback?.totalScore || 0) < 50).length >= 3,
  },
  {
    id: 'achievement-9',
    name: 'Redemption Arc',
    description: 'Improve from below 50% to 90%+ in a later interview',
    target: 1,
    type: 'score_comeback',
    getProgress: (_: number, interviews: Interview[]) => {
      const lowScoreDates = interviews
        .filter((i) => (i.feedback?.totalScore || 0) < 50)
        .map((i) => i.createdAt);
      const hasComeback = interviews.some(
        (i) =>
          (i.feedback?.totalScore || 0) >= 90 &&
          lowScoreDates.some((d) => i.createdAt > d)
      );
      return hasComeback ? 1 : 0;
    },
    isCompleted: (_: number, interviews: Interview[]) => {
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
    id: 'achievement-10',
    name: 'Consistency Beast',
    description: 'Complete at least one interview every week for 4 weeks',
    target: 4,
    type: 'weekly_activity',
    getProgress: (_: number, interviews: Interview[]) => {
      const weeks = new Set(
        interviews.map((i) => {
          const d = new Date(i.createdAt);
          return `${d.getFullYear()}-W${Math.ceil(
            (d.getDate() + 6 - d.getDay()) / 7
          )}`;
        })
      );
      return weeks.size;
    },
    isCompleted: (_: number, interviews: Interview[]) => {
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
