import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className={`w-10 h-10 ${color} rounded-lg mb-4 opacity-20`}></div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-3xl font-bold text-slate-900 mt-1">{value.toLocaleString()}</h3>
  </div>
);