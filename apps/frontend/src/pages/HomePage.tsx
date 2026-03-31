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
  const [onboardedCount, setOnboardedCount] = React.useState(28);

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
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
              Protect Your <span className="text-gradient">Web3 Journey</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Decentralized phishing detection powered by the Stellar blockchain and real-time AI classification.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <span>Join {onboardedCount}+ security researchers</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12"
          >
            <ThreatChecker />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card py-12 rounded-3xl mb-24 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-blue opacity-[0.03] blur-3xl rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center px-8">
            <div className="relative">
              <div className="text-4xl font-bold text-primary-light mb-2">{stats?.totalThreats ?? 0}</div>
              <div className="text-gray-400 font-medium">Threats Blacklisted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-light mb-2">{stats?.totalReporters ?? 0}</div>
              <div className="text-gray-400 font-medium">Active Defenders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-light mb-2">{stats?.verifiedThreats ?? 0}</div>
              <div className="text-gray-400 font-medium">Verified Threats</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-light mb-2">Stellar</div>
              <div className="text-gray-400 font-medium">Network Secured</div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-xl mx-auto mb-24 cursor-default">
          <LiveThreatFeed />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[{ icon: Lock, title: "On-Chain Security", desc: "Every threat is cryptographically verified and stored on the Stellar ledger." },
            { icon: Zap, title: "Real-Time AI", desc: "Advanced machine learning detects phishing in milliseconds before you sign." },
            { icon: Globe, title: "Community Powered", desc: "Decentralized reporting ensures no single point of failure or censorship." }
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl hover:border-primary-blue/30 transition-all cursor-default"
            >
              <Icon className="h-10 w-10 text-primary-blue mb-6" />
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 mt-24 text-center text-gray-500 text-sm">
        <p>© 2026 ShieldWeb3. Built for the Stellar Ecosystem.</p>
      </footer>
      <FeedbackModal />
    </div>
  );
};
