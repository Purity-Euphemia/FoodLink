import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Dashboard as DashboardComponent } from '../components/Dashboard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Shared Navigation */}
      <Navbar />
      
      <main>
        {/* Main Dashboard Content */}
        <DashboardComponent />
      </main>
    </div>
  );
};