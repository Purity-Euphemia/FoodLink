import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { DonatePage } from './pages/Donate';
import { NearbyMap } from './pages/NearbyMap';
import { Profile } from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Onboarding / Splash */}
          <Route path="/" element={<Onboarding />} />
          {/* Auth */}
          <Route path="/login" element={<Register />} />
          <Route path="/register" element={<Register />} />
          {/* Protected App */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/nearby" element={<NearbyMap />} />
          <Route path="/profile" element={<Profile />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);