import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import superAdminReducer from './slices/superAdminSlice';
import modeReducer from './slices/modeSlice';
import loadingReducer from './slices/loadingSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authSliceReducer from './slices/authSlice'; // Import the authSlice.reducer
import deviceReducer from './slices/deviceSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['device', 'auth'] // Specify which slices you want to persist
};

// Combine reducers
const persistedReducer = persistReducer(persistConfig, combineReducers({
  auth: authReducer,
  profile: profileReducer,
  superAdmin: superAdminReducer,
  mode: modeReducer,
  loading: loadingReducer,
  device: deviceReducer
}));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necessary for redux-persist
    }),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;