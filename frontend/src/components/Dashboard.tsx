import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { StatCard } from './StatCard';
import { MainLayout } from './MainLayout';

export const Dashboard: React.FC = () => {
  const { stats, donations, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Community Overview</h1>
          <p className="text-slate-500">Real-time stats from the FoodLink network</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Active Donations" value={stats?.active_donations || 0} color="bg-blue-500" />
          <StatCard title="Total Impact" value={stats?.total_donations || 0} color="bg-emerald-500" />
          <StatCard title="Registered Users" value={stats?.users_registered || 0} color="bg-indigo-500" />
          <StatCard title="Active Donors" value={stats?.active_donors || 0} color="bg-orange-500" />
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Recent Donations</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Food Item</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((post) => (
                  <tr key={post.ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                    <td className="px-6 py-4 text-slate-600">{post.category}</td>
                    <td className="px-6 py-4 text-slate-600">{post.pickup_location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        post.status === 'available' ? 'bg-green-100 text-green-700' : 
                        post.status === 'claimed' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No recent donations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};