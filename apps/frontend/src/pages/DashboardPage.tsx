import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMyReports } from '../lib/api';
import type { Report } from '../types';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';
import { Shield, Award, Terminal, Zap, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';

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
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="sentinel-section text-center max-w-md">
            <Shield className="h-16 w-16 text-slate-700 mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-editorial mb-4">Access Restricted</h2>
            <p className="text-slate-400 mb-8 font-medium">Please connect your authorized Stellar wallet to view the security command center.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-40 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar / Profile - Level 6 */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Shield className="h-40 w-40 text-cyber-blue" />
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-28 h-28 mx-auto rounded-[2rem] bg-gradient-to-tr from-cyber-blue to-neon-purple p-1 mb-8 shadow-2xl">
                   <div className="w-full h-full rounded-[1.8rem] bg-surface-low overflow-hidden flex items-center justify-center font-editorial text-3xl">
                     {user.walletAddress.slice(0, 2)}
                   </div>
                </div>
                
                <h2 className="font-mono text-sm tracking-tighter text-slate-400 mb-2">{user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toxic-green/10 border border-toxic-green/30 text-toxic-green text-[9px] font-black uppercase tracking-widest mb-8">
                  <Award className="h-3 w-3" /> Level 6 Defender
                </div>
                
                <div className="bg-surface-highest/40 p-6 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">On-Chain Balance</p>
                  <p className="text-4xl font-editorial text-white">{user.shw3Balance} <span className="text-xs font-medium text-cyber-blue">SHW3</span></p>
                </div>
                
                <div className="mt-8 text-left">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Reputation</span>
                    <span className="text-sm font-bold text-toxic-green">{user.reputation}%</span>
                  </div>
                  <div className="bg-surface-highest/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${user.reputation}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-cyber-blue to-toxic-green h-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sentinel-section p-8 !rounded-[2rem]">
               <div className="flex items-center gap-3 mb-6">
                 <Terminal className="h-4 w-4 text-cyber-blue" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Node Status</h3>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between items-center group">
                     <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Total Interceptions</span>
                     <span className="text-xl font-editorial text-white">{user.totalReports}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                     <span className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">Verified Claims</span>
                     <span className="text-xl font-editorial text-toxic-green">{user.verifiedReports}</span>
                  </div>
               </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-5xl font-editorial tracking-tight mb-2 uppercase">Sentinel <span className="text-gradient">Control.</span></h1>
                <p className="text-slate-400 font-medium italic">Operational dashboard for autonomous network defense</p>
              </div>
              <button className="btn-sentinel-primary text-xs py-3 px-6 !rounded-full">Export Security Audit</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="sentinel-card relative overflow-hidden group border-cyber-blue/10">
                  <div className="absolute top-0 right-0 p-6 opacity-20 text-cyber-blue">
                     <Zap className="h-12 w-12" />
                  </div>
                  <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Community Impact</h3>
                  <p className="text-4xl font-editorial text-white">{user.totalReports || 0} <span className="text-lg text-slate-500">Attacks Deflected</span></p>
                  <p className="text-xs text-slate-400 mt-4 font-medium italic">You are in the top 5% of network defenders globally.</p>
               </div>
               
               <div className="sentinel-card relative overflow-hidden group border-toxic-green/10">
                  <div className="absolute top-0 right-0 p-6 opacity-20 text-toxic-green">
                     <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Verification Score</h3>
                  <p className="text-4xl font-editorial text-toxic-green">A+ <span className="text-lg text-slate-500">Trust Rating</span></p>
                  <p className="text-xs text-slate-400 mt-4 font-medium italic">Your signatures are prioritized by Soroban validators.</p>
               </div>
            </div>

            <div className="sentinel-section !p-0 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-neon-purple" />
                  <h2 className="text-xl font-editorial tracking-tighter uppercase">Incident Ledger</h2>
                </div>
                <div className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Live Filter Enabled</div>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-20 text-center space-y-4">
                    <div className="animate-spin h-10 w-10 border-4 border-cyber-blue border-t-transparent rounded-full mx-auto" />
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">Decrypting SECURE RECORDS...</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-highest/20">
                      <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
                        <th className="px-8 py-6">Target Identity</th>
                        <th className="px-8 py-6">Intelligence</th>
                        <th className="px-8 py-6">Reward Yield</th>
                        <th className="px-8 py-6">Validation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reports.map((report: any) => (
                        <tr key={report._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-8">
                            <div className="flex flex-col">
                              <span className="text-sm font-mono text-white mb-1 group-hover:text-cyber-blue transition-colors max-w-[300px] truncate">{report.url}</span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              report.status === 'Verified' 
                                ? 'bg-toxic-green/5 text-toxic-green border-toxic-green/20' 
                                : 'bg-white/5 text-slate-400 border-white/5'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-2">
                              {report.status === 'Verified' && <Zap className="h-3 w-3 text-neon-purple" />}
                              <span className="text-xl font-editorial text-white tracking-tighter">+{report.reward}</span>
                              <span className="text-[9px] font-black text-slate-500 uppercase">SHW3</span>
                            </div>
                          </td>
                          <td className="px-8 py-8">
                            {report.txHash ? 
                              <a href={`https://stellar.expert/explorer/testnet/tx/${report.txHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cyber-blue hover:text-white transition-all text-xs font-mono group/link bg-cyber-blue/10 px-3 py-1.5 rounded-lg border border-cyber-blue/20">
                                {report.txHash.slice(0, 10)}... <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                              </a> 
                            : <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse" /> Finalizing on-chain
                              </span>}
                          </td>
                        </tr>
                      ))}
                      {reports.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-32 text-center">
                            <div className="max-w-xs mx-auto">
                              <Shield className="h-12 w-12 text-slate-800 mx-auto mb-6 opacity-20" />
                              <p className="text-slate-500 font-medium italic mb-2">No synchronized records found.</p>
                              <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">All reports are automatically purged if not on-chain.</p>
                            </div>
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
