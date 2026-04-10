import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { ShieldLogo } from './Logo';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Report', path: '/report' },
  { name: 'Community', path: '/community' },
  { name: 'Metrics', path: '/metrics' },
  { name: 'Leaderboard', path: '/leaderboard' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4">
      <nav
        style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 9999,
          padding: '10px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <ShieldLogo size={30} />
        </Link>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                  color: active ? '#fff' : '#71717a',
                  background: active ? 'rgba(239,35,60,0.15)' : 'transparent',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.target as HTMLAnchorElement).style.color = '#d4d4d8';
                    (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.target as HTMLAnchorElement).style.color = '#71717a';
                    (e.target as HTMLAnchorElement).style.background = 'transparent';
                  }
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Live status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 9999,
              border: '1px solid rgba(239,35,60,0.2)',
              background: 'rgba(239,35,60,0.06)',
            }}
            className="hidden sm:flex"
          >
            <span className="status-live" style={{ width: 6, height: 6 }} />
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#ef233c',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Protected
            </span>
          </div>
          <WalletConnect />
        </div>
      </nav>
    </header>
  );
};
