import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MapPin, Filter, Clock, ChevronRight, Search } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { FoodPost } from '../types';

const getCategoryImage = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'non-veg':
    case 'cooked':
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60';
    case 'bakery':
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60';
    case 'veg':
    case 'raw':
    default:
      return 'https://images.unsplash.com/photo-1610348725531-843dff14722a?w=300&auto=format&fit=crop&q=60';
  }
};

const MOCK_DISTANCES = ['0.8 km', '1.5 km', '2.3 km', '3.1 km', '4.0 km'];

export const NearbyMap: React.FC = () => {
  const navigate = useNavigate();
  const { donations } = useDashboardData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = donations.filter(
    (d) =>
      d.status === 'available' &&
      (d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] font-sans">
        
        {/* Map Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Nearby Donations</h1>
          <button className="p-2 rounded-xl bg-slate-100 hover:bg-brand-light text-slate-600 hover:text-brand-green transition-all">
            <Filter size={18} />
          </button>
        </div>

        {/* Map Embed (OpenStreetMap – no API key needed) */}
        <div className="relative flex-shrink-0" style={{ height: '45%' }}>
          <iframe
            title="Nearby donations map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=3.3,6.4,3.5,6.6&layer=mapnik"
            className="w-full h-full border-0"
            loading="lazy"
          />
          {/* Map pin overlays */}
          <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <MapPin size={12} />
            Lagos, Nigeria
          </div>
          {/* Floating markers */}
          {[
            { top: '30%', left: '40%' },
            { top: '55%', left: '65%' },
            { top: '20%', left: '60%' },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 bg-brand-green rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce"
              style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.3}s`, animationDuration: '2s' }}
            >
              <MapPin size={14} className="text-white" fill="white" />
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="bg-white px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search food type or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Donation Cards List */}
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-20 md:pb-4">
          <div className="p-4 space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <MapPin size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No donations found nearby</p>
              </div>
            )}
            {filtered.map((post: FoodPost, idx: number) => (
              <div
                key={post.ID}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 p-3 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                onClick={() => navigate('/dashboard')}
              >
                <img
                  src={getCategoryImage(post.category)}
                  alt={post.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{post.title}</h3>
                  <p className="text-xs text-brand-green font-semibold mt-0.5">
                    {post.quantity || '15 Portions'}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin size={10} />
                      {MOCK_DISTANCES[idx % MOCK_DISTANCES.length]} away
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={10} />
                      {post.expiry_date
                        ? new Date(post.expiry_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Today, 9:00 PM'}
                    </span>
                  </div>
                </div>
                <button className="bg-brand-green text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#218838] transition-all flex items-center gap-1 flex-shrink-0">
                  View
                  <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
