import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api/client';
import { MainLayout } from '../layouts/MainLayout';
import { AxiosError } from 'axios';
import { Calendar, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export const DonatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Veg',
    quantity: '',
    pickup_location: '',
    expiry_date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate that expiry date is in the future
      const expiry = new Date(formData.expiry_date);
      if (expiry <= new Date()) {
        setError("Expiry date must be in the future.");
        setIsLoading(false);
        return;
      }

      // Prepare payload - expiry_date must be JSON date string
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: formData.quantity,
        pickup_location: formData.pickup_location,
        expiry_date: expiry.toISOString(),
        status: 'available'
      };

      await client.post('/donations', payload);
      alert("Donation posted successfully!");
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as AxiosError<{error: string}>;
      const errorMessage = error.response?.data?.error || "Failed to post donation. Please try again.";
      setError(errorMessage);
      console.error("Post donation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="text-indigo-600 h-8 w-8" />
            Share Extra Food
          </h1>
          <p className="text-slate-500 mt-2">Help reduce food waste and support families in your community</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Action failed</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Food Title *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                placeholder="e.g., Fresh Organic Apples, Freshly Baked Bread"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select 
                name="category"
                value={formData.category}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                onChange={handleChange}
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Cooked">Cooked Food</option>
                <option value="Raw">Raw / Grocery</option>
                <option value="Bakery">Bakery / Pastry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity *</label>
              <input 
                type="text" 
                name="quantity"
                value={formData.quantity}
                placeholder="e.g., 5 kg, 10 loaves, 3 portions"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                rows={3}
                placeholder="List ingredients, allergen details, or packaging status..."
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin size={16} className="text-slate-400" />
                Pickup Location
              </label>
              <input 
                type="text" 
                name="pickup_location"
                value={formData.pickup_location}
                placeholder="e.g., 123 Main St Lobby, Corner Bakery"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar size={16} className="text-slate-400" />
                Expiry Date & Time *
              </label>
              <input 
                type="datetime-local" 
                name="expiry_date"
                value={formData.expiry_date}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-lg font-semibold transition-all text-center"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-lg font-semibold shadow-md shadow-indigo-100 active:scale-[0.98] transition-all"
            >
              {isLoading ? 'Posting Donation...' : 'Post Donation'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
