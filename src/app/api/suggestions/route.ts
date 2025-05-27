import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getUserById } from '@/lib/actions/auth.action';
import { getInterviewByUserId } from '@/lib/actions/general.action';
import { Feedback } from '@/types';

interface UserData {
  skills: string[];
  bio: string;
  experience: string;
  preferredRoles: string[];
  completedInterviews: Array<{
    role: string;
    level: string;
    techstack: string[];
    type: string;
    feedbacks: Feedback[] | null;
  }>;
}

interface ApiError extends Error {
  statusCode?: number;
  message: string;
}

interface Suggestion {
  role: string;
  type: string;
  level: string;
  techstack: string;
  amount: number;
}

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function generateSuggestionsWithRetry(userData: UserData, retryCount = 0): Promise<Suggestion[]> {
  try {
    const { text: suggestions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `As an expert career advisor, create a diverse set of interview suggestions to help the user advance in their career. The suggestions should follow a clear progression path and cover different aspects of development.

      User Data:
      - Current Skills: ${userData.skills.join(', ')}
      - Experience Level: ${userData.experience}
      - Preferred Roles: ${userData.preferredRoles.join(', ')}
      - Past Interviews: ${JSON.stringify(userData.completedInterviews)}
      - Bio: ${userData.bio}

      Create 6 different interview scenarios that:
      1. Represent a clear progression path (junior → mid → senior → architect)
      2. Mix technical and behavioral interviews
      3. Cover different specializations (frontend, fullstack, specific frameworks)
      4. Include varying complexity levels
      5. Focus on different skill aspects (coding, system design, leadership)
      6. Suggest complementary tech stacks

      Return ONLY a valid JSON array of objects in this exact format:
      [
        {
          "role": "string",
          "type": "string",
          "level": "string",
          "techstack": "string",
          "amount": number
        }
      ]

      Each suggestion should be significantly different from the others in at least 2-3 aspects (role, level, tech stack, or type).
      IMPORTANT: Return ONLY the JSON array, no additional text or explanation.`,
    });

    // Clean up the response to ensure it's valid JSON
    const cleanedSuggestions = suggestions.trim().replace(/^```json\n?|\n?```$/g, '');
    
    try {
      const parsedSuggestions = JSON.parse(cleanedSuggestions);
      return parsedSuggestions;
    } catch (parseError) {
      console.error('Failed to parse suggestions:', parseError);
      console.error('Raw suggestions:', suggestions);
      throw new Error('Failed to parse suggestions from AI response');
    }
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.statusCode === 503 && retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retrying after ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateSuggestionsWithRetry(userData, retryCount + 1);
    }
    
    // If we've exhausted all retries or it's a different error, throw
    throw error;
  }
}

export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    // Get user data
    const user = await getUserById(userId);
    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { interviews } = await getInterviewByUserId(userId, 1, 10000);

    // Prepare user data for Gemini
    const userData: UserData = {
      skills: user.skills || [],
      bio: user.bio || '',
      experience: user.experience || '',
      preferredRoles: user.preferredRoles || [],
      completedInterviews: interviews.map(interview => ({
        role: interview.role,
        level: interview.level,
        techstack: interview.techstack,
        type: interview.type,
        feedbacks: interview.feedbacks || null
      }))
    };

    // Generate suggestions using Gemini with retry mechanism
    const suggestions = await generateSuggestionsWithRetry(userData);

    return Response.json({ success: true, suggestions });
  } catch (error: unknown) {
    console.error('Error generating suggestions:', error);
    const apiError = error as ApiError;
    
    // Return a more specific error message based on the error type
    if (apiError.statusCode === 503) {
      return Response.json(
        { 
          success: false, 
          error: 'The AI service is currently experiencing high demand. Please try again in a few moments.',
          retryAfter: 30 // Suggest retrying after 30 seconds
        },
        { status: 503 }
      );
    }

    return Response.json(
      { 
        success: false, 
        error: 'Failed to generate suggestions. Please try again later.',
        details: apiError.message
      },
      { status: 500 }
    );
  }
} 