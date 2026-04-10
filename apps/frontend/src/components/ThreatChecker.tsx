import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreatStore } from '../store/threatStore';
import { ShieldCheck, ShieldAlert, Globe, ArrowRight, Loader2 } from 'lucide-react';

export const ThreatChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const { check, isChecking, lastResult } = useThreatStore();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    try {
      await check(url);
    } catch {
      // handled by store
    }
  };

  return (
    <div>
      {/* Search form */}
      <form onSubmit={handleCheck}>
        <div
          style={{
            display: 'flex',
            gap: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 9999,
            padding: 6,
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocusCapture={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'rgba(239,35,60,0.5)';
            el.style.boxShadow = '0 0 0 3px rgba(239,35,60,0.08)';
          }}
          onBlurCapture={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'rgba(255,255,255,0.1)';
            el.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, color: '#52525b', flexShrink: 0 }}>
            <Globe size={16} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a URL to scan — e.g. scam-ledger.io"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f5f5f5',
              fontSize: '0.9375rem',
              padding: '10px 8px',
              fontFamily: '"Inter", sans-serif',
            }}
          />
          <button
            type="submit"
            disabled={isChecking || !url.trim()}
            className="btn-primary"
            style={{
              flexShrink: 0,
              borderRadius: 9999,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.875rem',
            }}
          >
            {isChecking ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
                Scanning
              </>
            ) : (
              <>
                Scan URL
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </form>

      {/* Helper hints */}
      <div style={{ display: 'flex', gap: 20, marginTop: 12, paddingLeft: 16 }}>
        {[
          { dot: '#ef233c', label: 'ML model active' },
          { dot: '#22c55e', label: 'Ledger synced' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: '#52525b', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {lastResult && (
          <motion.div
            key={url + String(lastResult.safe)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 16,
              borderRadius: 12,
              border: `1px solid ${lastResult.safe ? 'rgba(34,197,94,0.2)' : 'rgba(239,35,60,0.2)'}`,
              background: lastResult.safe ? 'rgba(34,197,94,0.04)' : 'rgba(239,35,60,0.04)',
              padding: 20,
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: lastResult.safe ? 'rgba(34,197,94,0.1)' : 'rgba(239,35,60,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {lastResult.safe ? (
                <ShieldCheck size={20} color="#4ade80" />
              ) : (
                <ShieldAlert size={20} color="#ff4d63" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: lastResult.safe ? '#4ade80' : '#ff4d63', margin: 0, letterSpacing: '-0.015em' }}>
                  {lastResult.safe ? 'Safe — no threats detected' : 'Threat detected — proceed with caution'}
                </p>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#52525b',
                    fontFamily: '"JetBrains Mono", monospace',
                    background: 'rgba(15,15,15,0.8)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 6,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Risk score: {(lastResult.mlScore ?? 0).toFixed(4)}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#71717a', margin: 0, lineHeight: 1.6 }}>
                {lastResult.safe
                  ? 'Domain verified against the Stellar on-chain registry. No known phishing patterns detected.'
                  : 'This URL matches known phishing patterns and is flagged in the on-chain threat registry. Do not sign any transactions from this site.'}
              </p>
              {!lastResult.safe && (
                <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                  <button className="btn-danger" style={{ padding: '7px 14px', fontSize: '0.8rem', borderRadius: 9999 }}>
                    Report as Threat
                  </button>
                  <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.8rem', borderRadius: 9999 }}>
                    View on Explorer
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
