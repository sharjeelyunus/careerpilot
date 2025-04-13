import * as Sentry from '@sentry/nextjs'

declare global {
  interface Window {
    gtag: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void
  }
}

type AnalyticsEvent = {
  category: string
  action: string
  label?: string
  value?: number
}

type PerformanceMetric = {
  name: string
  value: number
  tags?: Record<string, string>
}

export function trackEvent({ category, action, label, value }: AnalyticsEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }
}

export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: path,
    })
  }
}

export function trackError(error: Error, context?: Record<string, string>) {
  Sentry.captureException(error, {
    tags: context,
  })
}

export function trackPerformance(metric: PerformanceMetric) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      metric_name: metric.name,
      metric_value: metric.value,
      ...metric.tags,
    })
  }
}

export function trackUserTiming(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(name)
    window.performance.measure(name, name)
    const measure = window.performance.getEntriesByName(name)[0]
    if (measure) {
      trackPerformance({
        name: 'user_timing',
        value: measure.duration,
        tags: { timing_name: name },
      })
    }
  }
}

export function trackResourceTiming() {
  if (typeof window !== 'undefined' && window.performance) {
    const resources = window.performance.getEntriesByType('resource')
    resources.forEach(resource => {
      const typedResource = resource as PerformanceResourceTiming
      trackPerformance({
        name: 'resource_timing',
        value: typedResource.duration,
        tags: {
          resource_name: typedResource.name,
          initiator_type: typedResource.initiatorType,
        },
      })
    })
  }
} 