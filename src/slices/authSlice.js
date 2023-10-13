// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const initialState = {
  token: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null,
  AuthUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmailId: (state, action) => {
      state.emailId = action.payload.email;
    },
    setUserId: (state, action) => {
      state.userId = action.payload.id;
    },
    setToken: (state, action) => {
      state.token = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setAuthUser: (state, action) => {
      state.AuthUser = action.payload;
    },
  },
});

export const { setToken, logout, setUserId, setEmailId, setAuthUser } = authSlice.actions;

// Add an asynchronous action to initialize AuthUser based on Firebase auth state
export const initializeAuthUser = () => (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setAuthUser(user.toJSON()));
    } else {
      dispatch(setAuthUser(null));
    }
  });
};

export default authSlice.reducer;
