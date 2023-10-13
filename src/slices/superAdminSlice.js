import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Define the initial state for profile data
    userInfo : [],
}

const SuperAdminSlice = createSlice({
    name : 'superAdmin',
    initialState,
    reducers: {
        //To fetch all users
        SetUsers : (state, action) => {
            console.log(action, payload)
            state.userInfo = action.payload;
        },
    },
});

export const { SetUsers } = SuperAdminSlice.actions;

export default SuperAdminSlice.reducer;