// Shared interfaces for API responses
export interface DashboardStats {
  active_donations: number;
  total_donations: number;
  users_registered: number;
  active_donors: number;
}

export interface FoodPost {
  ID: number;
  title: string;
  category: string;
  pickup_location: string;
  status: 'available' | 'claimed' | 'completed';
  donor_id: number;
  recipient_id?: number;
  created_at: string;
}