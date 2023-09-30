import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Define the initial state for profile data
    userInfo: null, // You can set it to null or an empty object initially
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // Define actions to update profile data
        setProfileInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        // Add more actions as needed
    },
});

export const { setProfileInfo } = profileSlice.actions;

export default profileSlice.reducer;
