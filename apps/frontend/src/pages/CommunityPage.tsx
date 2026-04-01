import React, { useEffect, useState } from 'react';
import { Users, Shield, Award, Terminal, ArrowRight, Star, ThumbsUp, Anchor, Zap, Globe, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { LiveThreatFeed } from '../components/LiveThreatFeed';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

interface Contributor {
  walletAddress: string;
  totalReports: number;
  verifiedReports: number;
  shw3Earned: string;
  badge: string;
}

export const CommunityPage: React.FC = () => {
  const { walletAddress } = useAuthStore();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/community/contributors`);
        setContributors(res.data);
      } catch (err) {
        console.error('Failed to fetch contributors');
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  return (
    <div className="min-h-screen bg-surface selection:bg-cyber-blue/30 overflow-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Users className="w-4 h-4" />
            <span>500+ SECURITY AGENTS MOBILIZED</span>
          </motion.div>
          <h1 className="text-editorial text-6xl md:text-8xl mb-8">
            Defend the <span className="text-gradient">Stellar Ledger.</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
            ShieldWeb3 is an autonomous community collective. Join the frontlines, verify indicators of compromise, 
            and earn protocol rewards for network sanitation.
          </p>
        </div>

        {/* Missions / Ways to Contribute */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {[
            { icon: Target, title: "Report Incursions", desc: "Scan and commit malicious URLs to lead the indexes. Earn 10 SHW3 per verified hit.", reward: "10 SHW3" },
            { icon: ThumbsUp, title: "Validate Data", desc: "Audit community submissions to ensure ledger integrity. Earn via protocol consensus.", reward: "1 SHW3" },
            { icon: Anchor, title: "Ledger Staking", desc: "Lock protocol liquidity to activate high-trust verification privileges.", reward: "25 SHW3" },
          ].map((card, i) => (
            <div key={i} className="sentinel-card group !p-10 cursor-default">
              <div className="w-16 h-16 rounded-[1.5rem] bg-surface-highest/50 flex items-center justify-center mb-8 text-cyber-blue border border-white/5 group-hover:scale-110 transition-all duration-500 shadow-xl">
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-editorial mb-4 uppercase tracking-tighter">{card.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed mb-10 font-medium group-hover:text-slate-300 transition-colors">{card.desc}</p>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-toxic-green border-t border-white/5 pt-6">
                <span>Yield: {card.reward}</span>
                <ArrowRight className="w-5 h-5 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Leaderboard Section */}
          <div className="lg:col-span-2">
            <div className="sentinel-section !p-0 overflow-hidden relative">
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-surface-low/30 backdrop-blur-3xl">
                <div className="flex items-center gap-4">
                  <Award className="w-7 h-7 text-cyber-blue" />
                  <h2 className="text-3xl font-editorial uppercase tracking-tighter">Top Defenders</h2>
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">RANKING INDEX</div>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-32 text-center text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">
                    Synchronizing NETWORK RECORDS...
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {contributors.map((c, i) => (
                      <div 
                        key={c.walletAddress} 
                        className={`flex items-center justify-between px-10 py-8 transition-colors group ${
                          c.walletAddress.includes(walletAddress?.slice(0,4) || 'NOT_FOUND') 
                          ? 'bg-cyber-blue/10' 
                          : 'hover:bg-white/[0.02]'
                      }`}
                      >
                        <div className="flex items-center gap-8">
                          <div className="w-10 h-10 rounded-xl bg-surface-highest/40 flex items-center justify-center text-[10px] font-black text-slate-400 border border-white/5">
                            #{i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-mono font-bold text-white mb-1 group-hover:text-cyber-blue transition-colors">{c.walletAddress}</p>
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded tracking-widest border ${
                              c.badge === 'Guardian' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' :
                              c.badge === 'Sentinel' ? 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}>
                              Rank: {c.badge}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-16">
                          <div className="text-right">
                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Verifications</p>
                            <p className="text-xl font-editorial text-white">{c.verifiedReports}</p>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Yield</p>
                            <div className="flex items-center justify-end gap-2">
                               <p className="text-xl font-editorial text-toxic-green">{c.shw3Earned}</p>
                               <span className="text-[9px] font-black text-toxic-green tracking-tighter">SHW3</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-10">
            <div className="sentinel-card !bg-surface-highest/10 !border-white/5 !p-8">
              <h3 className="text-base font-editorial mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <Terminal className="w-4 h-4 text-cyber-blue" />
                Network Protocol
              </h3>
              <ul className="space-y-8 text-sm font-medium">
                {[
                  { icon: Zap, text: "Commit SHA-256 identifiers of malicious scripts instantly.", color: "text-cyber-blue" },
                  { icon: Globe, text: "Ensure destination origin matches threat classification.", color: "text-neon-cyan" },
                  { icon: Shield, text: "On-chain records are immutable. Integrity is non-negotiable.", color: "text-toxic-green" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 group">
                    <div className={`mt-1 h-5 w-5 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${item.color}`}>
                       <item.icon className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[9px] text-slate-600 leading-relaxed uppercase font-black tracking-[0.3em] flex items-center gap-3">
                  <Shield className="h-3 w-3" /> System Warning: False nodes will be pruned.
                </p>
              </div>
            </div>
            
            <LiveThreatFeed />
          </div>
        </div>
      </main>
    </div>
  );
};
