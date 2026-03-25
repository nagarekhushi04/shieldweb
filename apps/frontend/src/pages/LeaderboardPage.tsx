import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/api';
import type { LeaderboardEntry } from '../types';

export const LeaderboardPage: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setLeaders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-navy text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Top Reporters Leaderboard</h1>
        
        {loading ? (
          <p className="text-center">Loading leaderboard...</p>
        ) : (
          <div className="bg-slate rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-navy border-b border-gray-700">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Wallet</th>
                  <th className="p-4 hidden sm:table-cell">Reports</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4 text-right">SHW3 Earned</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((entry) => (
                  <tr key={entry.walletAddress} className="border-b border-gray-700 hover:bg-navy/50 transition-colors">
                    <td className="p-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${entry.rank === 1 ? 'bg-yellow-500 text-black' : 
                          entry.rank === 2 ? 'bg-gray-300 text-black' : 
                          entry.rank === 3 ? 'bg-amber-600 text-white' : 'bg-navy border border-gray-600'}`
                      }>
                        {entry.rank}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">
                      {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                      <span className="ml-2 text-xs px-2 py-1 bg-primary-blue/20 text-primary-blue rounded-full">
                        {entry.badge}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-gray-400">{entry.totalReports}</td>
                    <td className="p-4 text-safe-green font-medium">{entry.verifiedReports}</td>
                    <td className="p-4 text-right font-bold text-primary-blue">{entry.shw3Earned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
