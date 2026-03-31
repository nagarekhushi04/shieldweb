import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMyReports } from '../lib/api';
import type { Report } from '../types';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';

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
        setReports(data);
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
      <div className="min-h-screen bg-surface text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-slate-400">Please connect your wallet to view the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full flex pt-8 px-4 gap-8">
        <aside className="w-80 hidden lg:flex flex-col gap-8 pb-12">
          <div className="text-center p-8 glass-card">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-cyber-blue to-neon-purple p-1 shadow-[0_0_20px_rgba(56,189,248,0.3)] mb-4">
               <div className="w-full h-full rounded-full bg-surface-low overflow-hidden flex items-center justify-center font-black text-2xl text-white">
                 {user.walletAddress.slice(0, 2)}
               </div>
            </div>
            <h2 className="font-bold text-lg text-white font-mono lowercase">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</h2>
            <div className="mt-6">
              <p className="text-4xl font-black text-cyber-blue">{user.shw3Balance} <span className="text-sm font-medium text-slate-400">SHW3</span></p>
            </div>
            <div className="mt-6 bg-surface-highest rounded-full h-2 overflow-hidden border border-outline">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${user.reputation}%` }}
                className="bg-toxic-green h-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              />
            </div>
            <p className="text-xs mt-3 text-slate-400 uppercase font-black tracking-widest">Reputation: {user.reputation}/100</p>
          </div>
          
          <div className="sentinel-section">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Quick Stats</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-400">Total Reports</span>
                   <span className="text-xl font-bold text-white uppercase">{user.totalReports}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-400">Verified</span>
                   <span className="text-xl font-bold text-toxic-green">{user.verifiedReports}</span>
                </div>
             </div>
          </div>
        </aside>

        <main className="flex-1 p-0 lg:p-4">
          <h1 className="text-4xl font-black text-white mb-10 tracking-tighter">Command Center</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             <div className="sentinel-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="w-24 h-24 bg-primary rounded-full blur-3xl" />
                </div>
                <h3 className="text-slate-400 text-sm font-black uppercase tracking-widest mb-2">Network Impact</h3>
                <p className="text-3xl font-black text-white">{user.totalReports || 0} Attacks Thwarted</p>
             </div>
             <div className="sentinel-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="w-24 h-24 bg-toxic-green rounded-full blur-3xl" />
                </div>
                <h3 className="text-slate-400 text-sm font-black uppercase tracking-widest mb-2">Trust Level</h3>
                <p className="text-3xl font-black text-toxic-green">{user.reputation}% Accuracy</p>
             </div>
          </div>

          <div className="glass-card overflow-hidden">
            <h2 className="text-xl font-black text-white p-6 border-b border-outline uppercase tracking-tight">Report History</h2>
            <div className="overflow-x-auto">
              {loading ? (
                <p className="p-12 text-center text-slate-400">Loading your secure records...</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-low/50">
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                      <th className="p-6">Target URL</th>
                      <th className="p-6">Status</th>
                      <th className="p-6">Reward</th>
                      <th className="p-6">Blockchain TX</th>
                      <th className="p-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline">
                    {reports.map((report: any) => (
                      <tr key={report._id} className="hover:bg-surface-highest/20 transition-colors">
                        <td className="p-6 text-sm font-mono text-slate-300 max-w-[200px] truncate">{report.url}</td>
                        <td className="p-6">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            report.status === 'Verified' ? 'bg-toxic-green/10 text-toxic-green border border-toxic-green/20' : 'bg-slate-800 text-slate-400 border border-outline'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-6 text-cyber-blue font-black tracking-tighter">+{report.reward} <span className="text-[10px]">SHW3</span></td>
                        <td className="p-6 font-mono text-xs text-slate-500">
                          {report.txHash ? 
                            <a href={`https://stellar.expert/explorer/testnet/tx/${report.txHash}`} target="_blank" rel="noreferrer" className="text-cyber-blue hover:text-white transition-colors underline decoration-dotted">
                              {report.txHash.slice(0, 8)}...
                            </a> 
                          : <span className="italic">On-chain pending</span>}
                        </td>
                        <td className="p-6 text-slate-500 text-xs">{new Date(report.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {reports.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500 font-medium italic">No security reports found for this wallet.</td>
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
  );
};
