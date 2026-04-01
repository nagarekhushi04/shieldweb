import React from 'react';
import { Shield } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report', path: '/report' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Metrics', path: '/metrics' },
    { name: 'Community', path: '/community' },
    { name: 'Extension', path: '/extension' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="glass-card rounded-[2rem] px-8 border-white/10 shadow-2xl overflow-visible">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group transition-all no-underline">
              <div className="relative">
                <div className="absolute inset-0 bg-cyber-blue blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <Shield className="h-8 w-8 text-cyber-blue relative group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-editorial text-xl tracking-tight text-white decoration-0">SHIELDWEB3</span>
            </Link>
          </div>
          
          <div className="hidden lg:flex gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all no-underline ${
                  location.pathname === link.path 
                    ? 'bg-cyber-blue text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[9px] font-black text-toxic-green uppercase tracking-widest">Network Status</span>
              <span className="text-[10px] font-bold text-white uppercase">Protected</span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};
