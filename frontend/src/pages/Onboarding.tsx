import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const slides = [
  {
    title: 'Good Food Shouldn\'t Go to Waste',
    subtitle: 'Connect with people and organizations to share food and fight hunger.',
  },
  {
    title: 'Donate in Minutes',
    subtitle: 'List your surplus food in seconds and help someone nearby today.',
  },
  {
    title: 'Find Food Near You',
    subtitle: 'Browse available donations from generous donors in your community.',
  },
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between font-sans px-6 py-10 overflow-hidden">
      
      {/* Logo */}
      <div className="flex items-center gap-2 self-start">
        <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center shadow-md shadow-green-200">
          <Heart size={18} className="text-white" fill="white" />
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">FoodLink</span>
      </div>

      {/* Illustration */}
      <div className="w-full flex flex-col items-center gap-6 my-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
          {/* Decorative background circle */}
          <div className="absolute inset-0 bg-brand-light rounded-full scale-90 opacity-60" />
          <img
            src="/onboarding.png"
            alt="People sharing food"
            className="relative w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        {/* Slide text */}
        <div className="text-center space-y-3 min-h-[100px] flex flex-col items-center justify-center">
          <h1
            key={current}
            className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight animate-fade-in transition-all"
          >
            {slides[current].title}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xs">
            {slides[current].subtitle}
          </p>
        </div>

        {/* Pagination dots */}
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2.5 bg-brand-green'
                  : 'w-2.5 h-2.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          id="onboarding-get-started"
          onClick={() => navigate('/register')}
          className="w-full bg-brand-green hover:bg-[#218838] active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all text-base"
        >
          Get Started
        </button>
        <button
          id="onboarding-login"
          onClick={() => navigate('/login')}
          className="w-full text-sm text-slate-500 hover:text-brand-green font-semibold transition-colors py-2"
        >
          Already have an account?{' '}
          <span className="text-brand-green font-bold">Login</span>
        </button>
      </div>
    </div>
  );
};
