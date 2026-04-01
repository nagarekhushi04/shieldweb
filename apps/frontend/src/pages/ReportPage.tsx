import React, { useState } from 'react';
import { submitReport } from '../lib/api';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/Navbar';
import { Shield, AlertTriangle, Bug, Skull, Globe, MoreHorizontal, FileText, Send, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReportPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [evidence, setEvidence] = useState('');
  const [description, setDescription] = useState('');
  const [threatType, setThreatType] = useState('phishing');
  const [severity, setSeverity] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Connection required for secure broadcast.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await submitReport({ url, threatType, severity, description, evidence });
      toast.success(`Broadcast successful! TX: ${result.txHash?.slice(0, 8)}...`);
      setUrl('');
      setEvidence('');
      setDescription('');
    } catch (err: unknown) {
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        toast.error('Authentication expired. Reconnect wallet.');
      } else {
        toast.error('Broadcast failed. Node rejected mission.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const classifications = [
    { id: 'phishing', label: 'Phishing Attack', icon: Globe, color: 'text-cyber-blue' },
    { id: 'scam', label: 'Direct Scam', icon: AlertTriangle, color: 'text-neon-cyan' },
    { id: 'malware', label: 'Malicious Payload', icon: Bug, color: 'text-toxic-green' },
    { id: 'rug_pull', label: 'Rug Pull Trace', icon: Skull, color: 'text-vibrant-pink' },
    { id: 'fake_wallet', label: 'Fake Wallet UI', icon: Shield, color: 'text-neon-purple' },
    { id: 'other', label: 'Other Threat', icon: MoreHorizontal, color: 'text-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="pt-48 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-editorial tracking-tight uppercase mb-4">Threat <span className="text-gradient">Broadcast.</span></h1>
            <p className="text-slate-500 font-medium italic">Commit malicious activities to the global defense ledger</p>
          </div>
          
          <div className="glass-card !rounded-[3rem] p-12 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Send className="h-64 w-64 text-cyber-blue" />
            </div>
            
            {!isConnected && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 p-8 bg-surface-highest/50 border border-white/5 rounded-3xl text-center space-y-6"
              >
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-8 w-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-xl font-editorial mb-2">Registry Connection Required</h3>
                  <p className="text-slate-500 text-sm font-medium">Your authorized Stellar wallet must be active to sign and broadcast security reports.</p>
                </div>
                <button onClick={() => window.location.href = '/'} className="btn-sentinel-primary text-xs py-3 px-8 !rounded-full">Connect Now</button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 block">Target Vulnerable URL</label>
                <div className="relative">
                  <input 
                    required 
                    type="url" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    className="input-sentinel w-full !text-xl !pl-7" 
                    placeholder="https://..." 
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-cyber-blue rounded-r-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 block">Classification</label>
                  <div className="relative">
                    <select 
                      value={threatType} 
                      onChange={e => setThreatType(e.target.value)} 
                      className="input-sentinel w-full !appearance-none cursor-pointer"
                    >
                      {classifications.map(c => (
                        <option key={c.id} value={c.id} className="bg-surface-highest">{c.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {React.createElement(classifications.find(c => c.id === threatType)?.icon || Globe, { className: `h-5 w-5 ${classifications.find(c => c.id === threatType)?.color}` })}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Severity Metric</label>
                    <span className={`text-xs font-black uppercase tracking-widest ${severity > 2 ? 'text-error' : 'text-toxic-green'}`}>
                      {severity === 1 ? 'LOW' : severity === 2 ? 'ELEVATED' : severity === 3 ? 'HIGH' : 'CRITICAL'}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    value={severity} 
                    onChange={e => setSeverity(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-surface-highest rounded-lg appearance-none cursor-pointer accent-cyber-blue" 
                  />
                  <div className="flex justify-between mt-3 text-[9px] font-black text-slate-600 tracking-widest uppercase">
                    <span>Alpha</span>
                    <span>Omega</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                   <FileText className="h-4 w-4 text-slate-500" />
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Intelligence Details</label>
                </div>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="input-sentinel w-full h-40 !resize-none" 
                  placeholder="Describe the malicious behavior, social engineering tactics, or smart contract vulnerabilities observed..." 
                />
              </div>

              <div className="pt-4">
                <button 
                  disabled={isLoading || !isConnected} 
                  type="submit" 
                  className={`w-full font-editorial text-2xl uppercase tracking-tighter p-6 rounded-3xl transition-all shadow-2xl relative overflow-hidden group/btn ${
                    !isConnected ? 'bg-white/5 text-slate-600 cursor-not-allowed grayscale' : 'btn-sentinel-primary'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                        BROADCASTING NODE...
                      </>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 fill-white" />
                        BROADCAST TO LEDGER
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                </button>
                <div className="mt-6 flex items-center justify-center gap-4 text-slate-600 font-bold text-[9px] uppercase tracking-[0.3em]">
                   <Shield className="h-3 w-3" /> VERIFIED BY STELLAR CONSENSUS PROTOCOL
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
