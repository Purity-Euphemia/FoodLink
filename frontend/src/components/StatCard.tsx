import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className={`w-10 h-10 ${color} rounded-lg mb-4 flex items-center justify-center text-white font-bold`}>#</div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);