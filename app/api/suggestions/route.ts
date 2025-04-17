import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getUserById } from '@/lib/actions/auth.action';
import { getInterviewByUserId } from '@/lib/actions/general.action';

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
    const userData = {
      skills: user.skills || [],
      bio: user.bio,
      experience: user.experience,
      preferredRoles: user.preferredRoles || [],
      completedInterviews: interviews.map(interview => ({
        role: interview.role,
        level: interview.level,
        techstack: interview.techstack,
        type: interview.type,
        feedbacks: interview.feedbacks
      }))
    };

    // Generate suggestions using Gemini
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

      Guidelines for diversity:
      - Roles: Include different positions (Developer, Engineer, Architect, Lead)
      - Types: Balance between technical and behavioral
      - Levels: Mix of Junior, Mid, Senior positions
      - Tech Stacks: Combine core technologies with specialized ones
      - Questions: Vary the number based on interview complexity (5-8 questions)

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
      return Response.json(
        { success: true, suggestions: parsedSuggestions },
        { status: 200 }
      );
    } catch (parseError) {
      console.error('Failed to parse suggestions:', parseError);
      console.error('Raw suggestions:', suggestions);
      return Response.json(
        { success: false, error: 'Failed to parse suggestions' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        error: error,
      },
      {
        status: 500,
      }
    );
  }
} 