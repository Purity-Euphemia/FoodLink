import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Dashboard as DashboardComponent } from '../components/Dashboard';

export const DashboardPage: React.FC = () => {
  useEffect(() => {
    // Basic route protection
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // Redirect to register/login if no token
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header / Navigation */}
      <Navbar />
      
      <main>
        {/* Main Dashboard Content */}
        <DashboardComponent />
      </main>
    </div>
  );
};