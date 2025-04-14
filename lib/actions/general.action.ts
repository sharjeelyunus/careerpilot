'use server';

import { feedbackSchema } from '@/constants';
import { db } from '@/firebase/admin';
import {
  CreateFeedbackParams,
  Feedback,
  GenerateInterviewParams,
  GetFeedbackByInterviewIdParams,
  GetLatestInterviewsParams,
  Interview,
  User,
} from '@/types';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import axios from 'axios';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
};

const setCachedData = <T>(key: string, data: T) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export async function getInterviewByUserId(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  filters?: {
    type?: string[];
    techstack?: string[];
    level?: string[];
  }
): Promise<{ interviews: Interview[]; total: number }> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const cacheKey = `interviews-${userId}-${page}-${pageSize}-${search}-${JSON.stringify(
      filters
    )}`;
    const cachedData = getCachedData<{
      interviews: Interview[];
      total: number;
    }>(cacheKey);
    if (cachedData) return cachedData;

    let query = db.collection('interviews').where('userId', '==', userId);

    // Apply filters
    if (filters?.type && filters.type.length > 0) {
      query = query.where('type', 'in', filters.type);
    }
    if (filters?.techstack && filters.techstack.length > 0) {
      query = query.where('techstack', 'array-contains-any', filters.techstack);
    }
    if (filters?.level && filters.level.length > 0) {
      query = query.where('level', 'in', filters.level);
    }

    // Apply search
    if (search) {
      query = query
        .where('role', '>=', search)
        .where('role', '<=', search + '\uf8ff');
    }

    // Use batch operations for parallel queries
    const [feedbackSnapshot, totalSnapshot, interviewsSnapshot] =
      await Promise.all([
        db.collection('feedback').where('userId', '==', userId).get(),
        query.count().get(),
        query
          .orderBy('createdAt', 'desc')
          .limit(pageSize)
          .offset((page - 1) * pageSize)
          .get(),
      ]);

    const feedbackMap = new Map<string, Feedback[]>();
    feedbackSnapshot.forEach((doc) => {
      const data = doc.data();
      const feedback = { id: doc.id, ...data } as Feedback;
      if (!feedbackMap.has(data.interviewId)) {
        feedbackMap.set(data.interviewId, []);
      }
      feedbackMap.get(data.interviewId)?.push(feedback);
    });

    const total = totalSnapshot.data().count;
    const interviews: Interview[] = interviewsSnapshot.docs.map((doc) => {
      const interviewData = { id: doc.id, ...doc.data() } as Interview;
      const feedbacks = feedbackMap.get(doc.id);
      if (feedbacks && feedbacks.length > 0) {
        return {
          ...interviewData,
          completed: true,
          feedbacks: feedbacks.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        };
      }
      return interviewData;
    });

    const result = { interviews, total };
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching interviews:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch interviews: ${error.message}`);
    }
    throw new Error('Failed to fetch interviews');
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<{ interviews: Interview[]; total: number }> {
  const { userId, limit = 10, page = 1, search, filters } = params;

  try {
    let query = db
      .collection('interviews')
      .where('finalized', '==', true)
      .orderBy('createdAt', 'desc');

    if (userId) {
      query = query.where('userId', '!=', userId);
    }

    // Apply filters
    if (filters?.type && filters.type.length > 0) {
      query = query.where('type', 'in', filters.type);
    }
    if (filters?.techstack && filters.techstack.length > 0) {
      query = query.where('techstack', 'array-contains-any', filters.techstack);
    }
    if (filters?.level && filters.level.length > 0) {
      query = query.where('level', 'in', filters.level);
    }

    // Apply search
    if (search) {
      query = query
        .where('title', '>=', search)
        .where('title', '<=', search + '\uf8ff');
    }

    // Get total count
    const totalSnapshot = await query.count().get();
    const total = totalSnapshot.data().count;

    // Get paginated results
    const interviews = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    return {
      interviews: interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[],
      total,
    };
  } catch (error) {
    console.error('Error fetching latest interviews:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch latest interviews: ${error.message}`);
    }
    throw new Error('Failed to fetch latest interviews');
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection('interviews').doc(id).get();

  return {
    id,
    ...interview.data(),
  } as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join('');

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google('gemini-2.0-flash-001', {
        structuredOutputs: true,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories',
    });

    const feedback = await db.collection('feedback').add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error) {
    console.error('Error saving feedback', error);

    return {
      success: false,
    };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback[] | null> {
  const { interviewId, userId } = params;

  const feedbacks = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  if (feedbacks.empty) return null;

  return feedbacks.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feedback[];
}

export async function generateInterview(params: GenerateInterviewParams) {
  const api = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`;

  const response = await axios.post(api, params);

  return response.data;
}

export async function updateUserProfile(params: User) {
  const { id, ...userData } = params;

  const userRef = db.collection('users').doc(id);

  await userRef.update(userData);
}

export async function getLeaderboard(): Promise<User[]> {
  const leaderboard = await db
    .collection('users')
    .orderBy('experiencePoints', 'desc')
    .get();

  return leaderboard.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[] | [];
}

export interface FilterOptions {
  type: Array<{ value: string; label: string }>;
  techstack: Array<{ value: string; label: string }>;
  level: Array<{ value: string; label: string }>;
}

// Add this new function to update filter options
export async function updateFilterOptions(interview: Interview) {
  try {
    const filterOptionsRef = db.collection('filters').doc('options');

    // Get current options
    const currentOptions = await filterOptionsRef.get();
    const currentData = currentOptions.data() || {
      types: [],
      techstacks: [],
      levels: [],
    };

    // Convert arrays to Sets
    const typesSet = new Set(currentData.types || []);
    const techstacksSet = new Set(currentData.techstacks || []);
    const levelsSet = new Set(currentData.levels || []);

    // Update sets with new values
    typesSet.add(interview.type);
    interview.techstack.forEach((tech) => techstacksSet.add(tech));
    levelsSet.add(interview.level);

    // Convert sets to arrays and save
    await filterOptionsRef.set({
      types: Array.from(typesSet),
      techstacks: Array.from(techstacksSet),
      levels: Array.from(levelsSet),
    });
  } catch (error) {
    console.error('Error updating filter options:', error);
  }
}

export async function getFilterOptions(): Promise<FilterOptions> {
  try {
    const cacheKey = 'filter-options';
    const cachedData = getCachedData<FilterOptions>(cacheKey);
    if (cachedData) return cachedData;

    const filterOptionsDoc = await db
      .collection('filters')
      .doc('options')
      .get();

    if (!filterOptionsDoc.exists) {
      return {
        type: [],
        techstack: [],
        level: [],
      };
    }

    const data = filterOptionsDoc.data();

    // Format the options
    const typeOptions = (data?.types || [])
      .filter(Boolean)
      .map((value: string) => ({
        value,
        label: value
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      }));

    const techStackOptions = (data?.techstacks || [])
      .filter(Boolean)
      .map((value: string) => ({
        value,
        label: value
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      }));

    const levelOptions = (data?.levels || [])
      .filter(Boolean)
      .map((value: string) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
      }));

    const result = {
      type: typeOptions,
      techstack: techStackOptions,
      level: levelOptions,
    };

    // Cache the result
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch filter options: ${error.message}`);
    }
    throw new Error('Failed to fetch filter options');
  }
}

