export const measurePerformance = (metricName: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance metric [${metricName}]: ${duration.toFixed(2)}ms`);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement analytics service integration
    // Example: sendToAnalytics(metricName, duration);
  }
};

export const withPerformanceTracking = <T>(
  metricName: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  return fn().finally(() => measurePerformance(metricName, startTime));
};

export const trackPageLoad = (pageName: string) => {
  if (typeof window !== 'undefined') {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.startTime;
      console.log(`Page load time for ${pageName}: ${loadTime.toFixed(2)}ms`);
    }
  }
};
