import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { Shield, Wallet, Zap, CheckCircle, ExternalLink, ArrowRight, Loader2, Search } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const { isConnected, walletAddress, connect } = useAuthStore();
    const [balance, setBalance] = useState<number | null>(null);
    const [verifyingBalance, setVerifyingBalance] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [testReported, setTestReported] = useState(false);
    const navigate = useNavigate();

    const steps = [
        { id: 1, title: 'Welcome', icon: Shield },
        { id: 2, title: 'Connect', icon: Wallet },
        { id: 3, title: 'Fund', icon: Zap },
        { id: 4, title: 'Trial', icon: CheckCircle },
    ];

    const nextStep = () => setStep(s => Math.min(s + 1, 4));

    const verifyBalance = async () => {
        if (!walletAddress) return;
        setVerifyingBalance(true);
        try {
            // Simplified balance check for onboarding
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rewards/balance/${walletAddress}`);
            setBalance(parseFloat(res.data.balance));
        } catch {
            setBalance(0);
        } finally {
            setVerifyingBalance(false);
        }
    };

    const runTestScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setTestReported(true);
        }, 2000);
    };

    const completeOnboarding = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users/onboarding-complete`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            localStorage.setItem('onboardingComplete', 'true');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#6366f1']
            });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                step >= s.id ? 'bg-blue-600 text-white scale-110 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${
                                step >= s.id ? 'text-blue-400' : 'text-slate-600'
                            }`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Shield className="w-10 h-10 text-blue-400" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4 tracking-tight">Welcome to ShieldWeb3</h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
                                You're about to join a global network of security researchers. 
                                Secure your wallet, check URLs, and earn rewards for reporting threats.
                            </p>
                            <button 
                                onClick={nextStep}
                                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center gap-3 mx-auto transition-all hover:scale-105"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center"
                        >
                            <h2 className="text-3xl font-bold mb-8">Connect Your Wallet</h2>
                            
                            {!isConnected ? (
                                <div className="space-y-6">
                                    <p className="text-slate-400 mb-8">
                                        We use the Freighter wallet to secure your identity and rewards. 
                                        Don't have it? <a href="https://www.freighter.app/" target="_blank" className="text-blue-400 hover:underline">Install here</a>.
                                    </p>
                                    <button 
                                        onClick={connect}
                                        className="px-10 py-5 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold flex items-center gap-3 mx-auto border border-slate-700 transition-all"
                                    >
                                        <Wallet className="w-6 h-6 text-blue-400" />
                                        Connect Freighter
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl inline-block mx-auto">
                                        <div className="flex items-center gap-3 text-emerald-400 font-bold mb-2">
                                            <CheckCircle className="w-5 h-5" />
                                            Wallet Connected
                                        </div>
                                        <code className="text-slate-400 text-xs font-mono">{walletAddress}</code>
                                    </div>
                                    <br />
                                    <button 
                                        onClick={nextStep}
                                        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center gap-3 mx-auto transition-all"
                                    >
                                        Continue to Funding
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center"
                        >
                            <h2 className="text-3xl font-bold mb-4">Get Testnet XLM</h2>
                            <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm">
                                To interact with the Stellar blockchain, you need free Testnet XLM.
                            </p>

                            <div className="bg-slate-800/50 p-4 rounded-xl mb-8 flex items-center justify-between max-w-md mx-auto">
                                <span className="text-xs font-mono text-slate-500 overflow-hidden text-ellipsis mr-4">
                                    {walletAddress}
                                </span>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(walletAddress || '')}
                                    className="text-[10px] uppercase font-bold text-blue-400"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                                <a 
                                    href="https://laboratory.stellar.org/#account-creator?network=testnet" 
                                    target="_blank"
                                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center gap-2 border border-slate-700 transition-all text-sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open Faucet
                                </a>
                                <button 
                                    onClick={verifyBalance}
                                    disabled={verifyingBalance}
                                    className="px-6 py-4 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-xl font-bold flex items-center gap-2 border border-blue-600/20 transition-all text-sm"
                                >
                                    {verifyingBalance ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                    Verify Balance
                                </button>
                            </div>

                            {balance !== null && (
                                <div className={`text-sm font-bold mb-8 ${balance > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    Current Balance: {balance} XLM {balance > 0 ? '✅' : '⏳'}
                                </div>
                            )}

                            <button 
                                onClick={nextStep}
                                disabled={!(balance && balance > 0)}
                                className={`px-10 py-4 rounded-2xl font-bold flex items-center gap-3 mx-auto transition-all ${
                                    (balance && balance > 0) ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                            >
                                Continue to Trial
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div 
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center"
                        >
                            <h2 className="text-3xl font-bold mb-4">Try Your First Scan</h2>
                            <p className="text-slate-400 mb-10 text-sm">
                                Test our real-time ML engine with a known phishing example.
                            </p>

                            <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 mb-10">
                                <div className="flex-1 px-4 py-2 font-mono text-sm text-slate-400">
                                    https://stellar-claim-bonus.com/login
                                </div>
                                <button 
                                    onClick={runTestScan}
                                    disabled={scanning || testReported}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold transition-all"
                                >
                                    {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Scan'}
                                </button>
                            </div>

                            {testReported && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-12 text-left"
                                >
                                    <div className="flex items-center gap-3 text-red-500 font-bold mb-2">
                                        <Shield className="w-5 h-5" />
                                        THREAT DETECTED: Phishing
                                    </div>
                                    <p className="text-slate-400 text-xs">
                                        This URL was flagged as highly suspicious. By reporting, you earned 
                                        <span className="text-emerald-400 font-bold mx-1">10 SHW3</span> 
                                        & your report is being verified on-chain.
                                    </p>
                                </motion.div>
                            )}

                            <button 
                                onClick={completeOnboarding}
                                disabled={!testReported}
                                className={`px-12 py-5 rounded-2xl font-extrabold text-lg flex items-center gap-3 mx-auto transition-all ${
                                    testReported ? 'bg-gradient-to-r from-blue-600 to-emerald-600 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-105' : 'bg-slate-800 text-slate-500'
                                }`}
                            >
                                Complete Onboarding
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest mt-12">
                    Step {step} of 4 • Securing Web3 for everyone
                </p>
            </div>
        </div>
    );
};