export async function getCompletedInterviewsByUserId(
  userId: string
): Promise<{ interviews: Interview[]; total: number }> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const cacheKey = `completed-interviews-${userId}`;
    const cachedData = getCachedData<{
      interviews: Interview[];
      total: number;
    }>(cacheKey);
    if (cachedData) return cachedData;

    // First, get all feedbacks for the user
    const feedbackSnapshot = await db
      .collection('feedback')
      .where('userId', '==', userId)
      .get();

    // Create a map of interview IDs that have feedback
    const completedInterviewIds = new Set<string>();
    feedbackSnapshot.forEach((doc) => {
      const data = doc.data();
      completedInterviewIds.add(data.interviewId);
    });

    // Convert Set to Array for the query
    const completedInterviewIdsArray = Array.from(completedInterviewIds);

    // If no completed interviews, return empty result
    if (completedInterviewIdsArray.length === 0) {
      return { interviews: [], total: 0 };
    }

    const interviews: Interview[] = [];

    completedInterviewIdsArray.map(async (id) => {
      // Get the interview
      const interview = await db.collection('interviews').doc(id).get();
      interviews.push({
        id: interview.id,
        ...interview.data(),
      } as Interview);
    });

    // get feedbacks for each interview
    const feedbacks = await db
      .collection('feedback')
      .where('interviewId', 'in', completedInterviewIdsArray)
      .get();

    feedbacks.forEach((doc) => {
      const data = doc.data();
      const feedback = { id: doc.id, ...data } as Feedback;
      const interview = interviews.find(
        (interview) => interview.id === feedback.interviewId
      );
      if (interview) {
        interview.feedbacks = [feedback];
      }
    });

    const result = { interviews, total: interviews.length };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching completed interviews:', error);
    throw error;
  }
}
