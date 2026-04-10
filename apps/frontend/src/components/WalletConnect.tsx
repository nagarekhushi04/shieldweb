import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { isFreighterInstalled } from '../lib/stellar';

export const WalletConnect: React.FC = () => {
  const { isConnected, walletAddress, connect, disconnect, isLoading } = useAuthStore();
  const [installed, setInstalled] = useState(true);

  useEffect(() => {
    isFreighterInstalled().then(setInstalled).catch(() => setInstalled(false));
  }, []);

  if (!installed) {
    return (
      <a
        href="https://freighter.app"
        target="_blank"
        rel="noreferrer"
        className="btn-secondary"
        style={{
          padding: '7px 14px',
          fontSize: '0.8125rem',
          borderRadius: 9999,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Install Freighter
      </a>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            fontSize: '0.8125rem',
            color: '#a1a1aa',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.01em',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ef233c',
              flexShrink: 0,
              boxShadow: '0 0 6px rgba(239,35,60,0.4)',
            }}
          />
          {walletAddress.slice(0, 4)}…{walletAddress.slice(-4)}
        </div>
        <button
          onClick={disconnect}
          className="btn-ghost"
          style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: 9999 }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect()}
      disabled={isLoading}
      className="btn-primary"
      style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: 9999 }}
    >
      {isLoading ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
};
