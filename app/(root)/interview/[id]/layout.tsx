import { Metadata } from 'next';
import { getCachedInterviewById } from '@/lib/actions/general.action';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const interview = await getCachedInterviewById(params.id);
  return {
    title: interview ? `${interview.role} Interview | CareerPilot` : 'Interview | CareerPilot',
  };
}

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
