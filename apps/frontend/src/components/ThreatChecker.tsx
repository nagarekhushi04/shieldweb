import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreatStore } from '../store/threatStore';
import { ShieldAlert, ShieldCheck, Zap, Globe, Search, ArrowRight, Activity } from 'lucide-react';

export const ThreatChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const { check, isChecking, lastResult } = useThreatStore();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    try {
      await check(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4 group cursor-default">
          <Activity className="h-3 w-3 text-toxic-green animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-toxic-green transition-colors">Sentinel AI Engine: Active</span>
        </div>
      </div>
      
      <form onSubmit={handleCheck} className="relative group/form">
        <div className="absolute -inset-2 bg-gradient-to-r from-cyber-blue/20 via-neon-purple/20 to-vibrant-pink/20 rounded-[2rem] blur-xl opacity-0 group-focus-within/form:opacity-100 transition duration-1000" />
        <div className="relative flex flex-col sm:flex-row gap-4 p-2 glass-card !rounded-[2rem] border-white/10 shadow-2xl">
          <div className="flex-1 relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/form:text-cyber-blue transition-colors">
              <Globe className="h-5 w-5" />
            </div>
            <input
              type="url"
              required
              placeholder="Inject web link for neural verification..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent border-none text-white pl-16 pr-6 py-5 focus:outline-none focus:ring-0 text-lg font-medium placeholder:text-slate-600 tracking-tight"
            />
          </div>
          <button
            type="submit"
            disabled={isChecking}
            className="btn-sentinel-primary !py-4 !px-10 !rounded-2xl flex items-center justify-center gap-3 group/btn relative overflow-hidden"
          >
            {isChecking ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm font-black uppercase tracking-widest">Scanning...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                <span className="text-sm font-black uppercase tracking-[0.1em]">Analyze Intent</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="flex items-center justify-center gap-8 mt-6 text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-toxic-green shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          Neural Engine
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
          Ledger Sync
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          Quantum Ready
        </div>
      </div>

      <AnimatePresence mode="wait">
        {lastResult && (
          <motion.div
            key={url + lastResult.safe}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className={`mt-10 p-1 rounded-3xl overflow-hidden relative ${lastResult.safe ? 'bg-toxic-green/20' : 'bg-error/20'}`}
          >
            <div className="glass-card !bg-surface-high/80 backdrop-blur-3xl p-8 rounded-[1.4rem] border-white/5 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className={`p-6 rounded-3xl ${lastResult.safe ? 'bg-toxic-green/10 text-toxic-green shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'bg-error/10 text-error shadow-[0_0_30px_rgba(239,68,68,0.15)]'}`}>
                  {lastResult.safe ? (
                    <ShieldCheck className="h-16 w-16" />
                  ) : (
                    <ShieldAlert className="h-16 w-16" />
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className={`text-4xl font-editorial tracking-tight ${lastResult.safe ? 'text-toxic-green' : 'text-error'}`}>
                      {lastResult.safe ? 'MISSION SAFE.' : 'THREAT IMMINENT.'}
                    </h3>
                    <div className="inline-flex flex-col md:items-end">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Quotient</span>
                      <span className="text-xl font-editorial text-white">
                        {(lastResult.mlScore ?? 0).toFixed(4)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-lg font-medium leading-relaxed mb-8">
                    {lastResult.safe 
                      ? 'Neural analysis confirms no malicious patterns detected. This domain is currently verified on the Stellar global security ledger.' 
                      : 'Sentinel AI has flagged this URL as a high-risk phishing vector. On-chain records indicate potential wallet-draining behavior.'}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {lastResult.safe ? (
                      <button className="btn-sentinel-secondary text-xs !py-3 tracking-widest">View Ledger Record</button>
                    ) : (
                      <>
                        <button className="btn-sentinel-primary !bg-error hover:!shadow-error/30 text-xs !py-3 tracking-widest">Intercept Attack</button>
                        <button className="btn-sentinel-secondary text-xs !py-3 tracking-widest">Analyze DNA</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
