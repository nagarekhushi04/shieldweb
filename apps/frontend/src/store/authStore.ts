import { create } from 'zustand';
import type { User } from '../types';
import { getChallenge, verifyAuth } from '../lib/api';
import { isFreighterInstalled, connectWallet, signChallenge } from '../lib/stellar';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  walletAddress: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  login: (walletAddress: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: localStorage.getItem('shieldweb3_user') ? JSON.parse(localStorage.getItem('shieldweb3_user') as string) : null,
  token: localStorage.getItem('shieldweb3_token') || null,
  walletAddress: localStorage.getItem('shieldweb3_wallet') || null,
  isConnected: !!localStorage.getItem('shieldweb3_wallet'),
  isLoading: false,

  connect: async () => {
    try {
      set({ isLoading: true });
      const isInstalled = await isFreighterInstalled();
      if (!isInstalled) {
        toast.error('Freighter wallet is not installed.');
        return;
      }
      
      const address = await connectWallet();
      if (address) {
        localStorage.setItem('shieldweb3_wallet', address);
        set({ walletAddress: address, isConnected: true });
        
        // Check if we're on production without a backend
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const isLocalhost = !apiUrl || apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (isProduction && isLocalhost) {
          toast.success(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
          // Skip backend auth — no API server available
          return;
        }
        
        await get().login(address);
      } else {
        toast.error('Failed to connect to wallet.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Wallet connection error');
    } finally {
      set({ isLoading: false });
    }
  },

  disconnect: () => {
    localStorage.clear();
    set({
      user: null,
      token: null,
      walletAddress: null,
      isConnected: false,
    });
    toast.success('Disconnected successfully');
  },

  login: async (walletAddress: string) => {
    try {
      set({ isLoading: true });
      
      const challengeRes = await getChallenge(walletAddress);
      if (!challengeRes) {
        toast.error('Failed to get auth challenge');
        return;
      }
      const { challenge } = challengeRes;
      
      let signature;
      try {
        signature = await signChallenge(challenge, walletAddress);
      } catch (signErr: any) {
        toast.error(signErr?.message || 'Message signature rejected.');
        return;
      }

      const authRes = await verifyAuth(walletAddress, signature, challenge);
      if (!authRes) {
        toast.error('Authentication verification failed');
        return;
      }
      const { token, user } = authRes;
      
      localStorage.setItem('shieldweb3_token', token);
      localStorage.setItem('shieldweb3_user', JSON.stringify(user));
      set({ token, user, walletAddress, isConnected: true });
      
      toast.success('Successfully logged in.');
    } catch (error: any) {
      console.error('Auth login error:', error);
      const msg = error?.response?.data?.error || error?.message || 'Authentication failed';
      toast.error(`Auth error: ${msg}`);
      // Don't disconnect on transient errors — keep wallet connected
    } finally {
      set({ isLoading: false });
    }
  }
}));
