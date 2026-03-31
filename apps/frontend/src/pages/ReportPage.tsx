import React, { useState } from 'react';
import { submitReport } from '../lib/api';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/Navbar';

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
      toast.error('Connect wallet to report.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await submitReport({ url, threatType, severity, description, evidence });
      toast.success(`Report submitted! Tx: ${result.txHash || 'Pending'}`);
      setUrl('');
      setEvidence('');
      setDescription('');
    } catch (err: unknown) {
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        toast.error('Session expired. Please reconnect your wallet.');
      } else {
        toast.error('Failed to submit report. Please check your inputs.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="p-8 pt-24">
      <div className="max-w-2xl mx-auto sentinel-section border border-outline bg-surface-low/50 backdrop-blur-md">
        <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Secure Threat Reporting</h1>
        
        {!isConnected && (
          <div className="mb-8 p-6 bg-cyber-blue/10 border border-cyber-blue/20 rounded-2xl flex flex-col gap-4 text-center">
             <p className="text-cyber-blue font-bold text-sm">You must connect your Stellar wallet to submit security reports and earn SHW3 rewards.</p>
             <button onClick={() => window.location.href = '/'} className="btn-sentinel-primary mx-auto">Go to Dashboard to Connect</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Target Vulnerable URL</label>
            <input required type="url" value={url} onChange={e => setUrl(e.target.value)} className="input-sentinel w-full text-lg" placeholder="https://stellar-scam-site.com" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Classification</label>
              <select value={threatType} onChange={e => setThreatType(e.target.value)} className="input-sentinel w-full">
                <option value="phishing">Phishing Attack</option>
                <option value="scam">Direct Scam</option>
                <option value="malware">Malicious Payload</option>
                <option value="rug_pull">Potential Rug Pull</option>
                <option value="fake_wallet">Fake Wallet UI</option>
                <option value="other">Other Suspicious Activity</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Severity Level: {severity}</label>
              <input type="range" min="1" max="4" value={severity} onChange={e => setSeverity(parseInt(e.target.value))} className="w-full accent-cyber-blue" />
              <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase">
                <span>Low</span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Incident Details</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-sentinel w-full h-32" placeholder="Describe the threat vectors and behavior..." />
          </div>

          <button 
            disabled={isLoading || !isConnected} 
            type="submit" 
            className={`w-full font-black p-5 rounded-2xl mt-4 transition-all text-lg shadow-xl ${
              !isConnected ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-outline' : 'btn-sentinel-primary hover:scale-[1.02]'
            }`}
          >
            {isLoading ? 'Encrypting & Submitting...' : !isConnected ? 'LOCKED: Connect Wallet First' : 'Broadcast to Network'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};
