import axios from 'axios';
import type { 
  ThreatCheckResult, 
  User, 
  Report, 
  LeaderboardEntry, 
  GlobalStats, 
  ReportData 
} from '../types';

export const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001' 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shieldweb3_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, 
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/verify')) { 
      localStorage.removeItem('shieldweb3_token');
      localStorage.removeItem('shieldweb3_user');
      // We don't force redirect here to avoid losing user input; 
      // let the component handle the 401 via toast or local state.
    }
    return Promise.reject(err);
  }
);

export async function checkUrl(url: string): Promise<ThreatCheckResult> {
  const res = await api.get(`/api/threats/check`, { params: { url } });
  return res.data;
}

export async function submitReport(data: ReportData): Promise<{ reportId: string; mlScore: number; txHash: string | null }> {
  const res = await api.post(`/api/reports/submit`, data);
  return res.data;
}

export async function getChallenge(walletAddress: string): Promise<{ challenge: string; expiresAt: number }> {
  const res = await api.post(`/api/auth/challenge`, { walletAddress });
  return res.data;
}

export async function verifyAuth(walletAddress: string, signature: string, challenge: string): Promise<{ token: string; user: User }> {
  const res = await api.post(`/api/auth/verify`, { walletAddress, signature, challenge });
  return res.data;
}

export async function getMyReports(): Promise<Report[]> {
  const res = await api.get(`/api/reports/my-reports`);
  return res.data;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await api.get(`/api/stats/leaderboard`);
  return res.data;
}

export async function getGlobalStats(): Promise<GlobalStats> {
  const res = await api.get(`/api/stats/global`);
  return res.data;
}

export async function getRewardBalance(walletAddress: string): Promise<{ shw3: string; xlm: string }> {
  const res = await api.get(`/api/rewards/balance/${walletAddress}`);
  return res.data;
}
