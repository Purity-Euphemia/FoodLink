import React, { useState } from 'react';
import { client } from '../src/api/client';
import { AxiosError } from 'axios';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'recipient'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/register', formData);
      alert("Account created! Please login.");
    } catch (err: unknown) {
      const error = err as AxiosError<{error: string}>;
      const errorMessage = error.response?.data?.error || "Registration failed. Please check your details.";
      console.error("Signup failed:", error);
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create Account</h2>
        
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password (min 6 chars)" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
        </div>

        <button type="submit" className="w-full mt-8 bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all">
          Sign Up
        </button>
      </form>
    </div>
  );
};