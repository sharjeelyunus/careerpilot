'use client'

import { Component, ReactNode } from 'react'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { app } from '@/firebase/client'

interface ErrorBoundaryProps {
  children: ReactNode
  component: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    // Log the error to Firebase Analytics
    const analytics = getAnalytics(app)
    logEvent(analytics, 'error', {
      error_message: error.message,
      error_name: error.name,
      error_stack: error.stack,
      component: this.props.component,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded">
          <h2 className="text-lg font-bold text-red-500">Something went wrong</h2>
          <p className="mt-2 text-sm">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
} 