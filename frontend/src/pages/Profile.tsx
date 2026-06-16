import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  History,
  TrendingUp,
  Star,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
  Bell,
  Leaf,
  ShoppingBag,
  Award,
} from 'lucide-react';

const menuItems = [
  { icon: History, label: 'History', color: 'text-slate-600', bg: 'bg-slate-100' },
  { icon: TrendingUp, label: 'My Impact', color: 'text-brand-green', bg: 'bg-brand-light' },
  { icon: Star, label: 'My Reviews', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Settings, label: 'Settings', color: 'text-slate-600', bg: 'bg-slate-100' },
  { icon: HelpCircle, label: 'Help & Support', color: 'text-blue-500', bg: 'bg-blue-50' },
];

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats } = useDashboardData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Compute some fun profile stats from dashboard data
  const donationsCollected = stats?.total_donations ?? 0;
  const mealsProvided = donationsCollected * 30;
  const co2Saved = Math.round(donationsCollected * 7.6);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'FL';

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto font-sans pb-24 md:pb-6">
        
        {/* Header */}
        <div className="relative bg-brand-green px-6 pt-8 pb-20">
          <div className="flex justify-between items-start">
            <h1 className="text-white font-bold text-lg">My Profile</h1>
            <button className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
            </button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mt-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white">
              <span className="text-2xl font-black text-brand-green">{initials}</span>
            </div>
            <h2 className="text-white font-bold text-xl mt-3">{user?.name || 'FoodLink User'}</h2>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mt-1 capitalize tracking-wide">
              {user?.role || 'member'}
            </span>
          </div>
        </div>

        {/* Stats Card (floats over the green header) */}
        <div className="mx-4 -mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              <div className="flex flex-col items-center gap-1 px-2">
                <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center mb-1">
                  <ShoppingBag size={18} className="text-brand-green" />
                </div>
                <span className="text-xl font-black text-slate-900">{donationsCollected}</span>
                <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">
                  Donations{'\n'}Collected
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mb-1">
                  <Award size={18} className="text-brand-orange" />
                </div>
                <span className="text-xl font-black text-slate-900">{mealsProvided.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">
                  Meals{'\n'}Provided
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mb-1">
                  <Leaf size={18} className="text-green-500" />
                </div>
                <span className="text-xl font-black text-slate-900">{co2Saved}</span>
                <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">
                  CO₂ Saved{'\n'}(kg)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mx-4 mt-5 space-y-2">
          {menuItems.map(({ icon: Icon, label, color, bg }) => (
            <button
              key={label}
              className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 border border-slate-100 hover:border-brand-light hover:shadow-sm transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <span className="flex-1 text-sm font-semibold text-slate-800 text-left">{label}</span>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-green transition-colors" />
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 bg-red-50 hover:bg-red-100 rounded-2xl px-4 py-3.5 border border-red-100 transition-all group mt-4"
          >
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <LogOut size={18} className="text-red-500" />
            </div>
            <span className="flex-1 text-sm font-semibold text-red-600 text-left">Logout</span>
            <ChevronRight size={16} className="text-red-300 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
