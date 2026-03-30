import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMyReports } from '../lib/api';
import type { Report } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, isConnected } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setLoading(true);
      getMyReports()
        .then(setReports)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isConnected]);

  if (!isConnected || !user) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center">
        <p className="text-xl">Please connect your wallet to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-white flex">
      <aside className="w-64 bg-slate p-6 border-r border-gray-700">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-4" />
          <h2 className="font-bold text-lg">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</h2>
          <div className="mt-4">
            <p className="text-3xl font-bold text-primary-blue">{user.shw3Balance} SHW3</p>
          </div>
          <div className="mt-4 bg-navy rounded-full h-2">
            <div className="bg-safe-green h-2 rounded-full" style={{ width: `${user.reputation}%` }} />
          </div>
          <p className="text-sm mt-1 text-gray-400">Reputation: {user.reputation}/100</p>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Your Activity</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate p-6 rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-2">Total Reports</p>
            <p className="text-3xl font-bold">{user.totalReports}</p>
          </div>
          <div className="bg-slate p-6 rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-2">Verified</p>
            <p className="text-3xl font-bold text-safe-green">{user.verifiedReports}</p>
          </div>
        </div>

        <div className="bg-slate rounded-xl border border-gray-700 overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b border-gray-700">My Reports</h2>
          {loading ? (
            <p className="p-6">Loading reports...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-navy">
                <tr>
                  <th className="p-4 border-b border-gray-700">URL</th>
                  <th className="p-4 border-b border-gray-700">Status</th>
                  <th className="p-4 border-b border-gray-700">Reward</th>
                  <th className="p-4 border-b border-gray-700">TxHash</th>
                  <th className="p-4 border-b border-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="border-b border-gray-700 hover:bg-navy/50">
                    <td className="p-4 text-sm">{report.url}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${report.status === 'Verified' ? 'bg-safe-green/20 text-safe-green' : 'bg-gray-700 text-gray-300'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-primary-blue">+{report.reward} SHW3</td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {report.txHash ? 
                        <a href={`https://stellar.expert/explorer/testnet/tx/${report.txHash}`} target="_blank" rel="noreferrer" className="hover:text-primary-light underline">
                          {report.txHash.slice(0, 10)}...
                        </a> 
                      : 'Pending'}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{new Date(report.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">No reports submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};
