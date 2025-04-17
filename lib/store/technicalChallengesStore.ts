import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  solution: string;
  feedback: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  submittedAt: string;
  status: 'completed' | 'in_progress';
}

export interface TechnicalChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack: string[];
  estimatedTime: number;
  points: number;
  status: 'not_started' | 'in_progress' | 'completed';
  userId?: string;
  completedAt?: string;
  createdAt: string;
  submissions?: ChallengeSubmission[];
  aiFeedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
}

interface TechnicalChallengesState {
  challenges: TechnicalChallenge[];
  currentChallenge: TechnicalChallenge | null;
  filters: {
    difficulty: string[];
    techStack: string[];
    status: string[];
  };
  isLoading: boolean;
  error: string | null;
  setChallenges: (challenges: TechnicalChallenge[]) => void;
  setCurrentChallenge: (challenge: TechnicalChallenge | null) => void;
  updateChallengeStatus: (challengeId: string, status: TechnicalChallenge['status']) => void;
  setFilters: (filters: Partial<TechnicalChallengesState['filters']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTechnicalChallengesStore = create<TechnicalChallengesState>()(
  persist(
    (set) => ({
      challenges: [],
      currentChallenge: null,
      filters: {
        difficulty: [],
        techStack: [],
        status: [],
      },
      isLoading: false,
      error: null,
      setChallenges: (challenges) => set({ challenges }),
      setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
      updateChallengeStatus: (challengeId, status) =>
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  status,
                  completedAt: status === 'completed' ? new Date().toISOString() : undefined,
                }
              : challenge
          ),
          currentChallenge:
            state.currentChallenge?.id === challengeId
              ? {
                  ...state.currentChallenge,
                  status,
                  completedAt: status === 'completed' ? new Date().toISOString() : undefined,
                }
              : state.currentChallenge,
        })),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'technical-challenges-storage',
    }
  )
); 