import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('accessToken')
    ? localStorage.getItem('accessToken')
    : null,
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
      console.log(action.payload['accessToken'])
      state.token = action.payload['accessToken']
      // console.log(action.payload['refreshToken'])
      // state.refreshToken = action.payload['refreshToken']
      localStorage.setItem('accessToken', action.payload['accessToken']);
      // localStorage.setItem('refreshToken', action.payload['refreshToken']);
    },
    logout: (state, action) => {
      state.token = null;
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    setUserInfo: (state, action) => {
      console.log(action.payload.user)
      state.userInfo = action.payload.user;
    }
  },
});

export const { setToken, logout, setUserId, setEmailId, setUserInfo } = authSlice.actions;

export default authSlice.reducer;