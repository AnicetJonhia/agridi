
import { create } from 'zustand';
import {
  getUserProfile,
  updateUserProfile as updateUserProfileAPI,
  getAllUsers,
  getSpecificUSer
} from '@/services/user-api.tsx';

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
  users: UserProfile[];
  specificUser: UserProfile | null;
  isAuthenticated: boolean;
  fetchUserProfile: (token: string) => Promise<void>;
  updateUserProfile: (token: string, profileData: FormData) => Promise<void>;
  fetchAllUsers: (token: string) => Promise<void>;
  fetchSpecificUser: (token: string, userId: number) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  users: [],
  specificUser: null,
  isAuthenticated: false,

  fetchUserProfile: async (token: string) => {
    if (!token) return;

    try {
      const userProfile = await getUserProfile(token);
      set({ user: userProfile, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  },

  updateUserProfile: async (token: string, profileData: FormData) => {
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

  fetchAllUsers: async (token: string) => {
    if (!token) return;

    try {
      const users = await getAllUsers(token);
      set({ users, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  fetchSpecificUser: async (token: string, userId: number) => {
    if (!token) return;

    try {
      const specificUser = await getSpecificUSer(token, userId);
      set({ specificUser });
    } catch (error) {
      console.error('Failed to fetch specific user profile:', error);
    }
  },
}));

export default useUserStore;

