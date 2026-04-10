import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/api';
import type { LeaderboardEntry } from '../types';
import { Navbar } from '../components/Navbar';
import { Trophy, Medal, Star, ExternalLink, Activity, Award } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-ground">
      <Navbar />
      
      <main className="container-page pt-32 pb-20">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-warn/10 border border-warn/20 flex items-center justify-center">
                <Trophy size={20} className="text-warn" />
             </div>
             <span className="text-caption text-xs tracking-widest">Network Hall of Fame</span>
          </div>
          <h1 className="text-heading-lg mb-4">Top Network Defenders.</h1>
          <p className="text-body text-sm">
            Recognizing the nodes with the highest reputation and most verified threat reports on the Stellar network.
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-sky/30 border-t-sky rounded-full animate-spin mb-4" />
            <span className="text-caption text-xs">Fetching leaderboard data...</span>
          </div>
        ) : (
          <div className="card overflow-hidden max-w-5xl mx-auto">
            <div className="px-8 py-5 border-b border-border bg-surface-low/30 backdrop-blur-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Activity size={16} className="text-sky-bright" />
                 <span className="text-caption text-xs font-bold">Top Contributors</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="badge-safe py-0 px-2 text-[0.6rem]">Synced</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-low/50">
                    <th className="px-8 py-5 text-caption text-[0.65rem] w-24 text-center">Rank</th>
                    <th className="px-8 py-5 text-caption text-[0.65rem]">Defender Wallet</th>
                    <th className="px-8 py-5 text-caption text-[0.65rem] text-center">Submissions</th>
                    <th className="px-8 py-5 text-caption text-[0.65rem] text-center">Verified</th>
                    <th className="px-8 py-5 text-caption text-[0.65rem] text-right">SHW3 Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leaders.map((entry, idx) => {
                    const isTop3 = idx < 3;
                    return (
                      <tr key={entry.walletAddress} className="hover:bg-surface-low transition-colors group">
                        <td className="px-8 py-6 text-center">
                           <div className="flex items-center justify-center">
                             {idx === 0 ? (
                               <Medal size={20} className="text-[#ffd700]" />
                             ) : idx === 1 ? (
                               <Medal size={20} className="text-[#c0c0c0]" />
                             ) : idx === 2 ? (
                               <Medal size={20} className="text-[#cd7f32]" />
                             ) : (
                               <span className="text-mono text-sm text-text-tertiary font-bold tracking-tighter">
                                 {String(idx + 1).padStart(2, '0')}
                               </span>
                             )}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-xs font-bold transition-all ${isTop3 ? 'border-warn/30 text-warn' : 'text-text-tertiary opacity-70'}`}>
                                {entry.walletAddress.slice(0, 1)}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-mono text-text-primary mb-1">
                                    {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-8)}
                                 </span>
                                 <div className="flex items-center gap-2">
                                    <span className="badge-neutral border-border-mid text-[0.6rem] py-0 px-1.5 opacity-80">{entry.badge}</span>
                                    {isTop3 && idx === 0 && <span className="bg-warn/10 text-warn text-[0.6rem] font-black uppercase px-2 py-0.5 rounded-full border border-warn/20 animate-pulse">Defender Prime</span>}
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center text-mono text-sm text-text-secondary">
                          {entry.totalReports}
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className="flex flex-col items-center">
                              <span className="text-mono text-sm text-text-primary font-bold">{entry.verifiedReports}</span>
                              <div className="w-12 h-1 bg-surface-raised rounded-full mt-1.5 overflow-hidden">
                                 <div 
                                   className="h-full bg-safe shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                                   style={{ width: `${(entry.verifiedReports / entry.totalReports) * 100}%` }}
                                 />
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <div className="flex flex-col items-end">
                                 <span className="text-mono text-sm text-safe font-bold">+{entry.shw3Earned}</span>
                                 <span className="text-[0.65rem] text-text-tertiary font-bold uppercase tracking-widest">Protocol Yield</span>
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-surface-raising border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink size={12} className="text-text-tertiary" />
                              </div>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 border-t border-border bg-surface-low/30 text-center">
               <p className="text-[0.7rem] text-text-tertiary max-w-lg mx-auto italic leading-relaxed">
                  Ranking is determined by verify-to-report ratio and active node uptime on the Stellar network. Reputation is committed to the global ledger hourly.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
