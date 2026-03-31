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
        className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
      >
        Install Freighter
      </a>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-surface-container rounded-lg border border-outline flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <span className="text-white text-sm font-medium">
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </span>
        </div>
        <button 
          onClick={disconnect}
          className="text-gray-400 hover:text-white text-sm"
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
      className="btn-sentinel-primary"
    >
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};
