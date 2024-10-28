

import {create} from 'zustand';
import { getUserProfile, updateUserProfile as updateUserProfileAPI } from '@/services/user-api.tsx';

interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  bio: string;
  website: string;
  role: string;
  profile_picture?: string;
  date_of_birth?: string;
  alternate_email?: string;
  linkedin?: string;
  is_active?: boolean;
}

interface UserState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: FormData) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  fetchUserProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const userProfile = await getUserProfile(token);
      set({ user: userProfile, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  },
  updateUserProfile: async (profileData: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token available to update profile.');
      return;
    }

    try {
      const updatedProfile = await updateUserProfileAPI(token, profileData);
      set({ user: updatedProfile });
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  },
}));

export default useUserStore;
