export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: 'skill' | 'achievement' | 'streak' | 'participation';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
  type: 'interview_count' | 'score_threshold' | 'streak' | 'skill_mastery';
}

export interface InterviewHistory {
  id: string;
  userId: string;
  date: Date;
  type: 'technical' | 'behavioral' | 'system_design';
  score: number;
  feedback: string;
  topics: string[];
  duration: number;
  recording?: string;
  transcript?: string;
}
