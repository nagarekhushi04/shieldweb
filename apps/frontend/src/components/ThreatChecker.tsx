import React, { useState } from 'react';
import { useThreatStore } from '../store/threatStore';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto mt-10">
      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row shadow-lg">
        <input
          type="url"
          required
          placeholder="Paste a URL to check for threats..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-slate border border-gray-700 text-white rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none px-4 py-3 focus:outline-none focus:border-primary-blue"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="bg-primary-blue text-white font-semibold px-6 py-3 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isChecking ? 'Checking...' : 'Check Now'}
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Powered by AI + Stellar blockchain • Real-time • Decentralized
      </p>

      {lastResult && (
        <div className={`mt-6 p-6 rounded-lg border-l-4 ${lastResult.safe ? 'border-safe-green bg-slate/50' : 'border-threat-red bg-slate/50'}`}>
          <div className="flex items-center gap-4">
            {lastResult.safe ? (
              <ShieldCheck className="h-10 w-10 text-safe-green" />
            ) : (
              <ShieldAlert className="h-10 w-10 text-threat-red" />
            )}
            <div>
              <h3 className="text-xl font-bold text-white">
                {lastResult.safe ? 'Safe' : 'Phishing Detected'}
              </h3>
              <p className="text-gray-300">
                {lastResult.safe ? 'No threats detected for this domain.' : 'This site is verified as malicious.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
