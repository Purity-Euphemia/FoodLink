import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api/client';
import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

interface AuthResponse {
  token?: string;
  name?: string;
  role?: 'donor' | 'recipient';
  user?: {
    name: string;
    role: 'donor' | 'recipient';
  };
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      
      if (isLogin) {
        if (data.token && data.name && data.role) {
          login(data.token, {
            name: data.name,
            role: data.role
          });
          navigate('/dashboard');
        } else {
          alert("Invalid credentials or server response.");
        }
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
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-green outline-none transition-all"
              onChange={handleChange}
              required
            />
          )}
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-green outline-none transition-all"
            onChange={handleChange}
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password (min 6 chars)" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-green outline-none transition-all"
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input 
                type="text" 
                name="phone"
                placeholder="Phone Number" 
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-green outline-none transition-all"
                onChange={handleChange}
              />
              <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                <button 
                  type="button"
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'donor' ? 'bg-white shadow-sm text-brand-green font-bold' : 'text-slate-500'}`}
                  onClick={() => setFormData({...formData, role: 'donor'})}
                >
                  Donor
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.role === 'recipient' ? 'bg-white shadow-sm text-brand-green font-bold' : 'text-slate-500'}`}
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
          className="w-full mt-6 bg-brand-green hover:bg-[#218838] text-white p-3 rounded-lg font-bold active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-green-100"
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button" 
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 p-2.5 rounded-lg text-sm text-slate-600 font-semibold hover:bg-slate-50 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.92 3.04C6.26 7.6 8.94 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.11 2.73-2.36 3.58l3.66 2.84c2.14-1.98 3.37-4.89 3.37-8.57z"/>
              <path fill="#FBBC05" d="M5.31 10.6c-.25-.76-.39-1.57-.39-2.4c0-.83.14-1.64.39-2.4L1.39 2.76C.5 4.54 0 6.54 0 8.6c0 2.06.5 4.06 1.39 5.84l3.92-3.84z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.8 1.09-3.06 0-5.74-2.56-6.68-5.56l-3.92 3.04C3.37 20.33 7.35 23 12 23z"/>
            </svg>
            Google
          </button>
          <button 
            type="button" 
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 p-2.5 rounded-lg text-sm text-slate-600 font-semibold hover:bg-slate-50 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.52-.63.73-1.18 1.87-1.03 2.98 1.11.09 2.24-.55 2.98-1.44z"/>
            </svg>
            Apple
          </button>
        </div>

        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-sm text-slate-500 hover:text-brand-green font-medium transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
};