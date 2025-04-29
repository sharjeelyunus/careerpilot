import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Link from 'next/link';
import { generatePageTitle } from '@/lib/seo';
import { FloatingFeedbackButton } from '@/components/feedback/floating-feedback-button';

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: generatePageTitle(),
    template: '%s | CareerPilot',
  },
  description: 'An AI-powered platform for preparing for mock interviews.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${monaSans.className} antialiased pattern min-h-screen flex flex-col`}>
        <div className="flex-grow">
          <Providers>{children}</Providers>
        </div>
        {/* Footer */}
        <footer className='py-8'>
          <p className='text-center text-sm text-light-100/50'>
            Built with ❤️ by{' '}
            <Link
              href='https://github.com/sharjeelyunus'
              target='_blank'
              className='text-primary-200 hover:underline'
            >
              Sharjeel Yunus
            </Link>{' '}
            &{' '}
            <Link
              href='https://github.com/farhanashrafdev'
              target='_blank'
              className='text-primary-200 hover:underline'
            >
              Farhan Ashraf
            </Link>
          </p>
        </footer>
        <FloatingFeedbackButton />
      </body>
    </html>
  );
}
