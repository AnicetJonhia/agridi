// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfileState {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  bio: string;
  website: string;
  role: string;
  date_of_birth: string;
  alternate_email: string;
  linkedin: string;
  profile_picture: string | null;
}

const initialState: UserProfileState = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  address: "",
  bio: "",
  website: "",
  role: "",
  date_of_birth: "",
  alternate_email: "",
  linkedin: "",
  profile_picture: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfileState>) => {
      return { ...state, ...action.payload };
    },
    updateUserProfileField: (
      state,
      action: PayloadAction<{ key: keyof UserProfileState; value: any }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { setUserProfile, updateUserProfileField } = userSlice.actions;

export default userSlice.reducer;
