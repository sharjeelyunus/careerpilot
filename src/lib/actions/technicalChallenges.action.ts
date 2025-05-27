'use server';

import { db } from '@/firebase/admin';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { TechnicalChallenge } from '@/store/technicalChallengesStore';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Use a more specific type for the cache
const cache = new Map<string, CacheEntry<unknown>>();

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Helper function to extract JSON from AI response
function extractJsonFromResponse(text: string): string {
  // Remove any markdown code block syntax
  const cleanedText = text.replace(/```json\s*|\s*```/g, '');
  
  // Find the first { and last } to extract just the JSON object
  const startIndex = cleanedText.indexOf('{');
  const endIndex = cleanedText.lastIndexOf('}');
  
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('No valid JSON object found in the response');
  }
  
  return cleanedText.substring(startIndex, endIndex + 1);
}

export async function getTechnicalChallenges(
  userId: string,
  filters?: {
    difficulty?: string[];
    techStack?: string[];
    status?: string[];
  }
): Promise<{ challenges: TechnicalChallenge[]; total: number }> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const cacheKey = `challenges-${userId}-${JSON.stringify(filters)}`;
    const cachedData = getCachedData<{
      challenges: TechnicalChallenge[];
      total: number;
    }>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    let query = db.collection('technicalChallenges').where('userId', '==', userId);
    
    // Apply filters
    if (filters?.difficulty && filters.difficulty.length > 0) {
      query = query.where('difficulty', 'in', filters.difficulty);
    }
    if (filters?.techStack && filters.techStack.length > 0) {
      query = query.where('techStack', 'array-contains-any', filters.techStack);
    }
    if (filters?.status && filters.status.length > 0) {
      query = query.where('status', 'in', filters.status);
    }

    const [challengesSnapshot, totalSnapshot] = await Promise.all([
      query.get(),
      query.count().get(),
    ]);

    const challenges = challengesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as TechnicalChallenge[];

    const result = { challenges, total: totalSnapshot.data().count };
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching technical challenges:', error);
    throw error;
  }
}

