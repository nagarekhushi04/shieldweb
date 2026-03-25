import { create } from 'zustand';
import type { ThreatCheckResult, GlobalStats } from '../types';
import { checkUrl, getGlobalStats } from '../lib/api';

interface ThreatState {
  recentChecks: ThreatCheckResult[];
  isChecking: boolean;
  lastResult: ThreatCheckResult | null;
  stats: GlobalStats | null;
  check: (url: string) => Promise<ThreatCheckResult>;
  fetchStats: () => Promise<void>;
}

export const useThreatStore = create<ThreatState>((set) => ({
  recentChecks: [],
  isChecking: false,
  lastResult: null,
  stats: null,

  check: async (url: string) => {
    set({ isChecking: true, lastResult: null });
    try {
      const result = await checkUrl(url);
      set((state) => ({
        lastResult: result,
        recentChecks: [result, ...state.recentChecks].slice(0, 10),
      }));
      return result;
    } catch (error) {
      console.error('Check failed', error);
      throw error;
    } finally {
      set({ isChecking: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await getGlobalStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  }
}));
