import { Interview } from '@/types';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '@/firebase/client';

// Helper function to get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Helper function to generate week key YYYY-WW
function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-${String(week).padStart(2, '0')}`;
}

export interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  practiceStreak: number;
  performanceData: PerformanceData[];
  skillData: SkillData[];
  progressData: ProgressData[];
  interviewHistory: InterviewHistoryItem[];
  techStackFrequency: TechStackFrequencyItem[];
}

export interface PerformanceData {
  week: string;
  score: number;
  questions: number;
}

export interface SkillData {
  name: string;
  value: number;
}

export interface ProgressData {
  week: string;
  interviews: number;
  score: number;
}

export interface InterviewHistoryItem {
  id: string;
  date: string;
  type: string;
  topic: string;
  score: number;
  improvement: string;
}

export interface TechStackFrequencyItem {
  name: string;
  count: number;
}

export async function fetchAnalyticsData(
  interviews: Interview[]
): Promise<AnalyticsData> {
  try {
    if (!interviews || interviews.length === 0) {
      return getEmptyAnalyticsData();
    }

    // All analytics calculations now use only completed interviews
    return calculateAnalyticsData(interviews);
  } catch (error) {
    console.error('Error calculating analytics data:', error);
    return getEmptyAnalyticsData();
  }
}

function calculateAnalyticsData(interviews: Interview[]): AnalyticsData {
  const totalInterviews = interviews.length;
  const averageScore = calculateAverageScore(interviews);
  const practiceStreak = calculatePracticeStreak(interviews);
  const performanceData = generatePerformanceData(interviews);
  const skillData = generateSkillData(interviews);
  const progressData = generateProgressData(interviews);
  const interviewHistory = generateInterviewHistory(interviews);
  const techStackFrequency = generateTechStackFrequency(interviews);
  return {
    totalInterviews,
    averageScore,
    practiceStreak,
    performanceData,
    skillData,
    progressData,
    interviewHistory,
    techStackFrequency,
  };
}

function getEmptyAnalyticsData(): AnalyticsData {
  return {
    totalInterviews: 0,
    averageScore: 0,
    practiceStreak: 0,
    performanceData: [],
    skillData: [],
    progressData: [],
    interviewHistory: [],
    techStackFrequency: [],
  };
}

function calculateAverageScore(interviews: Interview[]): number {
  if (interviews.length === 0) return 0;
  const totalScore = interviews.reduce((sum, interview) => {
    const score =
      interview.feedbacks && interview.feedbacks[0]
        ? interview.feedbacks[0].totalScore
        : 0;
    return sum + score;
  }, 0);
  return Math.round(totalScore / interviews.length);
}

function calculatePracticeStreak(interviews: Interview[]): number {
  if (interviews.length === 0) return 0;

  // filter out interviews that are not completed
  const completedInterviews = interviews.filter(
    (interview) => interview.feedbacks && interview.feedbacks.length > 0
  );

  // Sort interviews by date
  const sortedFeedbacks = [...completedInterviews].sort((a, b) => {
    const feedbacks = a.feedbacks && a.feedbacks[0] ? a.feedbacks[0] : null;
    const feedbacksB = b.feedbacks && b.feedbacks[0] ? b.feedbacks[0] : null;
    const createdAtB = feedbacksB ? new Date(feedbacksB.createdAt) : null;
    const createdAt = feedbacks ? new Date(feedbacks.createdAt) : null;
    return (createdAtB?.getTime() || 0) - (createdAt?.getTime() || 0);
  });

  // Calculate streak
  let streak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedFeedbacks.length - 1; i++) {
    const currentFeedbackDate = new Date(sortedFeedbacks[i].createdAt);
    currentFeedbackDate.setHours(0, 0, 0, 0);

    const nextFeedbackDate = new Date(sortedFeedbacks[i + 1].createdAt);
    nextFeedbackDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentFeedbackDate.getTime() - nextFeedbackDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function generatePerformanceData(interviews: Interview[]): PerformanceData[] {
  // Group interviews by week
  const interviewsByWeek: Record<string, Interview[]> = {};
  interviews.forEach((interview) => {
    const date = new Date(interview.createdAt);
    const weekKey = getWeekKey(date);
    if (!interviewsByWeek[weekKey]) {
      interviewsByWeek[weekKey] = [];
    }
    interviewsByWeek[weekKey].push(interview);
  });
  // Convert to array format
  return Object.entries(interviewsByWeek)
    .map(([week, weekInterviews]) => {
      const totalScore = weekInterviews.reduce((sum, interview) => {
        const score =
          interview.feedbacks && interview.feedbacks[0]
            ? interview.feedbacks[0].totalScore
            : 0;
        return sum + score;
      }, 0);
      const totalQuestions = weekInterviews.reduce(
        (sum, interview) => sum + (interview.questions?.length || 0),
        0
      );
      return {
        week,
        score: Math.round(totalScore / weekInterviews.length),
        questions: totalQuestions,
      };
    })
    .sort((a, b) => {
      const [yearA, weekA] = a.week.split('-').map(Number);
      const [yearB, weekB] = b.week.split('-').map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return weekA - weekB;
    });
}

function generateSkillData(interviews: Interview[]): SkillData[] {
  // Extract skills from interview feedbacks
  const skillScores: Record<string, number[]> = {};
  interviews.forEach((interview) => {
    if (
      interview.feedbacks &&
      interview.feedbacks[0] &&
      interview.feedbacks[0].categoryScores
    ) {
      interview.feedbacks[0].categoryScores.forEach(({ name, score }) => {
        if (!skillScores[name]) {
          skillScores[name] = [];
        }
        skillScores[name].push(score);
      });
    }
  });
  // Calculate average score for each skill
  return Object.entries(skillScores)
    .map(([skill, scores]) => {
      const average =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {
        name: skill,
        value: Math.round(average),
      };
    })
    .sort((a, b) => b.value - a.value);
}

function generateProgressData(interviews: Interview[]): ProgressData[] {
  // Sort interviews by date
  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA.getTime() - dateB.getTime();
  });
  // Group by week
  const interviewsByWeek: Record<string, Interview[]> = {};
  sortedInterviews.forEach((interview) => {
    const date = new Date(interview.createdAt);
    const weekKey = getWeekKey(date);
    if (!interviewsByWeek[weekKey]) {
      interviewsByWeek[weekKey] = [];
    }
    interviewsByWeek[weekKey].push(interview);
  });
  // Convert to array format
  return Object.entries(interviewsByWeek).map(([week, weekInterviews]) => {
    const totalScore = weekInterviews.reduce((sum, interview) => {
      const score =
        interview.feedbacks && interview.feedbacks[0]
          ? interview.feedbacks[0].totalScore
          : 0;
      return sum + score;
    }, 0);
    return {
      week,
      interviews: weekInterviews.length,
      score: Math.round(totalScore / weekInterviews.length),
    };
  });
}

function generateInterviewHistory(
  interviews: Interview[]
): InterviewHistoryItem[] {
  // Sort interviews by date (most recent first)
  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  // Take the 10 most recent interviews
  const recentInterviews = sortedInterviews.slice(0, 10);
  return recentInterviews.map((interview) => {
    const date = new Date(interview.createdAt);
    // Calculate improvement compared to previous interview of the same type
    const previousInterview = sortedInterviews.find(
      (i) =>
        i.id !== interview.id &&
        i.type === interview.type &&
        date > new Date(i.createdAt)
    );
    const score =
      interview.feedbacks && interview.feedbacks[0]
        ? interview.feedbacks[0].totalScore
        : 0;
    const prevScore =
      previousInterview &&
      previousInterview.feedbacks &&
      previousInterview.feedbacks[0]
        ? previousInterview.feedbacks[0].totalScore
        : 0;
    const improvement = previousInterview
      ? `+${Math.max(0, score - prevScore)}%`
      : 'N/A';
    return {
      id: interview.id,
      date: formatDate(date),
      type: interview.type,
      topic: interview.role,
      score,
      improvement,
    };
  });
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// New function to calculate tech stack frequency
function generateTechStackFrequency(
  interviews: Interview[]
): TechStackFrequencyItem[] {
  const frequency: Record<string, number> = {};

  interviews.forEach((interview) => {
    if (interview.techstack && Array.isArray(interview.techstack)) {
      interview.techstack.forEach((tech) => {
        if (tech && typeof tech === 'string') {
          // Basic validation
          frequency[tech] = (frequency[tech] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(frequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
}

// New analytics events
export async function trackUserAction(action: string, params?: Record<string, string | number | boolean>) {
  try {
    const analytics = getAnalytics(app);
    logEvent(analytics, action, {
      timestamp: new Date().toISOString(),
      ...params,
    });
  } catch (error) {
    console.error('Error tracking user action:', error);
  }
}

export async function trackInterviewStart(interviewId: string, type: string, difficulty: string) {
  await trackUserAction('interview_start', {
    interview_id: interviewId,
    interview_type: type,
    difficulty_level: difficulty,
  });
}

export async function trackInterviewComplete(interviewId: string, score: number, duration: number) {
  await trackUserAction('interview_complete', {
    interview_id: interviewId,
    score,
    duration_seconds: duration,
  });
}

export async function trackQuestionAttempt(interviewId: string, questionId: string, timeSpent: number, correct: boolean) {
  await trackUserAction('question_attempt', {
    interview_id: interviewId,
    question_id: questionId,
    time_spent_seconds: timeSpent,
    is_correct: correct,
  });
}

export async function trackUserEngagement(feature: string, action: string, duration?: number) {
  await trackUserAction('user_engagement', {
    feature,
    action,
    ...(duration !== undefined && { duration_seconds: duration }),
  });
}

export async function trackUserFeedback(rating: number, feedback?: string) {
  await trackUserAction('user_feedback', {
    rating,
    ...(feedback && { feedback }),
  });
}

export async function trackUserProgress(milestone: string, value: number) {
  await trackUserAction('user_progress', {
    milestone,
    value,
  });
}
