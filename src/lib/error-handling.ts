import { getAnalytics, logEvent } from 'firebase/analytics'
import { app } from '@/firebase/client'

type ErrorContext = {
  component?: string
  action?: string
  data?: unknown
  userId?: string
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: ErrorContext
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown, context?: ErrorContext) {
  if (error instanceof AppError) {
    // Log to Firebase Analytics
    const analytics = getAnalytics(app)
    logEvent(analytics, 'error', {
      error_code: error.code,
      error_message: error.message,
      component: context?.component || error.context?.component,
      action: context?.action || error.context?.action,
      data: context?.data || error.context?.data,
      userId: context?.userId || error.context?.userId,
    })

    // Return a user-friendly error message
    return {
      message: error.message,
      code: error.code,
    }
  }

  // Handle unexpected errors
  const analytics = getAnalytics(app)
  logEvent(analytics, 'error', {
    error_code: 'UNEXPECTED_ERROR',
    error_message: error instanceof Error ? error.message : 'An unexpected error occurred',
    component: context?.component,
    action: context?.action,
    data: context?.data,
    userId: context?.userId,
  })

  return {
    message: 'An unexpected error occurred',
    code: 'UNEXPECTED_ERROR',
  }
}

export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      throw handleError(error, context)
    }
  }) as T
}

export function logError(error: unknown, context?: ErrorContext) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error)
    if (context) {
      console.error('Context:', context)
    }
  }

  handleError(error, context)
} 