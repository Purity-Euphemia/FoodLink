import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { DonatePage } from './pages/Donate';
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
          {/* Auth & Registration */}
          <Route path="/" element={<Register />} />
          {/* Protected Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Donate Page */}
          <Route path="/donate" element={<DonatePage />} />
          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);