export async function generateTechnicalChallenge(
  userId: string,
  userData?: {
    skills: string[];
    experience: string;
    preferredRoles: string[];
  },
  existingChallenges?: TechnicalChallenge[]
): Promise<TechnicalChallenge> {
  try {
    // If userData is not provided, fetch it (fallback)
    let userDataToUse = userData;
    if (!userDataToUse) {
      const user = await db.collection('users').doc(userId).get();
      const data = user.data();
      userDataToUse = {
        skills: data?.skills || [],
        experience: data?.experience || '',
        preferredRoles: data?.preferredRoles || []
      };
    }

    // If existingChallenges is not provided, fetch recent ones (fallback)
    let recentChallenges = existingChallenges;
    if (!recentChallenges) {
      const previousChallenges = await db
        .collection('technicalChallenges')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
      recentChallenges = previousChallenges.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as TechnicalChallenge[];
    }

    // Get recent titles and topics from the provided or fetched challenges
    const recentTitles = recentChallenges.map(challenge => challenge.title);
    const recentTopics = recentChallenges.map(challenge => {
      const description = challenge.description;
      return description.split('\n')[0]; // Get first line as topic summary
    });

    // Check if user has completed their profile
    const hasRequiredData = Boolean(
      userDataToUse?.skills?.length && 
      userDataToUse?.experience && 
      userDataToUse?.preferredRoles?.length
    );

    if (!hasRequiredData) {
      throw new Error('Please complete your profile to generate technical challenges');
    }

    // Generate the challenge using the AI model
    const { text: challengeText } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Generate a unique and creative single-file coding challenge based on the user's profile. The challenge MUST be significantly different from their recent challenges.

      User Profile:
      - Skills: ${userDataToUse?.skills?.join(', ')}
      - Experience Level: ${userDataToUse?.experience}
      - Preferred Roles: ${userDataToUse?.preferredRoles?.join(', ')}
      
      Recent Challenge Titles (AVOID similar topics):
      ${recentTitles.map(title => `- ${title}`).join('\n')}
      
      Recent Topics Covered (GENERATE something DIFFERENT):
      ${recentTopics.map(topic => `- ${topic}`).join('\n')}
      
      Requirements:
      1. Generate a COMPLETELY DIFFERENT type of challenge than the recent ones
      2. If recent challenges were frontend-focused, lean towards backend or algorithms
      3. If recent challenges used certain technologies, use different ones from the user's skill set
      4. Ensure the challenge has a unique and creative problem statement
      5. Match the user's skill level but explore different aspects of their skills
      6. Be solvable in a single file
      7. Have clear input/output specifications
      8. Include sample test cases
      
      Return a JSON object with:
      {
        "title": "string (MUST be unique from recent titles)",
        "description": "string (include problem statement, input/output format, sample test cases, and constraints)",
        "difficulty": "beginner" | "intermediate" | "advanced",
        "techStack": string[],
        "estimatedTime": number (in minutes),
        "points": number (10-100)
      }
      
      IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`,
    });

    // Extract and parse the JSON from the response
    const jsonText = extractJsonFromResponse(challengeText);
    const challengeData = JSON.parse(jsonText);
    
    // Create a new challenge with the generated data
    const newChallenge = {
      title: challengeData.title,
      description: challengeData.description,
      difficulty: challengeData.difficulty,
      techStack: challengeData.techStack,
      estimatedTime: challengeData.estimatedTime,
      points: challengeData.points,
      status: 'not_started' as const,
      userId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('technicalChallenges').add(newChallenge);
    
    return { ...newChallenge, id: docRef.id } as TechnicalChallenge;
  } catch (error) {
    console.error('Error generating technical challenge:', error);
    throw error;
  }
}

export async function getChallengeById(id: string, userId: string): Promise<TechnicalChallenge | null> {
  try {
    const challengeDoc = await db.collection('technicalChallenges').doc(id).get();
    
    if (!challengeDoc.exists) {
      return null;
    }

    // Fetch only the current user's submissions for this challenge
    const submissionsSnapshot = await db
      .collection('challengeSubmissions')
      .where('challengeId', '==', id)
      .where('userId', '==', userId)
      .orderBy('submittedAt', 'desc')
      .get();

    const submissions = submissionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      id: challengeDoc.id,
      ...challengeDoc.data(),
      submissions
    } as TechnicalChallenge;
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return null;
  }
}

export async function submitChallengeSolution(
  challengeId: string,
  solution: string,
  userId: string // Add userId parameter
): Promise<{ success: boolean; feedback?: string; error?: string }> {
  try {
    const challengeDoc = await db.collection('technicalChallenges').doc(challengeId).get();
    
    if (!challengeDoc.exists) {
      return {
        success: false,
        error: 'Challenge not found'
      };
    }
    
    const challengeData = challengeDoc.data() as TechnicalChallenge;
    
    // Generate AI feedback
    const { text: feedbackText } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Evaluate this single-file coding solution:
      
      Challenge: ${challengeData.title}
      Description: ${challengeData.description}
      Difficulty: ${challengeData.difficulty}
      Tech Stack: ${challengeData.techStack.join(', ')}
      
      Solution:
      ${solution}
      
      Evaluate ONLY the implementation provided in this single file. Focus on:
      1. Correctness - Does it solve the problem according to requirements?
      2. Code quality - Is the code clean, readable, and well-structured?
      3. Algorithm/approach - Is the solution efficient and well-thought-out?
      4. Best practices - Does it follow language/framework best practices?
      5. Edge cases - Does it handle edge cases mentioned in the problem?
      
      DO NOT suggest:
      - Extracting code into separate files/modules
      - Creating additional components/files
      - Project structure changes
      - External configurations
      
      Return a JSON object with the following structure:
      {
        "score": number (0-100),
        "strengths": [
          "List specific strengths of THIS implementation",
          "Focus on code quality, logic, and problem-solving"
        ],
        "improvements": [
          "Suggest improvements for THIS file only",
          "Focus on algorithm, efficiency, and code style"
        ],
        "suggestions": [
          "Provide specific code-level suggestions",
          "Keep suggestions within the single-file context"
        ]
      }
      
      IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`,
    });
    
    // Extract and parse the JSON from the response
    const jsonText = extractJsonFromResponse(feedbackText);
    const feedbackData = JSON.parse(jsonText);
    
    // Create the feedback object
    const feedback = {
      score: feedbackData.score,
      strengths: feedbackData.strengths,
      improvements: feedbackData.improvements,
      suggestions: feedbackData.suggestions,
    };
    
    // Store the submission with more details
    const submissionData = {
      challengeId,
      userId,
      solution,
      feedback,
      submittedAt: new Date().toISOString(),
      status: feedback.score >= 70 ? 'completed' : 'in_progress' as const, // Add submission status
    };

    // Add the submission
    const submissionRef = await db.collection('challengeSubmissions').add(submissionData);

    // Update challenge status if score is high enough
    if (feedback.score >= 70) {
      await db.collection('technicalChallenges').doc(challengeId).update({
        status: 'completed',
        completedAt: new Date().toISOString()
      });
    } else if (challengeData.status === 'not_started') {
      await db.collection('technicalChallenges').doc(challengeId).update({
        status: 'in_progress'
      });
    }
    
    return {
      success: true,
      feedback: JSON.stringify({
        ...feedback,
        submissionId: submissionRef.id // Include the submission ID in the response
      }),
    };
  } catch (error) {
    console.error('Error submitting solution:', error);
    return {
      success: false,
      error: 'Failed to submit solution. Please try again.',
    };
  }
} 