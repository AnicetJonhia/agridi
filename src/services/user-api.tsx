import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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
}


// Fetch user profile
export const getUserProfile = async (token: string): Promise<UserProfile> => {
    try {
        const response = await axios.get<UserProfile>(`${API_URL}/auth/users/me/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'

            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (token: string, profileData: UserProfile): Promise<UserProfile> => {
    try {
        const response = await axios.patch<UserProfile>(`${API_URL}/auth/users/profile/edit/`, profileData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Server response:', error.response.data); // Log server response
        }
        console.error('Error updating user profile:', error);
        throw error;
    }
};