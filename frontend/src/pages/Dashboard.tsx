import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import { StatCard } from '../components/StatCard';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { client } from '../api/client';
import { MapPin, Bell, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { FoodPost } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, donations, loading, error, refresh } = useDashboardData();
  const { user } = useAuth();
  const [claimError, setClaimError] = useState<string | null>(null);
  
  // Modal states
  const [selectedPost, setSelectedPost] = useState<FoodPost | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [claimedTitle, setClaimedTitle] = useState('');

  const handleClaim = async (post: FoodPost) => {
    setClaimError(null);
    try {
      await client.patch(`/donations/${post.ID}/claim`);
      setClaimedTitle(post.title);
      setSelectedPost(null);
      setShowSuccessOverlay(true);
      refresh();
    } catch (err: any) {
      console.error("Failed to claim donation:", err);
      const errMsg = err.response?.data?.error || "Failed to claim donation.";
      setClaimError(errMsg);
      alert(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  // Get stylized image placeholders based on category
  const getCategoryImage = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'non-veg':
      case 'cooked':
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
      case 'bakery':
        return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60';
      case 'veg':
      case 'raw':
      default:
        return 'https://images.unsplash.com/photo-1610348725531-843dff14722a?w=500&auto=format&fit=crop&q=60';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
        
        {/* Welcome and Header Area (Mockup Screen 3) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <MapPin size={14} className="text-brand-green" />
              <span>Lagos, Nigeria</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Hello, {user?.name || 'Friend'} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">Let's save food and feed people.</p>
          </div>
          <button className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full"></span>
          </button>
        </div>

        {/* Quick Actions Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/donate')}
            className="bg-brand-green hover:bg-[#218838] p-6 rounded-2xl text-white shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold">Donate Food</h3>
              <p className="text-green-100 text-sm mt-1">Share extra food</p>
            </div>
            <span className="text-3xl font-bold bg-white/20 p-2.5 rounded-xl">🍔</span>
          </div>

          <div 
            className="bg-brand-light hover:bg-[#d8edd9] p-6 rounded-2xl text-brand-green cursor-pointer transition-all hover:scale-[1.01] flex justify-between items-center border border-[#c4e6c7]"
            onClick={() => {
              const element = document.getElementById("donations-list");
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div>
              <h3 className="text-xl font-bold text-slate-800">Find Food</h3>
              <p className="text-brand-gray text-sm mt-1">Find available donations</p>
            </div>
            <span className="text-3xl font-bold bg-white/50 p-2.5 rounded-xl">🥗</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Donations" value={stats?.active_donations || 0} color="bg-brand-green" />
          <StatCard title="Total Impact" value={stats?.total_donations || 0} color="bg-brand-orange" />
          <StatCard title="Registered Users" value={stats?.users_registered || 0} color="bg-slate-800" />
          <StatCard title="Active Donors" value={stats?.active_donors || 0} color="bg-brand-green" />
        </div>

        {/* Donations List Container */}
        <div id="donations-list" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-orange animate-pulse" />
              Nearby Donations
            </h2>
            <span className="text-xs text-slate-400 italic">Showing active community posts</span>
          </div>

          {/* Cards Grid (Mockup Screen 3 list cards representation) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((post) => (
              <div 
                key={post.ID} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="h-44 relative bg-slate-100 overflow-hidden">
                    <img 
                      src={getCategoryImage(post.category)} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-brand-light text-brand-green text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{post.title}</h3>
                    <div className="flex flex-col gap-1 text-slate-500 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{post.pickup_location || 'Lagos, Nigeria'} · <span className="font-semibold text-slate-700">2.3 km away</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span>Expires: <span className="font-semibold text-slate-700">{post.expiry_date ? new Date(post.expiry_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Today, 9:00 PM'}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="w-full bg-brand-light hover:bg-brand-green hover:text-white text-brand-green font-bold text-sm py-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}

            {donations.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 italic text-sm">No active donations nearby. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Donation Detail Modal (Mockup Screen 6) */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="h-56 relative bg-slate-100">
                <img 
                  src={getCategoryImage(selectedPost.category)} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white w-8 h-8 rounded-full text-slate-800 transition-colors shadow-md flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
                <span className="absolute bottom-4 left-4 bg-white text-brand-green text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                  {selectedPost.quantity || '15 Portions'}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-grow overflow-y-auto">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedPost.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin size={12} className="text-brand-green" />
                    <span>Restaurant Grand · <span className="font-semibold text-slate-700">2.3 km away</span></span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">About this donation</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedPost.description || 'Freshly prepared meals. Please claim and help support local food distribution.'}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                  <div>
                    <h5 className="text-xs font-bold uppercase text-slate-400">Pickup Address</h5>
                    <p className="text-slate-800 font-medium mt-0.5">{selectedPost.pickup_location || 'Lagos, Nigeria'}</p>
                  </div>
                  <div className="text-right">
                    <h5 className="text-xs font-bold uppercase text-slate-400">Best Before</h5>
                    <p className="text-slate-800 font-medium mt-0.5">
                      {selectedPost.expiry_date ? new Date(selectedPost.expiry_date).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : 'Today, 9:00 PM'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                {user?.role === 'recipient' && selectedPost.status === 'available' && (
                  <button 
                    onClick={() => handleClaim(selectedPost)}
                    className="flex-1 bg-brand-green hover:bg-[#218838] text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                  >
                    Claim Donation
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Success Overlay (Mockup Screen 9) */}
        {showSuccessOverlay && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-brand-light text-brand-green rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={36} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  You have successfully claimed <span className="font-semibold text-slate-800">{claimedTitle}</span>. 
                  Please head to the pickup location.
                </p>
              </div>

              <button 
                onClick={() => setShowSuccessOverlay(false)}
                className="w-full bg-brand-green hover:bg-[#218838] text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-100 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};