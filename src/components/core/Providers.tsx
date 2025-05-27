/**
 * @file Providers.tsx
 * @description A client-side component that wraps the application with essential context providers.
 * This includes theme management (NextThemes), notifications (Sonner), and a top-level error boundary.
 *
 * @module components/core/Providers
 *
 * @param {React.ReactNode} children - The child components to be wrapped by these providers.
 *
 * @returns {React.ReactNode} The Providers component, which sets up global contexts for the application.
 *
 * @example
 * // In RootLayout.tsx or a similar top-level component:
 * <Providers>
 *   <AppContent />
 * </Providers>
 *
 * @version 1.0.0
 * @date 2023-10-27 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `next-themes` for theme management.
 * - `sonner` for toast notifications.
 * - `@/components/core/ErrorBoundary` for catching errors within the provider tree.
 *
 * @note Ensures that core functionalities like theming, notifications, and error handling are available throughout the app.
 */

'use client';

// React/Next.js
import React, { type ReactNode } from 'react';

// External Libraries
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

// Core Components
import { ErrorBoundary } from '@/components/core/ErrorBoundary'; // Updated import path

// Type Definitions
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactNode {
  return (
    <ErrorBoundary component="RootProviders">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </ErrorBoundary>
  );
} 