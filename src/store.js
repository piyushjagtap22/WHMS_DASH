import { configureStore } from '@reduxjs/toolkit';
// import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    // [apiSlice.reducerPath] :apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});

export default store;