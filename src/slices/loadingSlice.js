import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    tabValue : 0,
};

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setTabValue: (state, action) => {
            state.tabValue = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
