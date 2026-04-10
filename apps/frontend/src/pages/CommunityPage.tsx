import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Shield, 
  Award, 
  Terminal, 
  ArrowRight, 
  ThumbsUp, 
  Zap, 
  Globe, 
  Target,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { LiveThreatFeed } from '../components/LiveThreatFeed';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface Contributor {
  walletAddress: string;
  totalReports: number;
  verifiedReports: number;
  shw3Earned: string;
  badge: string;
}

const MissionItem: React.FC<{
  icon: React.ElementType;
  title: string;
  desc: string;
  reward: string;
}> = ({ icon: Icon, title, desc, reward }) => (
  <div className="card-hover p-8 group flex flex-col h-full active:scale-[0.995]">
    <div className="w-12 h-12 rounded-xl bg-sky/10 border border-sky/20 flex items-center justify-center mb-6 text-sky-bright transition-transform duration-500 group-hover:scale-110">
      <Icon size={22} />
    </div>
    <h3 className="text-heading-md !text-lg mb-3">{title}</h3>
    <p className="text-body text-sm mb-8 flex-grow">{desc}</p>
    <div className="pt-6 border-t border-border flex items-center justify-between">
       <div className="flex flex-col">
          <span className="text-[0.6rem] text-text-tertiary font-bold uppercase tracking-wider mb-1">Protocol Yield</span>
          <span className="text-mono text-sm text-safe font-bold">{reward}</span>
       </div>
       <div className="w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center group-hover:border-sky/30 transition-colors">
          <ArrowRight size={14} className="text-text-tertiary group-hover:text-sky-bright transition-transform group-hover:translate-x-0.5" />
       </div>
    </div>
  </div>
);

export const CommunityPage: React.FC = () => {
  const { walletAddress } = useAuthStore();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await api.get('/api/community/contributors');
        if (res.data) {
          setContributors(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch contributors');
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  return (
    <div className="min-h-screen bg-ground">
      <Navbar />
      
      <main className="container-page pt-32 pb-20">
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-lg bg-sky/10 border border-sky/20 flex items-center justify-center">
                <Users size={18} className="text-sky" />
             </div>
             <span className="text-caption text-xs tracking-widest">Network Defense Collective</span>
          </div>
          <h1 className="text-heading-lg mb-4">Join the global firewall.</h1>
          <p className="text-body text-lg max-w-2xl">
            ShieldWeb3 is powered by autonomous contributors. Report vulnerabilities, verify data, 
            and keep the Stellar ecosystem sanitary.
          </p>
        </div>

        {/* Missions Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <MissionItem 
            icon={Target}
            title="Scan & Report"
            desc="Identify phishing vectors and commit them to the ledger. Every verified report strengthens the shield."
            reward="10 SHW3 / hit"
          />
          <MissionItem 
            icon={ShieldCheck}
            title="Verify Data"
            desc="Audit and validate community reports through protocol consensus. Low risk, steady contribution."
            reward="1 SHW3 / audit"
          />
          <MissionItem 
            icon={Cpu}
            title="Node Staking"
            desc="Stake protocol tokens to activate high-trust verification permissions and increased yield."
            reward="25 SHW3 / block"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Leaderboard */}
          <div className="lg:col-span-8">
            <div className="card overflow-hidden">
               <div className="px-8 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-warn" />
                  <span className="text-caption text-xs">Top Network Defenders</span>
                </div>
                <span className="text-[0.65rem] font-bold text-text-tertiary uppercase tracking-wider">Updated every 5m</span>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="py-24 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-sky/30 border-t-sky rounded-full animate-spin mb-4" />
                    <span className="text-caption text-xs">Synchronizing reputation data...</span>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface-low/50">
                        <th className="px-8 py-4 text-caption text-[0.65rem] w-20 text-center">Rank</th>
                        <th className="px-8 py-4 text-caption text-[0.65rem]">Node Identity</th>
                        <th className="px-8 py-4 text-caption text-[0.65rem] text-right">Activity</th>
                        <th className="px-8 py-4 text-caption text-[0.65rem] text-right">Yield</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {contributors.map((c, i) => {
                         const isMe = walletAddress && c.walletAddress.toLowerCase() === walletAddress.toLowerCase();
                         return (
                          <tr key={c.walletAddress} className={`transition-colors ${isMe ? 'bg-sky-tint' : 'hover:bg-surface-low'}`}>
                            <td className="px-8 py-6 text-center">
                               <span className={`text-mono text-sm font-bold ${i < 3 ? 'text-warn' : 'text-text-tertiary'}`}>
                                  {String(i + 1).padStart(2, '0')}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-mono text-text-primary mb-1">
                                   {c.walletAddress.slice(0, 8)}...{c.walletAddress.slice(-8)}
                                </span>
                                <div className="flex items-center gap-2">
                                   <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded border ${
                                      c.badge === 'Guardian' ? 'border-danger/30 text-danger bg-danger/5' :
                                      c.badge === 'Sentinel' ? 'border-sky/30 text-sky bg-sky/5' : 
                                      'border-border text-text-tertiary bg-surface-raised'
                                   }`}>
                                      {c.badge}
                                   </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex flex-col items-end">
                                  <span className="text-mono text-sm text-text-primary font-bold">{c.verifiedReports}</span>
                                  <span className="text-[0.6rem] text-text-tertiary uppercase font-bold tracking-tighter">Verified</span>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex flex-col items-end">
                                  <span className="text-mono text-sm text-safe font-bold">+{c.shw3Earned}</span>
                                  <span className="text-[0.6rem] text-text-tertiary uppercase font-bold tracking-tighter">SHW3</span>
                               </div>
                            </td>
                          </tr>
                         );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Rules & Live Feed */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="card p-8">
               <div className="flex items-center gap-3 mb-6">
                  <Terminal size={16} className="text-sky-bright" />
                  <span className="text-caption text-xs">Node Protocols</span>
               </div>
               <div className="space-y-6">
                  {[
                    { icon: Shield, text: "Commit SHA-256 identifiers of threats immediately upon discovery." },
                    { icon: Globe, text: "Cross-validate destination origins with ML confidence thresholds." },
                    { icon: Zap, text: "Protocol rewards are subject to consensus-driven verification." }
                  ].map((rule, idx) => (
                    <div key={idx} className="flex gap-4">
                       <rule.icon size={14} className="text-text-tertiary shrink-0 mt-1" />
                       <p className="text-[0.8rem] text-text-secondary leading-relaxed font-medium">{rule.text}</p>
                    </div>
                  ))}
               </div>

               <div className="mt-10 pt-8 border-t border-border">
                  <div className="p-4 rounded-lg bg-danger/5 border border-danger/10">
                     <p className="text-[0.65rem] text-danger font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle size={12} />
                        Warning
                     </p>
                     <p className="text-[0.75rem] text-text-secondary leading-normal italic">
                        Node integrity is audited by Stellar smart contracts. Malicious actors will be slashed.
                     </p>
                  </div>
               </div>
            </div>

            <LiveThreatFeed />
          </aside>
        </div>
      </main>
    </div>
  );
};
