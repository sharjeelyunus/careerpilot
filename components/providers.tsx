'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary component="Root">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </ErrorBoundary>
  )
} 