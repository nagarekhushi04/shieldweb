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
  // Force offline mode for Red Noir UI Demo since backend is completely removed.
  return '';
}

export const api = axios.create({ 
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  adapter: async (config) => {
    // Force offline mode: completely swallow actual HTTP execution.
    // Return empty/mock data immediately without firing XHR to avoid console 500 errors.
    console.warn('[Offline Mode Active] Intercepted network request to:', config.url);
    
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let mockData: any = null;
    
    // --- USER CONTROL DATA LAYER (localStorage DB) ---
    const initDB = () => {
      const db = localStorage.getItem('shw3_local_db');
      if (db) return JSON.parse(db);
      const newDb = {
        stats: { totalThreats: 0, verifiedThreats: 0, totalReporters: 1, threatsBlockedToday: 0 },
        reports: [] as any[],
        trends: [] as any[],
        breakdown: [] as any[],
        domains: [] as any[]
      };
      localStorage.setItem('shw3_local_db', JSON.stringify(newDb));
      return newDb;
    };
    const db = initDB();
    const saveDB = (newDb: any) => localStorage.setItem('shw3_local_db', JSON.stringify(newDb));

    // Handle submissions to update the local DB
    if (config.url?.includes('reports/submit') && config.method === 'post') {
      const payload = JSON.parse(config.data || '{}');
      const newReport = {
        id: Math.random().toString(36).substring(7),
        url: payload.url,
        type: payload.threatType || 'Phishing',
        status: 'verified',
        timestamp: new Date().toISOString()
      };
      db.reports.push(newReport);
      db.stats.totalThreats += 1;
      db.stats.threatsBlockedToday += 1;
      
      // Update breakdown
      const typeEntry = db.breakdown.find((b: any) => b.type === newReport.type);
      if (typeEntry) typeEntry.percentage = Math.max(typeEntry.percentage + 1, 100);
      else db.breakdown.push({ type: newReport.type, percentage: 100 });

      // Update domains
      const domain = new URL(payload.url.startsWith('http') ? payload.url : `http://${payload.url}`).hostname;
      const domainEntry = db.domains.find((d: any) => d.domain === domain);
      if (domainEntry) domainEntry.count += 1;
      else db.domains.push({ domain, count: 1 });

      saveDB(db);
      return { data: { reportId: newReport.id, mlScore: 99, txHash: '0xmock' }, status: 200, statusText: 'OK', headers: {}, config, request: {} };
    }

    // Handle Auth Mocking locally
    if (config.url?.includes('auth/challenge')) {
      return { data: { challenge: 'MOCK_CHALLENGE_STMT', expiresAt: Date.now() + 600000 }, status: 200, statusText: 'OK', headers: {}, config, request: {} };
    }
    
    if (config.url?.includes('auth/verify')) {
      const payload = JSON.parse(config.data || '{}');
      return { 
        data: { 
          token: 'mock_jwt_token_offline', 
          user: {
            walletAddress: payload.walletAddress,
            role: 'user',
            reputation: 100,
            shw3Balance: 0,
            totalReports: db.reports.length,
            verifiedReports: db.reports.length
          }
        }, 
        status: 200, statusText: 'OK', headers: {}, config, request: {} 
      };
    }

    // Dynamic User-Controlled Routes
    if (config.url?.includes('count')) mockData = { onboarded: db.stats.totalReporters };
    if (config.url?.includes('stats/global')) mockData = db.stats;
    if (config.url?.includes('stats/trends')) mockData = db.trends;
    if (config.url?.includes('stats/breakdown')) mockData = db.breakdown;
    if (config.url?.includes('stats/top-domains')) mockData = db.domains.sort((a: any, b: any) => b.count - a.count).slice(0, 5);
    if (config.url?.includes('reports/my-reports')) mockData = db.reports;
    
    // Remaining harmless mock routes
    if (config.url?.includes('health/detailed')) mockData = { services: { stellar: { status: 'operational' }, indexing: { status: 'operational' } } };
    if (config.url?.includes('stats/ml-performance')) mockData = { accuracy: 99.9 };
    if (config.url?.includes('community/contributors')) {
      const wallet = localStorage.getItem('shieldweb3_user') ? JSON.parse(localStorage.getItem('shieldweb3_user')!).walletAddress : 'You (Offline)';
      mockData = [{
        walletAddress: wallet,
        totalReports: db.reports.length,
        verifiedReports: db.reports.length,
        shw3Earned: (db.reports.length * 10).toString(),
        badge: db.reports.length > 5 ? 'Guardian' : 'Sentinel'
      }];
    }
    if (config.url?.includes('rewards/balance')) mockData = { shw3: (db.reports.length * 5).toString(), xlm: '0' };
    
    return {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      request: {}
    };
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shieldweb3_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    if (typeof response.data === 'string' && (response.data.includes('<!DOCTYPE') || (contentType && !contentType.includes('application/json')))) {
      return { ...response, data: null };
    }
    return response;
  }, 
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/verify')) { 
      localStorage.removeItem('shieldweb3_token');
      localStorage.removeItem('shieldweb3_user');
    }
    
    // Completely swallow all connection refused errors and return mock-friendly null data
    // This allows the Red Noir UI Demo to display its frontend without crashing from missing APIs
    console.warn('[Offline Mode Active] Suppressed failed API request to:', err.config?.url);
    return Promise.resolve({ data: null, status: 0 });
  }
);

export async function checkUrl(url: string): Promise<ThreatCheckResult | null> {
  // Mock offline response
  return {
    safe: !url.includes('scam') && !url.includes('phish'),
    threatType: url.includes('scam') ? 'Phishing' : undefined,
    confidence: 0.98,
    details: 'Offline mode active.'
  } as any;
}

export async function submitReport(data: ReportData): Promise<{ reportId: string; mlScore: number; txHash: string | null } | null> {
  try {
    const res = await api.post(`/api/reports/submit`, data);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getChallenge(walletAddress: string): Promise<{ challenge: string; expiresAt: number } | null> {
  try {
    const res = await api.post(`/api/auth/challenge`, { walletAddress });
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function verifyAuth(walletAddress: string, signature: string, challenge: string): Promise<{ token: string; user: User } | null> {
  try {
    const res = await api.post(`/api/auth/verify`, { walletAddress, signature, challenge });
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getMyReports(): Promise<Report[]> {
  try {
    const res = await api.get(`/api/reports/my-reports`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return [];
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await api.get(`/api/stats/leaderboard`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return [];
  }
}

export async function getGlobalStats(): Promise<GlobalStats | null> {
  // Mock response to silence network errors
  return {
    totalThreats: 15420,
    totalReporters: 2304,
    verifiedThreats: 98,
    activeStakes: "1.5M"
  } as any;
}

export async function getRewardBalance(walletAddress: string): Promise<{ shw3: string; xlm: string } | null> {
  try {
    const res = await api.get(`/api/rewards/balance/${walletAddress}`);
    return res.data;
  } catch (err) {
    return null;
  }
}
