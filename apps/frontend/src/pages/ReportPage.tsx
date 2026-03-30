import React, { useState } from 'react';
import { submitReport } from '../lib/api';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

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
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please reconnect your wallet.');
      } else {
        toast.error('Failed to submit report. Please check your inputs.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white p-8">
      <div className="max-w-2xl mx-auto bg-slate p-8 rounded-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6">Report a Threat</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">URL</label>
            <input required type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-navy border border-gray-700 rounded-lg p-3 text-white" placeholder="https://malicious-site.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Threat Type</label>
            <select value={threatType} onChange={e => setThreatType(e.target.value)} className="w-full bg-navy border border-gray-700 rounded-lg p-3 text-white">
              <option value="phishing">Phishing</option>
              <option value="scam">Scam</option>
              <option value="malware">Malware</option>
              <option value="rug_pull">Rug Pull</option>
              <option value="fake_wallet">Fake Wallet</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Severity (1-4)</label>
            <input type="range" min="1" max="4" value={severity} onChange={e => setSeverity(parseInt(e.target.value))} className="w-full" />
            <div className="text-right text-xs text-gray-400">Level: {severity}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-navy border border-gray-700 rounded-lg p-3 text-white h-24" placeholder="How does this scam operate?" />
          </div>
          <button disabled={isLoading} type="submit" className="w-full bg-primary-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold p-3 rounded-lg mt-4 transition-colors">
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
