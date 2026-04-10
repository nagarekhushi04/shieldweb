import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThreatStore } from '../store/threatStore';
import { ThreatChecker } from '../components/ThreatChecker';
import { Navbar } from '../components/Navbar';
import { LiveThreatFeed } from '../components/LiveThreatFeed';
import { ShieldLogo } from '../components/Logo';
import { ArrowRight, ArrowUpRight, CheckCircle2, Layers, Lock, Zap } from 'lucide-react';
import { api } from '../lib/api';

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    style={{
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#ef233c',
      marginBottom: 16,
    }}
  >
    {children}
  </p>
);

const FeatureRow: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '20px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'rgba(239,35,60,0.1)',
        border: '1px solid rgba(239,35,60,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      <Icon size={16} color="#ef233c" />
    </div>
    <div>
      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f5f5f5', marginBottom: 4, letterSpacing: '-0.015em' }}>
        {title}
      </p>
      <p style={{ fontSize: '0.875rem', color: '#71717a', lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
    </div>
  </div>
);

export const HomePage: React.FC = () => {
  const { stats, fetchStats } = useThreatStore();
  const [onboardedCount, setOnboardedCount] = React.useState<number>(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get('/api/auth/count');
        if (res.data) setOnboardedCount(res.data.onboarded);
      } catch {
        // no backend
      }
    };
    fetchCounts();
    fetchStats();
  }, [fetchStats]);

  return (
    <div style={{ minHeight: '100vh', background: '#000', position: 'relative', overflowX: 'hidden' }}>
      {/* Global Background — starfield + red glow */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #1a0505, #000)' }} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 800,
            background: 'rgba(239,35,60,0.04)',
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          }}
        />
      </div>

      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 160,
          paddingBottom: 80,
          maxWidth: 880,
          margin: '0 auto',
          padding: '160px 24px 80px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 9999,
              border: '1px solid rgba(239,35,60,0.2)',
              background: 'rgba(239,35,60,0.06)',
              marginBottom: 32,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%', background: '#ef233c',
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.6,
              }} />
              <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#ef233c' }} />
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,200,200,0.9)' }}>
              Stellar Protocol · Anti-Phishing Layer
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.75rem, 7vw, 5rem)',
              fontWeight: 600,
              letterSpacing: '-0.05em',
              lineHeight: 1.05,
              color: '#f5f5f5',
              marginBottom: 24,
              maxWidth: 760,
              fontFamily: '"Manrope", "Inter", sans-serif',
            }}
          >
            <span style={{
              background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.4))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Real-time threat detection
            </span>
            <br />
            <span style={{ color: '#ef233c', WebkitTextFillColor: '#ef233c' }}>
              for your Web3 wallet.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: '1.125rem', color: '#71717a', lineHeight: 1.7, maxWidth: 560, marginBottom: 40 }}>
            ShieldWeb3 intercepts phishing attempts and wallet drainers before they reach you.
            Every threat is logged on the Stellar blockchain — immutable, auditable, open.
          </p>




        </motion.div>
      </section>

      {/* ── Threat Checker ───────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
          padding: '72px 24px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Eyebrow>Scan any URL</Eyebrow>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, letterSpacing: '-0.03em', color: '#f5f5f5', marginBottom: 8, fontFamily: '"Manrope", sans-serif' }}>
            Is this link safe?
          </h2>
          <p style={{ color: '#52525b', marginBottom: 32, fontSize: '0.9375rem' }}>
            Paste any URL — our ML model + on-chain registry gives you an instant verdict.
          </p>
          <ThreatChecker />
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────── */}
      <section style={{ padding: '48px 24px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            overflow: 'hidden',
          }}
        >
          {[
            { value: stats?.totalThreats != null ? String(stats.totalThreats) : '0', label: 'Threats Indexed' },
            { value: stats?.totalReporters != null ? String(stats.totalReporters) : '0', label: 'Active Reporters' },
            { value: stats?.verifiedThreats != null ? `${stats.verifiedThreats}%` : '0%', label: 'Accuracy Rate' },
            { value: '<200ms', label: 'Avg. Check Time' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                flex: '1 1 160px',
                padding: '28px 32px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : undefined,
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#f5f5f5', lineHeight: 1, marginBottom: 6, fontFamily: '"JetBrains Mono", monospace' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#52525b' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features — two column ────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 48, alignItems: 'start' }}>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#f5f5f5', marginBottom: 16, fontFamily: '"Manrope", sans-serif' }}>
              On-chain immunity,<br />zero trust required.
            </h2>
            <p style={{ color: '#71717a', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: 32 }}>
              Every phishing domain is cryptographically signed and committed to Stellar. The registry is community-owned — no single entity controls it.
            </p>
            <FeatureRow icon={Lock} title="Decentralized threat registry" description="Threat reports are committed as Soroban contract calls — immutable, auditable, globally replicated." />
            <FeatureRow icon={Zap} title="Sub-200ms verdicts" description="Our ML model runs client-side for speed, cross-referenced against the on-chain ledger in parallel." />
            <FeatureRow icon={Layers} title="Community consensus" description="Reporters stake trust tokens to vouch for threats. False reports are penalized; accurate ones earn rewards." />
          </div>

          <div>
            <Eyebrow>Live intelligence</Eyebrow>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.025em', color: '#f5f5f5', marginBottom: 8, fontFamily: '"Manrope", sans-serif' }}>
              Global threat stream
            </h2>
            <p style={{ color: '#52525b', fontSize: '0.875rem', marginBottom: 24 }}>
              Real-time events from the ShieldWeb3 global defense network.
            </p>
            <LiveThreatFeed />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '40px 24px',
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <ShieldLogo size={28} />
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {['Documentation', 'Stellar Explorer', 'GitHub', 'Status'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: '0.8125rem',
                color: '#52525b',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#a1a1aa')}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = '#52525b')}
            >
              {l}
            </a>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#3f3f46', margin: 0 }}>
          © 2026 ShieldWeb3
        </p>
      </footer>

      {/* Ping animation for badge */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
