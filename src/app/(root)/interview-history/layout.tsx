import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview History',
};

export default function InterviewHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
