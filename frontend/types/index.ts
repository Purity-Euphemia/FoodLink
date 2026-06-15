export interface User {
  ID?: number;
  user_id?: number; // Matches the 'user_id' field in the login response from auth_handler.go
  name: string;
  email: string;
  role: 'donor' | 'recipient';
  phone?: string;
}

export interface FoodPost {
  ID: number;
  CreatedAt: string;
  title: string;
  description: string;
  category: string;
  quantity: string;
  pickup_location: string;
  image_url: string;
  expiry_date: string;
  donor_id: number;
  recipient_id?: number;
  status: 'available' | 'claimed' | 'completed';
}

export interface DashboardStats {
  active_donations: number;
  active_donors: number;
  total_donations: number;
  users_registered: number;
}
