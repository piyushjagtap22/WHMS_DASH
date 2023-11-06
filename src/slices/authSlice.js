// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

export const callUserApi = (user) => async (dispatch) => {
  try {
    const url = `http://localhost:3000/api/user/findUserByEmail/${user.email}`;
    console.log("chala rha hu api calluserapi ke andr",url)
    const response = await axios.get(url);
    
    // Dispatch the result to the store
    // dispatch(checkUserExists(user.email));
    return response;
  } catch (error) {
    throw error;
  }
};


export const createUser = (user) => async (dispatch) => {
  console.log("create user runningh");
  
  const postdata = {
    name: user.displayName,
  };
  const headers = {
    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`,
    'Content-Type': 'application/json',
  };
  const createUserUrl = "http://localhost:3000/api/auth/create-mongo-user";
  const response = await axios.post(createUserUrl, postdata, { headers });
  return response;
};


export default authSlice.reducer;
