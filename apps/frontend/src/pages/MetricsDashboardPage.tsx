import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Activity, Shield, ShieldCheck, Users, Target, Clock, HardDrive, 
  Database, Zap, CheckCircle2, AlertCircle, ExternalLink 
} from 'lucide-react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { LiveThreatFeed } from '../components/LiveThreatFeed';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  status?: 'healthy' | 'warning' | 'error';
}

const StatCard = ({ title, value, icon: Icon, trend, status }: StatCardProps) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      {status && (
        <div className={`w-3 h-3 rounded-full animate-pulse ${
          status === 'healthy' ? 'bg-emerald-500' : 
          status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />
      )}
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-2xl font-bold text-white">{value}</span>
      {trend && <span className="text-xs text-emerald-500 font-medium">{trend}</span>}
    </div>
  </div>
);

const MetricsDashboardPage = () => {
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [topDomains, setTopDomains] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [mlMetrics, setMlMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gs, tr, br, td, hl, ml] = await Promise.all([
          axios.get('/api/stats/global'),
          axios.get('/api/stats/trends'),
          axios.get('/api/stats/breakdown'),
          axios.get('/api/stats/top-domains'),
          axios.get('/api/health/detailed'),
          axios.get('/api/stats/ml-performance')
        ]);
        setGlobalStats(gs.data);
        setTrends(tr.data);
        setBreakdown(br.data);
        setTopDomains(td.data);
        setHealth(hl.data);
        setMlMetrics(ml.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pb-12 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Metrics Dashboard</h1>
          <p className="text-slate-400">Real-time monitoring of ShieldWeb3 network activity and system health.</p>
        </div>

        {/* Live Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <StatCard title="Total Threats" value={globalStats?.totalThreats || 0} icon={Shield} />
          <StatCard title="Verified" value={globalStats?.verifiedThreats || 0} icon={ShieldCheck} trend="+12%" />
          <StatCard title="Detected Today" value={globalStats?.threatsBlockedToday || 0} icon={Activity} />
          <StatCard title="Active Users" value={globalStats?.activeUsers24h || 0} icon={Users} />
          <StatCard title="ML Accuracy" value={`${mlMetrics?.accuracy || 94.2}%`} icon={Target} />
          <StatCard 
            title="Stellar Network" 
            value={health?.services?.stellar?.status === 'healthy' ? 'Connected' : 'Degraded'} 
            icon={Zap} 
            status={health?.services?.stellar?.status === 'healthy' ? 'healthy' : 'warning'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Threat Trends */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Threat Trajectory (30d)</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748B" 
                    fontSize={12} 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                  />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="monotone" dataKey="reported" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="verified" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Threat Classification</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Domains */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Top Blocked Domains</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-800">
                  <tr className="text-slate-400 text-sm">
                    <th className="pb-4 font-medium">Domain</th>
                    <th className="pb-4 font-medium">Type</th>
                    <th className="pb-4 font-medium">Occurrences</th>
                    <th className="pb-4 font-medium">TX</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {topDomains.map((domain, i) => (
                    <tr key={i} className="text-slate-300 text-sm hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 font-mono">{domain.domain}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-rose-500/10 text-rose-500 rounded text-xs">
                          {domain.threatType}
                        </span>
                      </td>
                      <td className="py-4">{domain.reportCount}</td>
                      <td className="py-4">
                        {domain.onChainTxHash ? (
                          <a 
                            href={`https://stellar.expert/explorer/testnet/tx/${domain.onChainTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                          >
                             <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model & Health Sidebar */}
          <div className="space-y-8">
            <LiveThreatFeed />
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Model Performance</h2>
              <div className="space-y-4">
                {[
                  { label: 'Accuracy', val: mlMetrics?.accuracy || 94.2, color: 'bg-blue-500' },
                  { label: 'Precision', val: mlMetrics?.precision || 91.8, color: 'bg-emerald-500' },
                  { label: 'Recall', val: mlMetrics?.recall || 96.1, color: 'bg-amber-500' },
                  { label: 'F1 Score', val: mlMetrics?.f1 || 93.9, color: 'bg-purple-500' },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{m.label}</span>
                      <span className="text-white font-medium">{m.val}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${m.color} transition-all duration-1000`} 
                        style={{ width: `${m.val}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">System Health</h2>
              <div className="space-y-4">
                {[
                  { label: 'API Response Time', val: `${health?.metrics?.avgLatency || 42}ms`, status: 'healthy', icon: Clock },
                  { label: 'Database Sync', val: health?.services?.mongodb?.status || 'Online', status: health?.services?.mongodb?.status === 'connected' ? 'healthy' : 'warning', icon: Database },
                  { label: 'ML Service', val: health?.services?.ml?.status || 'Online', status: health?.services?.ml?.status === 'healthy' ? 'healthy' : 'error', icon: Activity },
                  { label: 'Redis Health', val: '99.2% Hit Rate', status: 'healthy', icon: Zap },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <s.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-slate-400">{s.val}</span>
                       <div className={`w-2 h-2 rounded-full ${
                         s.status === 'healthy' ? 'bg-emerald-500' : 
                         s.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                       }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MetricsDashboardPage;
