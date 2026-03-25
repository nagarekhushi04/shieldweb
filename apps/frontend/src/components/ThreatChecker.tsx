import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreatStore } from '../store/threatStore';
import { ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <form onSubmit={handleCheck} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-blue to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />
        <div className="relative flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            required
            placeholder="Enter web link to verify..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 glass-card border-white/10 text-white rounded-xl px-6 py-4 focus:outline-none input-focus-ring text-lg"
          />
          <button
            type="submit"
            disabled={isChecking}
            className="btn-primary text-white font-bold px-8 py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap min-w-[150px]"
          >
            {isChecking ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="h-5 w-5 fill-current" />
                Scan Link
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="flex items-center justify-center gap-3 mt-4 text-gray-500 text-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-safe-green animate-pulse" />
        AI Engine: Online
        <span className="mx-1">•</span>
        Stellar Ledger: Verified
      </div>

      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`mt-8 p-8 rounded-2xl glass-card border-t-4 shadow-2xl ${lastResult.safe ? 'border-t-safe-green bg-safe-green/[0.02]' : 'border-t-threat-red bg-threat-red/[0.02]'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${lastResult.safe ? 'bg-safe-green/10' : 'bg-threat-red/10'}`}>
                {lastResult.safe ? (
                  <ShieldCheck className="h-12 w-12 text-safe-green" />
                ) : (
                  <ShieldAlert className="h-12 w-12 text-threat-red" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-2xl font-bold ${lastResult.safe ? 'text-safe-green' : 'text-threat-red'}`}>
                    {lastResult.safe ? 'Secure Domain' : 'Security Alert'}
                  </h3>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                    Score: {lastResult.mlScore.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-300 text-lg">
                  {lastResult.safe ? 'Our AI verifies this URL is safe to visit.' : 'This site is verified as malicious.'}
                </p>
                {!lastResult.safe && (
                  <div className="mt-4 flex gap-4">
                    <button className="text-sm font-bold text-threat-red bg-threat-red/20 px-4 py-2 rounded-lg hover:bg-threat-red/30 transition-colors">
                      Report to Stellar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
