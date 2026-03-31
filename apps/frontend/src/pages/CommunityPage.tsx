import React, { useEffect, useState } from 'react';
import { Users, Shield, Award, Terminal, ArrowRight, Star, ThumbsUp, MessageSquare, Anchor } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <Users className="w-4 h-4" />
            <span>Join 30+ Security Researchers</span>
          </motion.div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Protecting the <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Stellar Ecosystem</span> Together
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            ShieldWeb3 is a community-driven defense layer. Report threats, verify data, 
            and earn SHW3 tokens for keeping the network safe.
          </p>
        </div>

        {/* How to Contribute */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Shield, title: "Report Threats", desc: "Submit suspicious URLs and earn 10 SHW3 for every verified phishing site.", points: "10 SHW3" },
            { icon: ThumbsUp, title: "Vote on Reports", desc: "Review community reports. Earn points for accuracy and consensus.", points: "1 SHW3" },
            { icon: Anchor, title: "Secure On-Chain", desc: "Stake SHW3 to become a verifier and help finalize on-chain threat records.", points: "25 SHW3" },
          ].map((card, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{card.desc}</p>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-emerald-400">
                <span>Earn {card.points}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  Top Defenders
                </h2>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Global Ranking</div>
              </div>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-800/50 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {contributors.map((c, i) => (
                    <div 
                      key={c.walletAddress} 
                      className={`flex items-center justify-between p-4 rounded-2xl border ${
                        c.walletAddress.includes(walletAddress?.slice(0,4) || 'NOT_FOUND') 
                        ? 'border-blue-500/50 bg-blue-500/5' 
                        : 'border-slate-800/50 bg-slate-800/20'
                    } hover:bg-slate-800/40 transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-mono font-medium text-slate-200">{c.walletAddress}</p>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            c.badge === 'Guardian' ? 'bg-purple-500/10 text-purple-400' :
                            c.badge === 'Sentinel' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {c.badge}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase font-bold">Reports</p>
                          <p className="text-sm font-bold">{c.verifiedReports}</p>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="text-xs text-slate-500 uppercase font-bold text-emerald-400">SHW3</p>
                          <p className="text-sm font-bold text-emerald-400">{c.shw3Earned}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="space-y-8">
            <LiveThreatFeed />
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                Guidelines
              </h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex gap-2">
                  <Star className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Always paste the <strong>full suspicious URL</strong> including parameters.</span>
                </li>
                <li className="flex gap-2">
                  <Star className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Provide accurate <strong>Severity</strong> (Critical = high impact malware).</span>
                </li>
                <li className="flex gap-2">
                  <Star className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Reported sites are stored on-chain; only report <strong>real threats</strong>.</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-wider">
                  ⚠️ False reports may result in account suspension and reputation loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
