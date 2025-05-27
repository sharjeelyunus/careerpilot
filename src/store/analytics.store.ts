import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalyticsData } from '@/lib/services/analytics.service';
import { fetchAnalyticsData } from '@/lib/services/analytics.service';
import { Interview } from '@/types';

interface AnalyticsStore {
  analyticsData: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetchAnalytics: (interviews: Interview[], force?: boolean) => Promise<void>;
  updateSpecificAnalytics: <K extends keyof AnalyticsData>(key: K, value: AnalyticsData[K]) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      analyticsData: null,
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchAnalytics: async (interviews: Interview[], force = false) => {
        const { lastUpdated, analyticsData } = get();
        const now = Date.now();

        // Return cached data if it's fresh enough and not forced
        if (
          !force &&
          lastUpdated &&
          analyticsData &&
          now - lastUpdated < CACHE_DURATION
        ) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await fetchAnalyticsData(interviews);
          set({ 
            analyticsData: data, 
            isLoading: false,
            lastUpdated: now,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
            isLoading: false 
          });
        }
      },

      updateSpecificAnalytics: <K extends keyof AnalyticsData>(key: K, value: AnalyticsData[K]) => {
        const { analyticsData } = get();
        if (analyticsData) {
          set({
            analyticsData: {
              ...analyticsData,
              [key]: value
            },
            lastUpdated: Date.now()
          });
        }
      }
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({
        analyticsData: state.analyticsData,
        lastUpdated: state.lastUpdated
      })
    }
  )
); 