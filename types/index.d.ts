interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  completed: boolean;
  feedback?: Feedback | null;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

export type BadgeType = 'skill' | 'achievement' | 'streak' | 'participation';
export type AchievementType =
  | 'interview_count'
  | 'score_threshold'
  | 'streak'
  | 'skill_mastery';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: BadgeType;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  earnedAt?: string;
  type: AchievementType;
}

interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  experience: string;
  preferredRoles?: string[];
  badges: Badge[];
  experiencePoints: number;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  level: string;
  feedback?: Feedback | null;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: 'generate' | 'interview';
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId?: string;
  limit?: number;
  page?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = 'sign-in' | 'sign-up';

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

interface GenerateInterviewParams {
  role: string;
  type: string;
  level: string;
  techstack: string;
  amount: number;
  userid: string;
}

export interface UserProgress {
  userId: string;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  streak: number;
  badges: Badge[];
  achievements: Achievement[];
  level: number;
  experiencePoints: number;
}

interface UserProfileCardProps {
  profile: User;
  progress: UserProgress;
  onEdit: () => void;
}

interface EditProfileModalProps {
  profile: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: User) => void;
}
