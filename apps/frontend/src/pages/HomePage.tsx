import React, { useEffect } from 'react';
import { useThreatStore } from '../store/threatStore';
import { ThreatChecker } from '../components/ThreatChecker';
import { WalletConnect } from '../components/WalletConnect';
import { Shield } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { stats, fetchStats } = useThreatStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-navy text-white">
      <nav className="sticky top-0 z-50 bg-navy border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-blue" />
              <span className="font-bold text-xl">ShieldWeb3</span>
            </div>
            <div className="hidden md:flex gap-6">
              <a href="/" className="hover:text-primary-blue">Home</a>
              <a href="/report" className="hover:text-primary-blue">Report</a>
              <a href="/leaderboard" className="hover:text-primary-blue">Leaderboard</a>
              <a href="/extension" className="hover:text-primary-blue">Extension</a>
            </div>
            <div className="flex items-center">
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold">Protect Your Web3 Journey</h1>
        <p className="text-xl text-gray-400 mt-4">Real-time phishing detection powered by Stellar blockchain</p>

        <ThreatChecker />

        <div className="bg-slate py-6 mt-16 rounded-xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-blue">{stats?.totalThreats || 0}</div>
              <div className="text-gray-400 text-sm mt-1">Threats Detected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-blue">{stats?.totalReporters || 0}</div>
              <div className="text-gray-400 text-sm mt-1">Reports Submitted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-blue">98,129</div>
              <div className="text-gray-400 text-sm mt-1">Users Protected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-blue">4</div>
              <div className="text-gray-400 text-sm mt-1">Chains Covered</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
