import { configureStore } from '@reduxjs/toolkit';
// import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import superAdminReducer from './slices/superAdminSlice';
import modeReducer from './slices/modeSlice';
import loadingReducer from './slices/loadingSlice'
import authSliceReducer from './slices/authSlice'; // Import the authSlice.reducer
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {

    auth: authSliceReducer,
    profile: profileReducer,
    superAdmin: superAdminReducer,
    mode: modeReducer,
    loading: loadingReducer,
    admin: adminReducer
    // [apiSlice.reducerPath] :apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

  devTools: true,
});

export default store;