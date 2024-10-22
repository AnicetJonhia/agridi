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

// Initial state
const initialState: UserState = {
    user: null,
    token: localStorage.getItem('token'),
};

// Reducer function
const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'SET_USER':
        case 'UPDATE_PROFILE':
            return {
                ...state,
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
        try {
            const userProfile = await getUserProfile(state.token!);
            dispatch({ type: 'SET_USER', payload: { user: userProfile } });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const updateUserProfile = async (profileData: UserProfile) => {
        try {
            console.log('Updating profile with data:', profileData); // Log the payload

            const updatedProfile = await updateUserProfileAPI(state.token!, profileData);
            dispatch({ type: 'UPDATE_PROFILE', payload: { user: updatedProfile } });
            console.log('updating success:', updatedProfile); // Log the payload
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
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserContext, UserProvider, useUser };