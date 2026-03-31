import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveThreat {
  domain: string;
  threatType: string;
  severity: number;
  timestamp: string;
}

export const LiveThreatFeed: React.FC = () => {
  const [threats, setThreats] = useState<LiveThreat[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    socketRef.current = io(apiUrl);
    
    socketRef.current.on('connect', () => {
      console.log('Connected to live threat feed');
      setConnected(true);
      socketRef.current?.emit('subscribe:threats', { type: 'all' });
    });

    socketRef.current.on('disconnect', () => setConnected(false));
    
    socketRef.current.on('threat:new', (threat: LiveThreat) => {
      setThreats(prev => [threat, ...prev].slice(0, 5));
    });
    
    socketRef.current.on('threat:critical', (threat: any) => {
      toast.error(`🚨 CRITICAL THREAT: ${threat.domain}`, {
        duration: 5000,
        position: 'bottom-right',
        style: { background: '#991B1B', color: '#fff', border: '1px solid #DC2626' }
      });
    });
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="glass-card p-8 rounded-3xl backdrop-blur-2xl shadow-2xl relative group transition-all duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-3.5 h-3.5 rounded-full ${connected ? 'bg-toxic-green shadow-[0_0_15px_#10B981]' : 'bg-rose-500 animate-pulse'} transition-all duration-500`} />
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyber-blue" />
            Sentinel Protocol: Live Feed
          </h2>
        </div>
        <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] bg-surface-highest/50 px-3 py-1 rounded-full">Stream</span>
      </div>
      
      <div className="space-y-4">
        {threats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Clock className="w-10 h-10 opacity-30 text-cyber-blue" />
            </motion.div>
            <p className="text-sm font-bold tracking-tight italic opacity-40">Synchronizing with Global Threat Registry...</p>
          </div>
        ) : (
          threats.map((t, i) => (
            <motion.div 
              key={`${t.domain}-${i}-${t.timestamp}`} 
              initial={{ opacity: 0, x: -20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-surface-container/40 hover:bg-surface-highest/50 transition-all duration-300 relative group/item overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyber-blue via-neon-purple to-vibrant-pink opacity-0 group-hover/item:opacity-100 transition-opacity" />
              
              <div className="flex flex-col gap-1.5 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-100 tracking-tight">{t.domain}</span>
                  {t.severity >= 3 && <div className="p-1 rounded-md bg-rose-500/10"><AlertTriangle className="w-3.5 h-3.5 text-rose-500" /></div>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider ${
                    t.threatType === 'phishing' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {t.threatType}
                  </span>
                  <span className="text-[10px] text-slate-600 font-bold">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 relative z-10">
                <div className="flex gap-1.5">
                  {[...Array(4)].map((_, j) => (
                    <div 
                      key={j} 
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                        j < t.severity 
                          ? (t.severity === 4 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-cyber-blue shadow-[0_0_8px_rgba(56,189,248,0.6)]') 
                          : 'bg-surface-highest border border-white/5'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-[9px] text-slate-700 font-black tracking-widest uppercase">Severity Level</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
