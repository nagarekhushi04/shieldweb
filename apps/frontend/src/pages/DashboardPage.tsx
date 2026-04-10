import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMyReports } from '../lib/api';
import type { Report } from '../types';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  Terminal,
  Zap,
  ExternalLink,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  Activity,
  User,
  History,
  TrendingUp,
  FileText
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Shared Dashboard Utility Components
// ─────────────────────────────────────────────────────────────

const DashCard: React.FC<{
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  color?: string;
}> = ({ title, value, subValue, icon: Icon, color = '#ef233c' }) => (
  <div className="card-hover p-6">
    <div className="flex justify-between items-start mb-4">
      <span className="text-caption">{title}</span>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon size={16} color={color} />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-heading-md" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{value}</span>
      {subValue && <span className="text-[0.7rem] text-text-tertiary font-bold tracking-wider">{subValue}</span>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────────────────────

export const DashboardPage: React.FC = () => {
  const { user, isConnected } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) return;

    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getMyReports();
        setReports(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isConnected]);

  if (!isConnected || !user) {
    return (
      <div className="min-h-screen bg-ground">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="card p-10 text-center max-w-md border-danger/20">
            <Shield className="h-12 w-12 text-danger mx-auto mb-6 opacity-40" />
            <h2 className="text-heading-md mb-2">Access Restricted</h2>
            <p className="text-body text-sm mb-8">Please connect your authorized Stellar wallet to access the security console.</p>
            <button className="btn-primary w-full" onClick={() => window.location.href = '/'}>Go to Homepage</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ground">
      <Navbar />

      <div className="container-page pt-32 pb-20">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky/10 border border-sky/20 flex items-center justify-center">
                <LayoutDashboard size={18} className="text-sky" />
              </div>
              <h1 className="text-heading-lg !mb-0">Security Console</h1>
            </div>
            <p className="text-body text-sm">Monitor your on-chain threat intelligence and rewards.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-secondary py-2 px-4 text-xs">
              <FileText size={14} className="mr-2" />
              Audit Report
            </button>
            <button className="btn-primary py-2 px-4 text-xs" onClick={() => window.location.href = '/report'}>
              <Zap size={14} className="mr-2 fill-white" />
              Submit Threat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar: Profile & Stats */}
          <aside className="lg:col-span-4 space-y-6">
            {/* User Profile Card */}
            <div className="card p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-surface-raised border border-border-mid flex items-center justify-center text-heading-md text-sky-bright">
                    {user.walletAddress.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-mono text-xs text-text-tertiary mb-1">Stellar Address</div>
                    <div className="text-sm font-bold text-text-primary">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-6)}
                    </div>
                  </div>
                </div>
                <span className="badge-safe py-1 px-3">Active Node</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-caption">Reputation Score</span>
                    <span className="text-mono text-sm text-safe">{user.reputation}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-low rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${user.reputation}%` }}
                      className="h-full bg-safe shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-low border border-border">
                    <div className="text-caption text-[0.6rem] mb-1">Balance</div>
                    <div className="text-heading-md !text-lg text-sky-bright">{user.shw3Balance} <span className="text-[0.6rem] text-text-tertiary">SHW3</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-low border border-border">
                    <div className="text-caption text-[0.6rem] mb-1">Rank</div>
                    <div className="text-heading-md !text-lg text-warn">#142</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-tertiary">
                  <Activity size={14} />
                  <span className="text-caption text-xs uppercase tracking-wider">Node Uptime</span>
                </div>
                <span className="text-mono text-xs text-safe">99.9%</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 gap-4">
              <DashCard
                title="Verified Interceptions"
                value={user.verifiedReports}
                subValue={`/ ${user.totalReports}`}
                icon={CheckCircle2}
                color="#ef233c"
              />
              <DashCard
                title="Reward Yield"
                value={`+${Number(user.shw3Balance || 0) * 1.2}`}
                subValue="EST. MONTHLY"
                icon={TrendingUp}
                color="#f59e0b"
              />
            </div>
          </aside>

          {/* Right Main Area: History / Ledger */}
          <main className="lg:col-span-8 space-y-6">
            <div className="card overflow-hidden">
              <div className="px-8 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-text-tertiary" />
                  <span className="text-caption text-xs">Incident Ledger</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-live w-2 h-2" />
                  <span className="text-[0.65rem] font-bold text-safe uppercase tracking-wider">Live Ledger Sync</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="py-24 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-sky/30 border-t-sky rounded-full animate-spin mb-4" />
                    <span className="text-caption text-xs">Synchronizing on-chain records...</span>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface-low/50">
                        <th className="px-8 py-4 text-caption text-[0.65rem]">Target Identity</th>
                        <th className="px-8 py-4 text-caption text-[0.65rem]">Status</th>
                        <th className="px-8 py-4 text-caption text-[0.65rem]">Yield</th>
                        <th className="px-8 py-4 text-caption text-[0.65rem]">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {reports.map((report: any) => (
                        <tr key={report._id} className="hover:bg-surface-low transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-mono text-text-primary mb-1 max-w-[280px] truncate">{report.url}</span>
                              <span className="text-[0.65rem] text-text-tertiary">
                                {new Date(report.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={report.status === 'Verified' ? 'badge-safe' : 'badge-neutral'}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <span className="text-mono text-sm font-bold text-text-primary">+{report.reward}</span>
                              <span className="text-[0.65rem] text-text-tertiary font-bold">SHW3</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {report.txHash ? (
                              <a
                                href={`https://stellar.expert/explorer/testnet/tx/${report.txHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sky-bright hover:text-sky transition-colors text-[0.7rem] font-mono group"
                              >
                                {report.txHash.slice(0, 10)}...
                                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 text-text-tertiary">
                                <Clock size={12} className="animate-pulse" />
                                <span className="text-[0.65rem] font-bold uppercase tracking-wider">Pending</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {reports.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-32 text-center">
                            <Shield size={32} className="mx-auto mb-4 text-text-tertiary opacity-20" />
                            <p className="text-sm text-text-tertiary italic">No security incidents detected on your node.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
