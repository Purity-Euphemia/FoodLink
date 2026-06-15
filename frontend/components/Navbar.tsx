import React from 'react';
import { LayoutDashboard, LogOut, PlusCircle, User, ChefHat } from 'lucide-react';

export const Navbar: React.FC = () => {
  const userName = localStorage.getItem('name') || 'User';
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    window.location.href = '/'; // Simple redirect to landing/login
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <ChefHat className="text-indigo-600 h-8 w-8" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">FoodLink</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <a href="/dashboard" className="flex items-center gap-1.5 text-indigo-600">
                <LayoutDashboard size={18} />
                Dashboard
              </a>
              {userRole === 'donor' && (
                <a href="/donate" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <PlusCircle size={18} />
                  New Donation
                </a>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{userName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{userRole}</p>
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