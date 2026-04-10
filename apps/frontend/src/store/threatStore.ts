import { create } from 'zustand';
import type { ThreatCheckResult, GlobalStats } from '../types';
import { checkUrl, getGlobalStats } from '../lib/api';

interface ThreatState {
  recentChecks: ThreatCheckResult[];
  threats: any[];
  isChecking: boolean;
  lastResult: ThreatCheckResult | null;
  stats: GlobalStats | null;
  onboardedCount: string;
  check: (url: string) => Promise<ThreatCheckResult>;
  fetchStats: () => Promise<void>;
  setThreats: (threats: any[]) => void;
}

export const useThreatStore = create<ThreatState>((set) => ({
  recentChecks: [],
  threats: [],
  isChecking: false,
  lastResult: null,
  stats: null,
  onboardedCount: '0',

  check: async (url: string) => {
    set({ isChecking: true, lastResult: null });
    try {
      const result = await checkUrl(url);
      if (!result) throw new Error('Check failed');
      
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
      if (stats) {
        set({ 
          stats, 
          onboardedCount: (stats.totalReporters ?? 0).toString() 
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  },

  setThreats: (threats: any[]) => set({ threats })
}));
