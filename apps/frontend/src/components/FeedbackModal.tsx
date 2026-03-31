import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Send, X, ExternalLink, ThumbsUp, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const FeedbackModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { walletAddress } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        source: 'Twitter',
        checkerWorked: 'Yes',
        rating: 5,
        improvement: '',
        wouldRecommend: 'Yes'
    });

    useEffect(() => {
        const feedbackSubmitted = localStorage.getItem('feedbackSubmitted');
        if (feedbackSubmitted === 'true') return;

        // Show after 2 minutes of activity OR 3 reports (mocked by activity)
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 120000); // 120 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Submit to API
            await axios.post(`${import.meta.env.VITE_API_URL}/api/community/feedback/submit`, {
                ...formData,
                walletAddress
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // 2. Open Pre-filled Google Form
            // Example FORM_ID and FIELD_IDs from user request
            const FORM_ID = 'e/1FAIpQLScMRGa5zF0M8r37xYBUwlz1hlrqESELH2mOdjV5Vd4XXQi8SQ';
            const googleFormUrl = `https://docs.google.com/forms/d/${FORM_ID}/viewform?usp=pp_url&entry.123456789=${encodeURIComponent(formData.name)}&entry.987654321=${encodeURIComponent(formData.email)}&entry.543216789=${encodeURIComponent(walletAddress || '')}&entry.111222333=${encodeURIComponent(formData.improvement)}`;
            window.open(googleFormUrl, '_blank');

            localStorage.setItem('feedbackSubmitted', 'true');
            setSubmitted(true);
            setTimeout(() => setIsOpen(false), 3000);
        } catch (err) {
            console.error('Feedback submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                {submitted ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                        <p className="text-slate-400 mb-6">
                            Your feedback helps improve ShieldWeb3. We've opened the formal validation form in a new tab.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/20">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                                <h2 className="font-bold">Share Your Feedback</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Name</label>
                                    <input 
                                        type="text" required 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Full Name"
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                    <input 
                                        type="email" required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="email@example.com"
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">How did you hear about us?</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500"
                                        value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}
                                    >
                                        <option>Twitter</option>
                                        <option>Discord</option>
                                        <option>Telegram</option>
                                        <option>Partner Community</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Product Recommendation?</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500"
                                        value={formData.wouldRecommend} onChange={e => setFormData({...formData, wouldRecommend: e.target.value})}
                                    >
                                        <option>Yes, definitely</option>
                                        <option>Maybe / Uncertain</option>
                                        <option>No, I wouldn't</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Overall Rating</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button 
                                            key={s} type="button"
                                            onClick={() => setFormData({...formData, rating: s})}
                                            className={`flex-1 py-3 rounded-xl border transition-all ${
                                                formData.rating >= s ? 'bg-blue-600/10 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'bg-slate-950 border-slate-800'
                                            }`}
                                        >
                                            <Star className={`w-5 h-5 mx-auto ${formData.rating >= s ? 'text-blue-400 fill-blue-400' : 'text-slate-600'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">What would you improve?</label>
                                <textarea 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 h-24 resize-none"
                                    placeholder="Tell us what's missing..."
                                    maxLength={280}
                                    value={formData.improvement} onChange={e => setFormData({...formData, improvement: e.target.value})}
                                />
                                <span className="text-[10px] text-slate-600 font-bold uppercase float-right mt-1">{formData.improvement.length}/280 Characters</span>
                            </div>

                            <button 
                                type="submit" disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Submit & Open Survey
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const CheckCircle = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Loader2 = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);
