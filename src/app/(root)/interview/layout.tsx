import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Interview',
};

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
