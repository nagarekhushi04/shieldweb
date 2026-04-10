import React from 'react';
import { Navbar } from '../components/Navbar';
import { Shield, Download, Globe, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExtensionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ground">
      <Navbar />
      
      <main className="container-page pt-32 pb-20 max-w-4xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-sky-bright mb-4">
             <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center">
                <Shield size={16} />
             </div>
             <span className="text-caption text-xs tracking-widest">Client Protection</span>
          </div>
          <h1 className="text-heading-lg mb-4">Real-Time Web3 Protection.</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Block phishing domains, malicious scripts, and fake wallet interactions instantly with the 
            ShieldWeb3 browser extension.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
           <div className="card p-10 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border-mid flex items-center justify-center">
                    <Globe size={24} className="text-text-primary" />
                 </div>
                 <div>
                    <h3 className="text-heading-md !text-lg mb-0.5">ShieldWeb3 Pro</h3>
                    <p className="text-caption text-xs">v1.2.4 • Chromium Stable</p>
                 </div>
              </div>

              <div className="space-y-4 mb-10">
                 {[
                   "Zero-latency domain reputation check",
                   "Soroban smart contract audit logs",
                   "Phishing-resistant transaction signing",
                   "Real-time wallet health scoring"
                 ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <CheckCircle2 size={14} className="text-safe" />
                       <span className="text-sm text-text-secondary font-medium">{feat}</span>
                    </div>
                 ))}
              </div>

              <button 
                className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 group"
                onClick={() => alert("Extension packaging pending node verification.")}
              >
                <Download size={18} />
                Add to Browser
                <ChevronRight size={16} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>

           <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-surface-low border border-border">
                 <h4 className="text-[0.65rem] text-text-tertiary font-black uppercase tracking-widest mb-4">Quick Setup Guide</h4>
                 <div className="space-y-6">
                    {[
                      { step: "01", title: "Download Archive", desc: "Get the latest production ZIP from our secure CDN." },
                      { step: "02", title: "Developer Mode", desc: "Enable 'Developer mode' in your browser extensions panel." },
                      { step: "03", title: "Load Unpacked", desc: "Select the unzipped folder to activate the shield." }
                    ].map((s, i) => (
                       <div key={i} className="flex gap-4">
                          <span className="text-mono text-xs text-sky font-bold mt-0.5">{s.step}</span>
                          <div>
                             <p className="text-[0.8rem] text-text-primary font-bold mb-1">{s.title}</p>
                             <p className="text-[0.75rem] text-text-tertiary leading-normal">{s.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-6 rounded-2xl bg-sky-tint border border-sky/10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Zap size={16} className="text-sky" />
                    <span className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider">Verified by Community</span>
                 </div>
                 <span className="text-[0.65rem] text-text-tertiary font-mono">HASH: 7f32...a12c</span>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
