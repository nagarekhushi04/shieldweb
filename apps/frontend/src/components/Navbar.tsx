import React from 'react';
import { Shield } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report', path: '/report' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Metrics', path: '/metrics' },
    { name: 'Extension', path: '/extension' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-blue blur-xl opacity-20 scale-150" />
              <Shield className="h-9 w-9 text-primary-blue relative" />
            </div>
            <a href="/" className="font-bold text-2xl tracking-tight text-white hover:text-white decoration-0 no-underline">ShieldWeb3</a>
          </div>
          <div className="hidden md:flex gap-8 font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`${
                  location.pathname === link.path 
                    ? 'text-primary-blue' 
                    : 'text-gray-300 hover:text-primary-blue'
                } transition-colors no-underline`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};
