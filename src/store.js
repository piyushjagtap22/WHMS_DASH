import { configureStore } from '@reduxjs/toolkit';
// import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import superAdminReducer from './slices/superAdminSlice';
import modeReducer from './slices/modeSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    superAdmin: superAdminReducer,
    mode: modeReducer,
    // [apiSlice.reducerPath] :apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});

export default store;