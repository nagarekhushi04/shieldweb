import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { Shield, Wallet, Zap, CheckCircle, ExternalLink, ArrowRight, Loader2, Star, Zap as Bolt, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_STEPS = [
  { id: 1, title: 'Welcome', icon: Shield, desc: 'Secure your digital identity' },
  { id: 2, title: 'Connect', icon: Wallet, desc: 'Auth via Stellar ledger' },
  { id: 3, title: 'Fund', icon: Bolt, desc: 'Acquire protocol gas' },
  { id: 4, title: 'Trial', icon: CheckCircle, desc: 'Simulated threat scan' },
];

export const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const { isConnected, walletAddress, connect } = useAuthStore();
    const [balance, setBalance] = useState<number | null>(null);
    const [verifyingBalance, setVerifyingBalance] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [testReported, setTestReported] = useState(false);
    const navigate = useNavigate();

    const nextStep = () => setStep(s => Math.min(s + 1, 4));

    const verifyBalance = async () => {
        if (!walletAddress) return;
        setVerifyingBalance(true);
        try {
            const res = await api.get(`/api/rewards/balance/${walletAddress}`);
            if (res.data) {
                setBalance(parseFloat(res.data.balance || res.data.shw3 || '0'));
            } else {
                setBalance(0);
            }
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
            await api.post(`/api/auth/onboarding-complete`, {});
            localStorage.setItem('onboardingComplete', 'true');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ef233c', '#ff4d63', '#f59e0b']
            });
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            console.error('Onboarding completion failed', err);
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-ground">
            <Navbar />

            <div className="container-page pt-32 pb-20 max-w-4xl">
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-20 relative px-4">
                    <div className="absolute top-5 left-0 w-full h-[1px] bg-border z-0" />
                    {ONBOARDING_STEPS.map((s) => {
                      const active = step >= s.id;
                      const current = step === s.id;
                      return (
                        <div key={s.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                                active 
                                  ? 'bg-danger text-white border-danger shadow-[0_0_15px_rgba(239,35,60,0.3)]' 
                                  : 'bg-ground text-text-tertiary border-border shadow-none'
                            } ${current && 'ring-4 ring-danger/10 scale-110'}`}>
                                <s.icon size={18} className={active ? 'fill-white/20' : ''} />
                            </div>
                            <div className="hidden md:flex flex-col items-center mt-4">
                               <span className={`text-[0.6rem] font-black uppercase tracking-widest ${active ? 'text-text-primary' : 'text-text-tertiary'}`}>{s.title}</span>
                               <span className="text-[0.55rem] text-text-tertiary mt-1 opacity-60 font-medium">{s.desc}</span>
                            </div>
                        </div>
                      );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-sky/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-sky/20">
                                <Shield size={40} className="text-sky" />
                            </div>
                            <h2 className="text-heading-lg mb-4 text-center">Defend the Ledger</h2>
                            <p className="text-body text-lg mb-10 max-w-lg mx-auto">
                                You are initializing your identity as a security node on the ShieldWeb3 network. 
                                Secure our ecosystem and earn on-chain rewards.
                            </p>
                            <button 
                                onClick={nextStep}
                                className="btn-primary py-4 px-10 text-md font-bold uppercase tracking-wider mx-auto flex items-center gap-2 group"
                            >
                                Begin Activation
                                <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card p-12 text-center"
                        >
                            <h2 className="text-heading-lg mb-8 text-center">Cipher Identity</h2>
                            
                            {!isConnected ? (
                                <div className="space-y-6">
                                    <p className="text-body text-md mb-10 max-w-md mx-auto">
                                        We use the <strong>Freighter</strong> wallet to secure your identity. 
                                        Don't have it? <a href="https://www.freighter.app/" target="_blank" className="text-sky hover:underline font-bold">Install Freighter</a>.
                                    </p>
                                    <button 
                                        onClick={connect}
                                        className="btn-secondary py-5 px-10 text-xs font-bold uppercase tracking-widest mx-auto flex items-center gap-3 border border-border group active:scale-95"
                                    >
                                        <Wallet size={20} className="text-sky" />
                                        Connect Freighter
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="p-6 rounded-2xl bg-safe-tint border border-safe/10 inline-block mx-auto">
                                        <div className="flex items-center gap-3 text-safe font-bold mb-2 justify-center">
                                            <CheckCircle size={18} />
                                            Active Signature Linked
                                        </div>
                                        <code className="text-text-tertiary text-[0.7rem] font-mono break-all">{walletAddress}</code>
                                    </div>
                                    <br />
                                    <button 
                                        onClick={nextStep}
                                        className="btn-primary py-4 px-10 text-md font-bold mx-auto flex items-center gap-3 group"
                                    >
                                        Continue to Network Sync
                                        <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
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
                            className="card p-12 text-center"
                        >
                            <h2 className="text-heading-lg mb-4 text-center">Stellar Consensus</h2>
                            <p className="text-body mb-10 max-w-sm mx-auto">
                                To commit security logs to the Stellar blockchain, you need free Testnet XLM to pay for network gas.
                            </p>

                            <div className="p-4 rounded-xl bg-surface-low border border-border mb-8 flex items-center justify-between max-w-md mx-auto">
                                <span className="text-[0.65rem] font-mono text-text-tertiary truncate mr-4">
                                    {walletAddress}
                                </span>
                                <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(walletAddress || '');
                                      window.alert("Address copied to clipboard.");
                                    }}
                                    className="text-[0.6rem] font-black uppercase text-sky px-2 border-l border-border"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <a 
                                    href="https://laboratory.stellar.org/#account-creator?network=testnet" 
                                    target="_blank"
                                    className="btn-secondary py-4 px-6 text-[0.7rem] flex items-center gap-2"
                                >
                                    <ExternalLink size={14} />
                                    Launch Faucet
                                </a>
                                <button 
                                    onClick={verifyBalance}
                                    disabled={verifyingBalance}
                                    className="btn-secondary py-4 px-6 text-[0.7rem] flex items-center gap-2 border-sky/30 text-sky"
                                >
                                    {verifyingBalance ? <Loader2 size={14} className="animate-spin" /> : <Bolt size={14} />}
                                    Sync Balance
                                </button>
                            </div>

                            {balance !== null && (
                                <div className={`text-xs font-black uppercase tracking-widest mb-10 ${balance > 0 ? 'text-safe' : 'text-warn animate-pulse'}`}>
                                    Ledger Sync: {balance} XLM {balance > 0 ? 'Verified' : 'Pending...'}
                                </div>
                            )}

                            <button 
                                onClick={nextStep}
                                disabled={!(balance && balance > 0)}
                                className={`btn-primary py-4 px-10 text-md font-bold mx-auto flex items-center gap-3 transition-all ${
                                    (balance && balance > 0) ? 'opacity-100' : 'opacity-40 pointer-events-none'
                                }`}
                            >
                                Continue to Field Trial
                                <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div 
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card p-12 text-center"
                        >
                            <h2 className="text-heading-lg mb-4 text-center">Heuristic Verification</h2>
                            <p className="text-body text-sm mb-12 text-center opacity-70">
                                Test our real-time ML engine with a known phishing vector.
                            </p>

                            <div className="max-w-md mx-auto bg-surface-low border border-border rounded-xl p-2 flex items-center gap-2 mb-12">
                                <div className="flex-1 px-4 py-2 font-mono text-xs text-text-tertiary">
                                    https://stellar-faucet-claim.net/auth
                                </div>
                                <button 
                                    onClick={runTestScan}
                                    disabled={scanning || testReported}
                                    className="btn-primary py-2.5 px-6 text-[0.7rem]"
                                >
                                    {scanning ? <Loader2 size={14} className="animate-spin" /> : 'Run Heuristics'}
                                </button>
                            </div>

                            {testReported && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 rounded-2xl bg-danger-tint border border-danger/10 mb-12 text-left"
                                >
                                    <div className="flex items-center gap-3 text-danger font-black uppercase text-[0.7rem] tracking-widest mb-2">
                                        <Shield size={16} />
                                        Intelligence Confirmed: Phishing
                                    </div>
                                    <p className="text-text-secondary text-[0.8rem] leading-relaxed">
                                        This identifier was matched against our global threat database. 
                                        By committing this report, you've strengthened the network defense index.
                                    </p>
                                </motion.div>
                            )}

                            <button 
                                onClick={completeOnboarding}
                                disabled={!testReported}
                                className={`btn-primary py-5 px-12 text-md font-black uppercase tracking-widest mx-auto flex items-center gap-4 transition-all ${
                                    testReported ? 'hover:scale-[1.02] shadow-[0_4px_24px_rgba(239,35,60,0.4)]' : 'opacity-40 grayscale pointer-events-none'
                                }`}
                            >
                                Activate Node Profile
                                <ChevronRight size={22} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-text-tertiary text-[10px] uppercase font-bold tracking-[0.3em] mt-16 flex items-center justify-center gap-4 opacity-50">
                    <span className="h-px w-10 bg-border" />
                    NODE ACTIVATION SEQUENCE: STEP {step} / 4
                    <span className="h-px w-10 bg-border" />
                </p>
            </div>
        </div>
    );
};
