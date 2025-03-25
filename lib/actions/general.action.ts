'use server';

import { feedbackSchema } from '@/constants';
import { db } from '@/firebase/admin';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import axios from 'axios';

export async function getInterviewByUserId(
  userId: string
): Promise<Interview[]> {
  try {
    const feedbackSnapshot = await db
      .collection('feedback')
      .where('userId', '==', userId)
      .get();

    const feedbackInterviewIds = feedbackSnapshot.docs.map(
      (doc) => doc.data().interviewId
    );

    const interviewsSnapshot = await db
      .collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const interviewsWithFeedback = interviewsSnapshot.docs.filter((doc) =>
      feedbackInterviewIds.includes(doc.id)
    );
    const interviewsWithoutFeedback = interviewsSnapshot.docs.filter(
      (doc) => !feedbackInterviewIds.includes(doc.id)
    );

    const updatedInterviewsWithFeedback = await Promise.all(
      interviewsWithFeedback.map(async (doc) => {
        return await db.collection('interviews').doc(doc.id).get();
      })
    );

    const allInterviewDocs = [
      ...updatedInterviewsWithFeedback,
      ...interviewsWithoutFeedback,
    ];

    return allInterviewDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return [];
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  let query = db
    .collection('interviews')
    .where('finalized', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (userId) {
    query = query.where('userId', '!=', userId);
  }

  const interviews = await query.get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
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
