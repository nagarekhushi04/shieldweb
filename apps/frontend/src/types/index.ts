export interface ThreatEntry {
  urlHash: string;
  originalUrl: string;
  domain: string;
  threatType: string;
  severity: number;
  verified: boolean;
  onChainTxHash: string | null;
  createdAt: string;
  upvotes: number;
}

export interface ThreatCheckResult {
  safe: boolean;
  threat: ThreatEntry | null;
  mlScore: number;
  source: string;
}

export interface User {
  walletAddress: string;
  email?: string;
  name?: string;
  totalReports: number;
  verifiedReports: number;
  shw3Balance: string;
  reputation: number;
  isAdmin: boolean;
  onboardingComplete: boolean;
}

export interface Report {
  _id: string;
  url: string;
  threatType: string;
  severity: number;
  status: string;
  reward: number;
  createdAt: string;
  txHash: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  totalReports: number;
  verifiedReports: number;
  shw3Earned: number;
  badge: string;
}

export interface GlobalStats {
  totalThreats: number;
  verifiedThreats: number;
  totalReporters: number;
  threatsBlockedToday: number;
  topThreatTypes: Array<{ type: string; count: number }>;
}

export interface ReportData {
  url: string;
  threatType: string;
  severity: number;
  description?: string;
  evidence?: string;
}
