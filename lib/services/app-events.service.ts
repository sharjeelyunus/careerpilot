import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '@/firebase/client';

type AppEventParams = Record<string, string | number | boolean>;

export class AppEvents {
  private static analytics: ReturnType<typeof getAnalytics> | null = null;

  private static getAnalytics() {
    if (typeof window === 'undefined') return null;
    if (!this.analytics) {
      this.analytics = getAnalytics(app);
    }
    return this.analytics;
  }

  // Authentication Events
  static async trackSignUp(method: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'sign_up', { 
      method,
      timestamp: new Date().toISOString(),
      ...params 
    });
  }

  static async trackLogin(method: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'login', { 
      method,
      timestamp: new Date().toISOString(),
      ...params 
    });
  }

  static async trackLogout(params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'logout', { 
      timestamp: new Date().toISOString(),
      ...params 
    });
  }

  // Navigation Events
  static async trackPageView(page: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'page_view', { 
      page,
      timestamp: new Date().toISOString(),
      ...params 
    });
  }

  // Interview Flow Events
  static async trackInterviewStart(interviewId: string, type: string, difficulty: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'interview_start', {
      interview_id: interviewId,
      interview_type: type,
      difficulty_level: difficulty,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  static async trackInterviewComplete(interviewId: string, score: number, duration: number, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'interview_complete', {
      interview_id: interviewId,
      score,
      duration_seconds: duration,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  static async trackQuestionAttempt(interviewId: string, questionId: string, timeSpent: number, correct: boolean, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'question_attempt', {
      interview_id: interviewId,
      question_id: questionId,
      time_spent_seconds: timeSpent,
      is_correct: correct,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Interview Creation Events
  static async trackInterviewCreationStart(params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'interview_creation_start', {
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  static async trackInterviewCreationComplete(interviewId: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'interview_creation_complete', {
      interview_id: interviewId,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Interview Navigation Events
  static async trackInterviewNavigation(interviewId: string, fromPage: string, toPage: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'interview_navigation', {
      interview_id: interviewId,
      from_page: fromPage,
      to_page: toPage,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Feedback Events
  static async trackFeedbackView(interviewId: string, feedbackId: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'feedback_view', {
      interview_id: interviewId,
      feedback_id: feedbackId,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  static async trackFeedbackInteraction(interviewId: string, feedbackId: string, action: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'feedback_interaction', {
      interview_id: interviewId,
      feedback_id: feedbackId,
      action,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New User Engagement Events
  static async trackUserEngagement(action: string, duration: number, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'user_engagement', {
      action,
      duration_seconds: duration,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  static async trackUserSession(sessionId: string, duration: number, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'user_session', {
      session_id: sessionId,
      duration_seconds: duration,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Feature Usage Events
  static async trackFeatureUsage(feature: string, action: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'feature_usage', {
      feature,
      action,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Error Events
  static async trackError(error: Error, context?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      timestamp: new Date().toISOString(),
      ...context
    });
  }

  // New User Interaction Events
  static async trackButtonClick(buttonId: string, page: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'button_click', {
      button_id: buttonId,
      page,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  static async trackFormSubmission(formId: string, success: boolean, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'form_submission', {
      form_id: formId,
      success,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Performance Events
  static async trackLoadTime(page: string, loadTime: number, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'page_load_time', {
      page,
      load_time_ms: loadTime,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  static async trackResourceLoad(resourceType: string, loadTime: number, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'resource_load', {
      resource_type: resourceType,
      load_time_ms: loadTime,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Search Events
  static async trackSearch(query: string, resultsCount: number, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'search', {
      query,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
      ...params
    });
  }

  // New Feedback Events
  static async trackFeedback(rating: number, feedback?: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'feedback', {
      rating,
      timestamp: new Date().toISOString(),
      ...(feedback && { feedback }),
      ...params
    });
  }

  // New Custom Event
  static async trackCustomEvent(eventName: string, params?: AppEventParams) {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    logEvent(analytics, eventName, {
      timestamp: new Date().toISOString(),
      ...params
    });
  }
} 