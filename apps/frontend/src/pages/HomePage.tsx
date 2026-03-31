import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThreatStore } from '../store/threatStore';
import { ThreatChecker } from '../components/ThreatChecker';
import { WalletConnect } from '../components/WalletConnect';
import { Shield, Lock, Globe, Zap } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { LiveThreatFeed } from '../components/LiveThreatFeed';
import { FeedbackModal } from '../components/FeedbackModal';
import axios from 'axios';

export const HomePage: React.FC = () => {
  const { stats, fetchStats } = useThreatStore();
  const [onboardedCount, setOnboardedCount] = React.useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/count`);
        setOnboardedCount(res.data.onboarded);
      } catch (err) {
        console.error('Failed to fetch user counts');
      }
    };
    fetchCounts();
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-white relative overflow-hidden">
      {/* Decorative Background Blobs - MORE POP */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-cyber-blue opacity-[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[0%] right-[-5%] w-[60%] h-[60%] bg-vibrant-pink opacity-[0.08] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-neon-purple opacity-[0.06] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[60%] left-[10%] w-[30%] h-[30%] bg-toxic-green opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Shield Your <span className="text-gradient">Web3.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Decentralized antiphishing layer powered by <span className="text-cyber-blue font-bold">Stellar Trust</span> and <span className="text-neon-purple font-bold">Real-time AI</span>.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <div className="px-4 py-1.5 rounded-full bg-toxic-green/10 border border-toxic-green/30 text-toxic-green text-xs font-black uppercase tracking-[0.2em]">
                Live: {onboardedCount || '30'}+ Network Defenders
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 group transition-all relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-cyber-blue/20 via-neon-purple/20 to-vibrant-pink/20 blur-3xl opacity-50 group-hover:opacity-80 transition duration-1000 -z-10" />
            <ThreatChecker />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card py-16 rounded-[2.5rem] mb-32 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center px-8 relative z-10">
            {[
              { val: stats?.totalThreats ?? "0", label: "Threats Blacklisted", color: "text-cyber-blue" },
              { val: stats?.totalReporters ?? "0", label: "Active Defenders", color: "text-neon-purple" },
              { val: stats?.verifiedThreats ?? "0", label: "Verified Claims", color: "text-vibrant-pink" },
              { val: "Stellar", label: "Registry Protocol", color: "text-white" }
            ].map((stat, i) => (
              <div key={i} className="group cursor-default">
                <div className={`text-5xl font-black mb-3 ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                  {stat.val}
                </div>
                <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto mb-32 group">
          <LiveThreatFeed />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: Lock, title: "On-Chain Security", desc: "Every threat is cryptographically verified and stored on the Stellar ledger.", color: "text-cyber-blue" },
            { icon: Zap, title: "Real-Time AI", desc: "Advanced machine learning detects phishing in milliseconds before you sign.", color: "text-toxic-green" },
            { icon: Globe, title: "Community Powered", desc: "Decentralized reporting ensures no single point of failure or censorship.", color: "text-neon-purple" }
          ].map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="sentinel-card group cursor-default hover:-translate-y-2"
            >
              <div className={`h-14 w-14 rounded-2xl bg-surface-highest flex items-center justify-center mb-8 ${color} border border-white/5 shadow-xl group-hover:scale-110 transition-all duration-500`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-20 text-center relative z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-12" />
        <p className="text-slate-600 font-bold tracking-widest uppercase text-[10px]">© 2026 ShieldWeb3 // Built on Stellar // Powered by Intelligence</p>
      </footer>
      <FeedbackModal />
    </div>
  );
};
