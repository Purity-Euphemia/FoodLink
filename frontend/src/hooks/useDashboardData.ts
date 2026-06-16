import { useState, useEffect, useCallback } from 'react';
import { client } from '../api/client';
import { DashboardStats, FoodPost } from '../types';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [donations, setDonations] = useState<FoodPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, donationsRes] = await Promise.all([
        client.get<DashboardStats>('/stats'),
        client.get<FoodPost[]>('/donations')
      ]);
      setStats(statsRes.data);
      setDonations(donationsRes.data);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, donations, loading, error, refresh: fetchData };
};
