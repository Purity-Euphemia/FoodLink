import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, PlusCircle, User, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <ChefHat className="text-brand-green h-8 w-8" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">FoodLink</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link to="/dashboard" className="flex items-center gap-1.5 text-brand-green">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              {user?.role === 'donor' && (
                <Link to="/donate" className="flex items-center gap-1.5 hover:text-brand-green transition-colors">
                  <PlusCircle size={18} />
                  New Donation
                </Link>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{user?.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};