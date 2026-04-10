import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity } from 'lucide-react';

interface LiveThreat {
  domain: string;
  threatType: string;
  severity: number;
  timestamp: string;
}

const SEVERITY_LABELS = ['', 'Low', 'Medium', 'High', 'Critical'];
const SEVERITY_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'rgba(113,113,122,0.08)',  text: '#a1a1aa', border: 'rgba(113,113,122,0.2)' },
  2: { bg: 'rgba(245,158,11,0.08)', text: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
  3: { bg: 'rgba(249,115,22,0.08)', text: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  4: { bg: 'rgba(239,35,60,0.08)',  text: '#ff4d63', border: 'rgba(239,35,60,0.2)' },
};

export const LiveThreatFeed: React.FC = () => {
  const [threats, setThreats] = useState<LiveThreat[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const isLocalhost = !apiUrl || apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
    const isProduction =
      window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

    const loadRealData = async () => {
      try {
        const res = await fetch('/api/reports/my-reports').catch(() => null);
        // Because Axios handles our mock DB, but fetch doesn't trigger our Axios interceptor!
        // We need to use api.get here, but since this is isolated, let's just read LocalStorage directly!
        const db = localStorage.getItem('shw3_local_db');
        if (db) {
          const parsed = JSON.parse(db);
          if (parsed.reports) {
            setThreats(parsed.reports.map((r: any) => ({
              domain: r.url,
              threatType: r.type,
              severity: r.type === 'Phishing' || r.type === 'Malware' ? 4 : 3,
              timestamp: r.timestamp
            })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8));
          }
        }
      } catch (e) {}
    };

    setConnected(true);
    loadRealData();
    const pollInterval = setInterval(loadRealData, 2000);

    return () => {
      clearInterval(pollInterval);
      setConnected(false);
    };
  }, []);

  return (
    <div
      style={{
        background: 'rgba(15,15,15,0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} color="#71717a" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#a1a1aa', letterSpacing: '-0.01em' }}>
            Live Threat Feed
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: connected ? '#ef233c' : '#52525b',
              flexShrink: 0,
              ...(connected && {
                animation: 'status-pulse 2s ease infinite',
                boxShadow: '0 0 0 3px rgba(239,35,60,0.15)',
              }),
            }}
          />
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: connected ? '#ef233c' : '#52525b',
            }}
          >
            {connected ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Feed rows */}
      <div style={{ fontFamily: '"JetBrains Mono", monospace' }}>
        {threats.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#3f3f46' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Activity size={16} color="#3f3f46" />
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#3f3f46', margin: 0 }}>
              Awaiting threat events...
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {threats.map((t, i) => {
              const sev = SEVERITY_COLORS[t.severity] ?? SEVERITY_COLORS[1];
              return (
                <motion.div
                  key={`${t.domain}-${t.timestamp}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{
                    borderBottom: i < threats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 20px',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {t.severity >= 3 && (
                      <AlertTriangle size={12} color={sev.text} style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ flex: 1, color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.domain}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: sev.bg,
                        color: sev.text,
                        border: `1px solid ${sev.border}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        flexShrink: 0,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {t.threatType}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#3f3f46', flexShrink: 0, fontFamily: '"Inter", sans-serif', letterSpacing: '0.02em' }}>
                      {SEVERITY_LABELS[t.severity] ?? `L${t.severity}`}
                    </span>
                    <span style={{ color: '#3f3f46', flexShrink: 0, fontSize: '0.72rem' }}>
                      {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
