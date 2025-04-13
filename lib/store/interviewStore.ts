import { create } from 'zustand';
import { getInterviewByUserId, getLatestInterviews, getFilterOptions } from '@/lib/actions/general.action';
import { Interview } from '@/types';

// Define types for our store
export interface InterviewFilters {
  type: string[];
  techstack: string[];
  level: string[];
}

export interface FilterOptions {
  type: Array<{ value: string; label: string }>;
  techstack: Array<{ value: string; label: string }>;
  level: Array<{ value: string; label: string }>;
}

export interface InterviewState {
  // State
  userInterviews: Interview[];
  latestInterviews: Interview[];
  filterOptions: FilterOptions;
  filters: InterviewFilters;
  userInterviewsPage: number;
  latestInterviewsPage: number;
  totalUserInterviews: number;
  totalLatestInterviews: number;
  isLoadingUserInterviews: boolean;
  isLoadingLatestInterviews: boolean;
  
  // Actions
  setFilters: (filters: InterviewFilters) => void;
  setUserInterviewsPage: (page: number) => void;
  setLatestInterviewsPage: (page: number) => void;
  fetchUserInterviews: (userId: string, page: number, limit: number) => Promise<void>;
  fetchLatestInterviews: (userId: string | undefined, page: number, limit: number) => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
  handleFilterChange: (key: keyof InterviewFilters, value: string) => void;
  removeFilter: (key: keyof InterviewFilters, value: string) => void;
}

// Create the store
export const useInterviewStore = create<InterviewState>((set, get) => ({
  // Initial state
  userInterviews: [],
  latestInterviews: [],
  filterOptions: {
    type: [],
    techstack: [],
    level: [],
  },
  filters: {
    type: [],
    techstack: [],
    level: [],
  },
  userInterviewsPage: 1,
  latestInterviewsPage: 1,
  totalUserInterviews: 0,
  totalLatestInterviews: 0,
  isLoadingUserInterviews: false,
  isLoadingLatestInterviews: false,
  
  // Actions
  setFilters: (filters) => set({ filters }),
  
  setUserInterviewsPage: (page) => set({ userInterviewsPage: page }),
  
  setLatestInterviewsPage: (page) => set({ latestInterviewsPage: page }),
  
  fetchUserInterviews: async (userId, page, limit) => {
    set({ isLoadingUserInterviews: true });
    try {
      const result = await getInterviewByUserId(
        userId,
        page,
        limit,
        '',
        get().filters
      );
      set({
        userInterviews: result.interviews,
        totalUserInterviews: result.total,
        isLoadingUserInterviews: false,
      });
    } catch (error) {
      console.error('Error fetching user interviews:', error);
      set({ isLoadingUserInterviews: false });
    }
  },
  
  fetchLatestInterviews: async (userId, page, limit) => {
    set({ isLoadingLatestInterviews: true });
    try {
      const result = await getLatestInterviews({
        userId,
        page,
        limit,
        filters: get().filters,
      });
      set({
        latestInterviews: result.interviews,
        totalLatestInterviews: result.total,
        isLoadingLatestInterviews: false,
      });
    } catch (error) {
      console.error('Error fetching latest interviews:', error);
      set({ isLoadingLatestInterviews: false });
    }
  },
  
  fetchFilterOptions: async () => {
    try {
      const options = await getFilterOptions();
      set({ filterOptions: options });
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  },
  
  handleFilterChange: (key, value) => {
    const currentFilters = get().filters;
    const currentValues = currentFilters[key];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    set({
      filters: { ...currentFilters, [key]: newValues },
      userInterviewsPage: 1,
      latestInterviewsPage: 1,
    });
  },
  
  removeFilter: (key, value) => {
    const currentFilters = get().filters;
    set({
      filters: {
        ...currentFilters,
        [key]: currentFilters[key].filter((v) => v !== value),
      },
      userInterviewsPage: 1,
      latestInterviewsPage: 1,
    });
  },
})); 