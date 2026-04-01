import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThreatStore } from '../store/threatStore';
import { ThreatChecker } from '../components/ThreatChecker';
import { Navbar } from '../components/Navbar';
import { LiveThreatFeed } from '../components/LiveThreatFeed';
import { Shield, Lock, Zap, ArrowRight, ShieldCheck, Database, Globe } from 'lucide-react';
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
    <div className="min-h-screen bg-surface relative">
      <Navbar />
      
      {/* Hero Section - Level 6 Split Layout */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue text-xs font-black uppercase tracking-widest mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-blue"></span>
                  </span>
                  Stellar Protocol Security Layer
                </div>
                <h1 className="text-editorial text-7xl md:text-8xl mb-8">
                  Shield Your <span className="text-gradient">Web3</span> Journey.
                </h1>
                <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed font-medium max-w-2xl">
                  Sentinel-grade protection against phishing and wallet drainers. Powered by real-time AI and the speed of the <span className="text-white font-bold underline decoration-cyber-blue decoration-4">Stellar Ledger.</span>
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                  <button className="btn-sentinel-primary flex items-center gap-3 group">
                    Get Free Extension <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="btn-sentinel-secondary">
                    View Global Threat Index
                  </button>
                </div>
                <div className="flex items-center gap-6 glass-card p-4 rounded-2xl border-white/5 inline-flex">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-surface bg-surface-highest flex items-center justify-center text-[10px] font-bold">U{i}</div>
                    ))}
                  </div>
                  <div className="text-sm font-bold">
                    <span className="text-white">{onboardedCount || '1,200'}+</span> <span className="text-slate-500">Secured Users</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="absolute -inset-20 bg-cyber-blue/20 blur-[120px] rounded-full animate-pulse opacity-50" />
                <img 
                  src="/assets/hero_shield.png" 
                  alt="ShieldWeb3 Sentinel" 
                  className="w-full max-w-xl mx-auto drop-shadow-[0_0_50px_rgba(14,165,233,0.3)] animate-float"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Threat Checker */}
      <section className="py-20 relative px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="colorful-glow group"
          >
            <ThreatChecker />
          </motion.div>
        </div>
      </section>

      {/* Trusted By / Evidence Section */}
      <section className="py-20 border-y border-white/5 bg-surface-low/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">DECENTRALIZED VERIFICATION PARTNERS</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['STELLAR', 'SOROBAN', 'WALLET-GUARD', 'TRUST-LAYER', 'ORACLE-V2'].map(partner => (
              <span key={partner} className="text-2xl font-black text-slate-400 font-display">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlighting - Level 6 Design */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-xl bg-cyber-blue/10 flex items-center justify-center text-cyber-blue mb-8 border border-cyber-blue/20">
                <Database className="h-6 w-6" />
              </div>
              <h2 className="text-editorial text-5xl mb-8">On-Chain Threat <span className="text-gradient">Immunity.</span></h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-10">
                Every phishing domain reported is cryptographically signed and committed to the Stellar blockchain. Our decentralized registry ensures that no single entity can censor or hide malicious threats.
              </p>
              <ul className="space-y-6">
                {[
                  { icon: ShieldCheck, text: "Instant registry synchronization across all nodes." },
                  { icon: Zap, text: "Sub-second verification via Soroban Smart Contracts." },
                  { icon: Globe, text: "Community-driven consensus on threat levels." }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-bold">
                    <div className="h-6 w-6 rounded-full bg-toxic-green/10 flex items-center justify-center text-toxic-green">
                      <item.icon className="h-3 w-3" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-2 rounded-[2.5rem] overflow-hidden">
                <img src="/assets/security_scan.png" alt="Security Dashboard" className="rounded-[2rem] w-full" />
              </div>
              <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl shadow-2xl border-cyber-blue/30 max-w-xs animate-bounce-slow">
                <div className="flex items-center gap-3 text-toxic-green font-black text-sm mb-2">
                  <ShieldCheck className="h-5 w-5" /> THREAT DETECTED
                </div>
                <p className="text-xs text-slate-400 font-medium">Domain <span className="text-white">scam-ledger.io</span> was intercepted by Sentinel AI.</p>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sentinel-section grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
          >
            {[
              { val: stats?.totalThreats ?? "12.4k", label: "Threats Indexed", color: "text-cyber-blue" },
              { val: stats?.totalReporters ?? "1.2k", label: "Global Reporters", color: "text-neon-purple" },
              { val: stats?.verifiedThreats ?? "98%", label: "Accuracy Rate", color: "text-toxic-green" },
              { val: "Stellar", label: "Registry Protocol", color: "text-white" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className={`text-4xl font-editorial mb-2 ${stat.color}`}>
                  {stat.val}
                </div>
                <div className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Feed Component - Premium Wrap */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-editorial text-4xl mb-4">Sentinel Live Intelligence</h2>
          <p className="text-slate-500 font-medium italic">Latest network activities across the global defense grid</p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-cyber-blue/10 to-transparent blur-2xl -z-10 rounded-3xl" />
          <LiveThreatFeed />
        </div>
      </section>

      {/* Final Feature Highlight */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img src="/assets/protection_mockup.png" alt="Mobile Protection" className="w-full drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-editorial text-5xl mb-8">Security Everywhere You <span className="text-gradient">Go.</span></h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed uppercase tracking-tighter font-black opacity-60">Mobile // Desktop // Browser</p>
              <p className="text-xl text-white font-medium mb-10">
                Install our extension and never worry about malicious signature requests again. ShieldWeb3 analyzes every transaction in real-time.
              </p>
              <button className="btn-sentinel-primary">Secure My Wallet Now</button>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-24 text-center border-t border-white/5 relative z-10 bg-surface-low">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-cyber-blue" />
              <span className="text-2xl font-editorial tracking-tight">SHIELDWEB3</span>
            </div>
            <p className="text-slate-500 max-w-sm font-medium">Protecting the future of decentralization, one block at a time.</p>
          </div>
          <div className="flex justify-center gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest mb-12">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Stellar Explorer</a>
            <a href="#" className="hover:text-white transition-colors">Github</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>
          <p className="text-slate-600 font-bold tracking-[0.4em] uppercase text-[9px]">© 2026 SHIELDWEB3 // ALL ON-CHAIN RIGHTS RESERVED</p>
        </div>
      </footer>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
