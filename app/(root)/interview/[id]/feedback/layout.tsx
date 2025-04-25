import { Metadata } from 'next';
import { getCachedInterviewById } from '@/lib/actions/general.action';

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const interview = await getCachedInterviewById(params.id);
  return {
    title: interview ? `${interview.role} Interview Feedback | CareerPilot` : 'Interview Feedback | CareerPilot',
  };
}

export default function InterviewFeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 