import { Metadata } from 'next';
import { getCachedUserById } from '@/lib/actions/auth.action';

export async function generateMetadata({ 
  params,
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const user = await getCachedUserById(params.id);
  return {
    title: user ? `${user.name}'s Profile | CareerPilot` : 'Profile | CareerPilot',
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 