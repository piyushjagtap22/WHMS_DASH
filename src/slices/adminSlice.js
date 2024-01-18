import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Define the initial state for profile data
    adminInfo: null, // You can set it to null or an empty object initially
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // Define actions to update profile data
        setAdminInfo: (state, action) => {
            console.log(action.payload)
            state.adminInfo = action.payload;
        },
        // Add more actions as needed
    },
});



export const { setAdminInfo } = adminSlice.actions;

export default adminSlice.reducer;