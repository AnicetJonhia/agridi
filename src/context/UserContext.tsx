import { createContext, useReducer, ReactNode, useContext } from 'react';
import { getUserProfile, updateUserProfile as updateUserProfileAPI } from '../services/user-api';

interface UserProfile {
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

// State interface
interface UserState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
}

// Action types
interface UserAction {
  type: 'SET_USER' | 'UPDATE_PROFILE';
  payload?: {
    user?: UserProfile;
  };
}

// Context interface
interface UserContextType {
  state: UserState;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: UserProfile) => Promise<void>;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

const initialState: UserState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
};

// Reducer function
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
    case 'UPDATE_PROFILE':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user || null,
      };
    default:
      return state;
  }
};

// UserProvider props interface
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component
const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const fetchUserProfile = async () => {
    if (!state.isAuthenticated || !state.token) return;

    try {

      const userProfile = await getUserProfile(state.token);
      dispatch({ type: 'SET_USER', payload: { user: userProfile } });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const updateUserProfile = async (profileData: FormData) => {
    if (!state.token) {
      console.error('No token available to update profile.');
      return;
    }

    try {
      const updatedProfile = await updateUserProfileAPI(state.token, profileData);
      dispatch({ type: 'UPDATE_PROFILE', payload: { user: updatedProfile } });
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  return (
    <UserContext.Provider value={{ state, fetchUserProfile, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using UserContext
const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext, UserProvider, useUser };