import axios from 'axios';
import type { 
  ThreatCheckResult, 
  User, 
  Report, 
  LeaderboardEntry, 
  GlobalStats, 
  ReportData 
} from '../types';
// Determine API base URL:
// - If VITE_API_URL is set (e.g. on Vercel with a hosted backend), use it
// - On localhost dev, fall back to localhost:4001
// - On production with no VITE_API_URL, use '' (relative paths — will 404 gracefully)
function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  const isProduction = typeof window !== 'undefined' 
    && window.location.hostname !== 'localhost' 
    && window.location.hostname !== '127.0.0.1';
  
  return isProduction ? '' : 'http://localhost:4001';
}

export const api = axios.create({ 
  baseURL: getApiBaseUrl(),
  timeout: 10000,
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
    }
    // On production without backend, suppress network errors to avoid console spam
    if (!err.response && getApiBaseUrl() === '') {
      return Promise.resolve({ data: null, status: 0 });
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
