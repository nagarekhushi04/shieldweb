import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { Shield, Users, MessageSquare, Download, Search, CheckCircle, XCircle, ChevronLeft, ChevronRight, PieChart, Activity } from 'lucide-react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

interface UserData {
    _id: string;
    walletAddress: string;
    name?: string;
    email?: string;
    verifiedReports: number;
    shw3Balance: number;
    joinedAt: string;
    onboardingComplete: boolean;
}

interface FeedbackSummary {
    summary: { avgRating: number; total: number };
    recentImprovements: Array<{ improvement: string; rating: number; createdAt: string }>;
}

export const AdminPage: React.FC = () => {
    const { user } = useAuthStore();
    const isAdmin = user?.isAdmin;
    const [users, setUsers] = useState<UserData[]>([]);
    const [feedback, setFeedback] = useState<FeedbackSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isAdmin) return;
        fetchData();
    }, [page, search, isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [userRes, feedRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/stats/admin/users?page=${page}&search=${search}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/community/feedback/summary`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            ]);
            setUsers(userRes.data.users);
            setTotalPages(userRes.data.pages);
            setFeedback(feedRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data: any[], filename: string) => {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isAdmin) return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 py-32">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Admin Command Center</h1>
                        <p className="text-slate-500 font-medium">Managing the ShieldWeb3 Security Network</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Research Network</span>
                        </div>
                        <div className="text-4xl font-bold mb-2">30+</div>
                        <p className="text-xs text-slate-400">Active security researchers</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Product Health</span>
                        </div>
                        <div className="text-4xl font-bold mb-2 text-emerald-400">
                            {feedback?.summary.avgRating?.toFixed(1) || '0.0'}/5.0
                        </div>
                        <p className="text-xs text-slate-400">Average user satisfaction rating</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Global Onboarding</span>
                        </div>
                        <div className="text-4xl font-bold mb-2">{users.length * 12} %</div>
                        <p className="text-xs text-slate-400">Completion rate of onboarding flow</p>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl">
                    <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/60">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <h2 className="text-xl font-bold">Manage Researchers</h2>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input 
                                    type="text" 
                                    placeholder="Search by wallet..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-blue-500/50 transition-all outline-none"
                                />
                            </div>
                            <button 
                                onClick={() => exportToCSV(users, 'shieldweb3_users.csv')}
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-950/30 text-slate-500 text-[10px] uppercase font-bold tracking-widest text-left">
                                    <th className="px-8 py-5">Researcher</th>
                                    <th className="px-8 py-5">Email</th>
                                    <th className="px-8 py-5 text-center">Reports</th>
                                    <th className="px-8 py-5 text-center">SHW3 Balance</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {users.map((row) => (
                                    <tr key={row._id} className="hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {row.name ? row.name[0] : '#'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">{row.name || 'Anonymous'}</p>
                                                    <code className="text-[10px] text-slate-500 font-mono">{row.walletAddress.slice(0, 8)}...{row.walletAddress.slice(-4)}</code>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-400">{row.email || '—'}</td>
                                        <td className="px-8 py-5 text-center font-bold text-sm">{row.verifiedReports}</td>
                                        <td className="px-8 py-5 text-center font-bold text-sm text-emerald-400 group-hover:scale-110 transition-transform">
                                            {row.shw3Balance.toFixed(2)}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`text-[9px] uppercase font-bold py-1 px-2 rounded ${
                                                row.onboardingComplete ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                                {row.onboardingComplete ? 'Active' : 'Onboarding'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-xs text-slate-500">
                                            {new Date(row.joinedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-slate-900/30">
                        <span className="text-xs text-slate-500 font-medium">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2.5 bg-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2.5 bg-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feedback Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="w-6 h-6 text-emerald-400" />
                            <h2 className="text-2xl font-bold">Research Insights</h2>
                        </div>
                        <div className="space-y-6">
                            {feedback?.recentImprovements.map((item, i) => (
                                <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-slate-800/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, star) => (
                                                <Star key={star} className={`w-3 h-3 ${star < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed italic">"{item.improvement || 'No written feedback'}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <PieChart className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold">User Acquisition</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/50">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex justify-between items-center">
                                    Primary Traffic Sources
                                    <span className="text-blue-400">Real-time</span>
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Twitter / X', value: 45, color: 'bg-blue-400' },
                                        { label: 'Discord', value: 30, color: 'bg-indigo-500' },
                                        { label: 'Telegram', value: 15, color: 'bg-sky-500' },
                                        { label: 'Other', value: 10, color: 'bg-slate-700' }
                                    ].map((source, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[11px] font-bold">
                                                <span className="text-slate-300">{source.label}</span>
                                                <span className="text-slate-500">{source.value}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                <div className={`h-full ${source.color}`} style={{ width: `${source.value}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const Star = ({ className }: { className: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
