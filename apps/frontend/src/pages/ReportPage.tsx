import React, { useState } from 'react';
import { submitReport } from '../lib/api';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/Navbar';
import { 
  Shield, 
  AlertTriangle, 
  Bug, 
  Skull, 
  Globe, 
  MoreHorizontal, 
  FileText, 
  Send, 
  Zap, 
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

// Classification options with icons and colors
const CLASSIFICATIONS = [
  { id: 'phishing', label: 'Phishing', icon: Globe, color: '#ef233c', desc: 'Social engineering links' },
  { id: 'scam', label: 'Direct Scam', icon: AlertTriangle, color: '#f59e0b', desc: 'Fraudulent dApps' },
  { id: 'malware', label: 'Malware', icon: Bug, color: '#22c55e', desc: 'Harmful payloads' },
  { id: 'rug_pull', label: 'Rug Pull', icon: Skull, color: '#f43f5e', desc: 'Project drainers' },
  { id: 'fake_wallet', label: 'Fake Wallet', icon: Shield, color: '#ef233c', desc: 'Phony UI interfaces' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: '#64748b', desc: 'Unknown threats' },
];

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
      toast.error('Connection required to submit to the ledger.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await submitReport({ url, threatType, severity, description, evidence });
      toast.success(`Broadcasting to Stellar... TX: ${result.txHash?.slice(0, 8)}`);
      setUrl('');
      setEvidence('');
      setDescription('');
    } catch (err: unknown) {
      const error = err as { response?: { status: number } };
      if (error.response?.status === 401) {
        toast.error('Authentication expired. Please reconnect.');
      } else {
        toast.error('Node rejected broadcast. Verify URL format.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ground">
      <Navbar />
      
      <div className="container-page pt-32 pb-20 max-w-4xl">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sky-bright mb-4">
             <Send size={16} />
             <span className="text-caption text-xs tracking-widest">Broadcast Protocol</span>
          </div>
          <h1 className="text-heading-lg mb-2">Threat Intelligence Submission</h1>
          <p className="text-body text-sm mx-auto max-w-lg">
            Commit malicious indicators to the global defense registry. Your reports are verified on the Stellar ledger.
          </p>
        </div>
        
        <div className="card p-8 md:p-12 relative overflow-hidden">
          {!isConnected && (
            <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-ground/40 flex items-center justify-center p-6 rounded-xl">
              <div className="card bg-surface-mid p-8 text-center max-w-sm border-border-mid shadow-2xl">
                 <div className="w-12 h-12 bg-sky/10 border border-sky/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Lock size={20} className="text-sky" />
                 </div>
                 <h2 className="text-heading-md mb-2">Signature Required</h2>
                 <p className="text-body text-sm mb-6">Your authorized Stellar wallet must be active to commit security reports to the ledger.</p>
                 <button onClick={() => window.location.href = '/'} className="btn-primary w-full">Connect Wallet</button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* URL Section */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <label className="text-caption text-xs font-bold">Target URL / Identifier</label>
                <div className="flex items-center gap-2 text-[0.65rem] text-text-tertiary">
                   <Info size={10} />
                   <span>Always include https://</span>
                </div>
              </div>
              <input 
                required 
                type="url" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                className="input text-lg font-mono py-4"
                placeholder="https://scam-domain.xyz" 
              />
            </div>
            
            {/* Classification Grid */}
            <div className="space-y-4">
              <label className="text-caption text-xs font-bold">Threat Classification</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CLASSIFICATIONS.map(c => {
                  const active = threatType === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setThreatType(c.id)}
                      className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                        active 
                          ? 'border-sky-bright bg-sky-tint ring-2 ring-sky/15' 
                          : 'border-border bg-surface-mid hover:border-border-mid'
                      }`}
                    >
                      <c.icon size={20} color={active ? c.color : '#52525b'} className="mb-3" />
                      <span className={`text-[0.65rem] uppercase font-bold tracking-wider ${active ? 'text-text-primary' : 'text-text-secondary'}`}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity and Description Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
               {/* Severity Slider */}
               <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-caption text-xs font-bold">Severity Impact</label>
                    <span className={`badge py-0.5 px-3 ${
                       severity === 1 ? 'badge-neutral' :
                       severity === 2 ? 'badge-warn' :
                       severity >= 3 ? 'badge-danger' : ''
                    }`}>
                      {severity === 1 ? 'Low' : severity === 2 ? 'Elevated' : severity === 3 ? 'High' : 'Critical'}
                    </span>
                  </div>
                  <div className="relative pt-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="4" 
                      value={severity} 
                      onChange={e => setSeverity(parseInt(e.target.value))} 
                      className="w-full h-1.5 bg-surface-raised rounded-lg appearance-none cursor-pointer accent-sky" 
                    />
                    <div className="flex justify-between mt-3 text-[0.6rem] text-text-tertiary font-bold uppercase tracking-widest">
                       <span>Minimum</span>
                       <span>Maximum</span>
                    </div>
                  </div>
                  <p className="text-[0.7rem] text-text-tertiary leading-relaxed mt-4 italic font-medium">
                    {severity === 1 ? 'Informational report for low-risk phishing patterns.' : 
                     severity === 2 ? 'Active threat confirmed with likely malicious intent.' :
                     severity === 3 ? 'High-risk drainer or verified social engineering campaign.' :
                     'Critical emergency. Immediate on-chain propagation required.'}
                  </p>
               </div>

               {/* Evidence Section */}
               <div className="space-y-4">
                  <label className="text-caption text-xs font-bold">Evidence Payload (Optional)</label>
                  <textarea 
                    value={evidence} 
                    onChange={e => setEvidence(e.target.value)} 
                    className="input h-32 !resize-none !text-xs font-mono" 
                    placeholder="Raw JSON, headers, or victim transaction hashes..." 
                  />
               </div>
            </div>

            {/* Narrative Description */}
            <div className="space-y-4">
               <label className="text-caption text-xs font-bold">Intelligence Summary</label>
               <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="input h-32 !resize-none !text-sm" 
                  placeholder="Summarize the behavior for network validators..." 
               />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-border mt-12">
              <button 
                disabled={isLoading || !isConnected || !url} 
                type="submit" 
                className={`btn-primary btn-lg w-full py-5 text-md font-bold uppercase tracking-wider relative group ${
                   (!isConnected || !url) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Propagating to Stellar Nodes...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Submit Threat Report
                    <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 opacity-40">
                 <div className="flex items-center gap-1.5 grayscale">
                    <Shield size={12} className="text-sky" />
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest">Stellar SDK v22.1</span>
                 </div>
                 <div className="flex items-center gap-1.5 grayscale">
                    <Zap size={12} className="text-warn" />
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest">Soroban RPC v1.2</span>
                 </div>
                 <div className="flex items-center gap-1.5 grayscale">
                    <Lock size={12} className="text-safe" />
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest">Signed Payload</span>
                 </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
