import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Link from 'next/link';

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CareerPilot',
  description: 'An AI-powered platform for preparing for mock interviews.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${monaSans.className} antialiased pattern`}>
        <Providers>{children}</Providers>
        {/* Footer */}
        <div className='mt-auto py-8'>
          <p className='text-center text-sm text-light-100/50'>
            Built with ❤️ by{' '}
            <Link
              href='https://github.com/sharjeelyunus'
              target='_blank'
              className='text-primary-200 hover:underline'
            >
              Sharjeel Yunus
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
