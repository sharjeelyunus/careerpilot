import { create } from 'zustand';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { User } from '@/types';

interface UserState {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

// Create the store
export const useUserStore = create<UserState>((set) => ({
  // Initial state
  user: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user', 
        isLoading: false 
      });
    }
  },
  
  setUser: (user) => set({ user }),
  
  clearUser: () => set({ user: null, error: null }),
})); 