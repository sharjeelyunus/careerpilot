/**
 * @file ErrorBoundary.tsx
 * @description A React component that acts as an error boundary to catch JavaScript errors in its child component tree.
 * It logs these errors to Firebase Analytics and displays a fallback UI.
 *
 * @module components/core/ErrorBoundary
 *
 * @param {ReactNode} children - The child components that this boundary will wrap.
 * @param {string} component - A string identifier for the component or area wrapped by this ErrorBoundary, used for logging.
 *
 * @returns {JSX.Element} The ErrorBoundary component. If an error is caught, it renders a fallback UI; otherwise, it renders the children.
 *
 * @example
 * <ErrorBoundary component="UserProfileSection">
 *   <UserProfile />
 * </ErrorBoundary>
 *
 * @version 1.0.0
 * @date 2023-10-27 (Placeholder, actual date may vary)
 *
 * @note This component uses class component features for error boundary lifecycle methods.
 * It logs errors to Firebase Analytics. Ensure Firebase is initialized in the application.
 */

'use client';

// React/Next.js
import React, { type Component, type ReactNode } from 'react';

// External Libraries
import { getAnalytics, logEvent } from 'firebase/analytics';

// Firebase Client
import { app } from '@/firebase/client'; // Assuming firebase client setup

// Type Definitions
interface ErrorBoundaryProps {
  children: ReactNode;
  component: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error /*errorInfo: ErrorInfo*/) {
    // Log the error to Firebase Analytics
    try {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'error', {
        error_message: error.message,
        error_name: error.name,
        error_stack: error.stack,
        component_name: this.props.component, // Consistent naming with other potential analytics events
      });
    } catch (analyticsError) {
      console.error('Failed to log error to Firebase Analytics:', analyticsError);
    }
    // You can also log the error to an error reporting service here
    // console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          role="alert"
          className="p-4 border border-destructive-100/50 bg-destructive-100/10 rounded-lg text-destructive-200"
        >
          <h2 className="text-lg font-bold mb-2">
            Oops! Something went wrong.
          </h2>
          <p className="text-sm mb-4">
            We've encountered an error in the '{this.props.component}' section.
            {this.state.error?.message && (
              <span className="block mt-1">
                Details: {this.state.error.message}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-destructive-100 text-white rounded hover:bg-destructive-200 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 