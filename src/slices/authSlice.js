// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getMongoUser } from './usersApiSlice';

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
      state.emailIdVerified = action.payload.emailIdVerified;
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
    setMongoUser: (state, action) => {
      console.log(action.payload)
      state.MongoUser = action.payload;
    }
  },
});

export const { setToken, logout, setUserId, setEmailId, setAuthUser, setMongoUser } = authSlice.actions;

// Add an asynchronous action to initialize AuthUser based on Firebase auth state
export const initializeAuthUser = () => async (dispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      dispatch(setAuthUser(user.toJSON()));
      await getMongoUser(user.stsTokenManager.accessToken).then((res) => {
        if (res.status == 200) {
          console.log(res.data)
          dispatch(setMongoUser(res.data));
        }
      });
    } else {
      dispatch(setAuthUser(null));
      dispatch(setMongoUser(null));
    }
  });
};

export default authSlice.reducer;
