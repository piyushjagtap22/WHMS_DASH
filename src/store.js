import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { apiSlice } from './slices/apiSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './slices/authSlice';
import deviceReducer from './slices/deviceSlice';
import loadingReducer from './slices/loadingSlice';
import modeReducer from './slices/modeSlice';
import profileReducer from './slices/profileSlice';
import superAdminReducer from './slices/superAdminSlice';
import websocketReducer from './slices/webSocketSlice';

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
  device: deviceReducer,
  websocket: websocketReducer,

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