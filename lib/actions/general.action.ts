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
  pageSize: number = 10
): Promise<{ interviews: Interview[]; total: number }> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const cacheKey = `interviews-${userId}-${page}-${pageSize}`;
    const cachedData = getCachedData<{ interviews: Interview[]; total: number }>(cacheKey);
    if (cachedData) return cachedData;

    // Use batch operations for parallel queries
    const [feedbackSnapshot, totalSnapshot, interviewsSnapshot] = await Promise.all([
      db.collection('feedback').where('userId', '==', userId).get(),
      db.collection('interviews').where('userId', '==', userId).count().get(),
      db
        .collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .get(),
    ]);

    const feedbackMap = new Map<string, Feedback>();
    feedbackSnapshot.forEach((doc) => {
      const data = doc.data();
      feedbackMap.set(data.interviewId, { id: doc.id, ...data } as Feedback);
    });

    const total = totalSnapshot.data().count;
    const interviews: Interview[] = interviewsSnapshot.docs.map((doc) => {
      const interviewData = { id: doc.id, ...doc.data() } as Interview;
      const feedback = feedbackMap.get(doc.id);
      if (feedback) {
        return {
          ...interviewData,
          completed: true,
          feedback,
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
  const { userId, limit = 10, page = 1 } = params;

  try {
    let query = db
      .collection('interviews')
      .where('finalized', '==', true)
      .orderBy('createdAt', 'desc');

    if (userId) {
      query = query.where('userId', '!=', userId);
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
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .limit(1)
    .get();

  if (feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
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
