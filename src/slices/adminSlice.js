import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
    // Define the initial state for profile data
    adminInfo: null, // You can set it to null or an empty object initially
    currentDevice: null
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
        setCurrentDevice: (state, action) => {
            console.log("Current Device updated to", action.payload)
            state.currentDevice = action.payload; // Corrected this line

        }
        // Add more actions as needed
    },
});



export const { setAdminInfo, setCurrentDevice } = adminSlice.actions;

export default adminSlice.reducer;