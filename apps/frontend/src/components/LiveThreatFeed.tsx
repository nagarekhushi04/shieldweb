import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-rose-500 animate-pulse'} `} />
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-blue" />
            Live Threat Stream
          </h2>
        </div>
        <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Real-time</span>
      </div>
      
      <div className="space-y-4">
        {threats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600">
            <Clock className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm italic">Monitoring network for new threats...</p>
          </div>
        ) : (
          threats.map((t, i) => (
            <div 
              key={`${t.domain}-${i}`} 
              className={`flex items-center justify-between p-4 rounded-xl border border-slate-800/50 bg-slate-800/20 transition-all duration-500 animate-in slide-in-from-top-4`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-200 font-medium">{t.domain}</span>
                  {t.severity >= 3 && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    t.threatType === 'phishing' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {t.threatType}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, j) => (
                    <div 
                      key={j} 
                      className={`w-1.5 h-1.5 rounded-full ${j < t.severity ? 'bg-primary-blue' : 'bg-slate-800'}`} 
                    />
                  ))}
                </div>
                <span className="text-[9px] text-slate-600 mt-1 uppercase">Sev Level</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
