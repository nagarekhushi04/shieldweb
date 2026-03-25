import { create } from 'zustand';
import { User } from '../types';
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
        
        // Always try to login right after connecting
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
      
      const { challenge } = await getChallenge(walletAddress);
      
      let signature;
      try {
        signature = await signChallenge(challenge);
      } catch (err) {
        toast.error('Message signature rejected.');
        return;
      }

      const { token, user } = await verifyAuth(walletAddress, signature, challenge);
      
      localStorage.setItem('shieldweb3_token', token);
      localStorage.setItem('shieldweb3_user', JSON.stringify(user));
      set({ token, user, walletAddress, isConnected: true });
      
      toast.success('Successfully logged in.');
    } catch (error) {
      console.error(error);
      toast.error('Authentication failed');
      get().disconnect();
    } finally {
      set({ isLoading: false });
    }
  }
}));
