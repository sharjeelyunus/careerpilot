import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/firebase/admin';
import { updateFilterOptions } from '@/lib/actions/general.action';

export async function GET() {
  return Response.json(
    {
      success: true,
      data: 'THANK YOU',
    },
    {
      status: 200,
    }
  );
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioral and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(','),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    const interviewDoc = await db.collection('interviews').add(interview);

    // Update filter options with the new interview
    await updateFilterOptions({
      id: interviewDoc.id,
      ...interview,
      completed: false,
      feedback: null
    });

    return Response.json(
      { success: true, interviewId: interviewDoc.id },
      { status: 200 }
    );
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
