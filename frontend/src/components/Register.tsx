import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api/client';
import { AxiosError } from 'axios';

interface AuthResponse {
  token?: string;
  user?: {
    name: string;
    role: string;
  };
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'donor'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password } 
        : formData;
        
      const { data } = await client.post<AuthResponse>(endpoint, payload);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user?.name || formData.name || 'User');
        localStorage.setItem('role', data.user?.role || formData.role);
        navigate('/dashboard');
      } else {
        alert("Account created! Please login.");
        setIsLogin(true);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{error: string}>;
      const errorMessage = error.response?.data?.error || "Registration failed. Please check your details.";
      console.error("Signup failed:", error);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <div className="space-y-4">
          {!isLogin && (
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={handleChange}
              required
            />
          )}
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={handleChange}
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password (min 6 chars)" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input 
                type="text" 
                name="phone"
                placeholder="Phone Number" 
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={handleChange}
              />
              <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                <button 
                  type="button"
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'donor' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                  onClick={() => setFormData({...formData, role: 'donor'})}
                >
                  Donor
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'recipient' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                  onClick={() => setFormData({...formData, role: 'recipient'})}
                >
                  Recipient
                </button>
              </div>
            </>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-8 bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>

        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
};