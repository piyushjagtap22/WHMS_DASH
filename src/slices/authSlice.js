// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getMongoUser } from "./usersApiSlice";
import { Navigate } from "react-router-dom";
import store from "../store";
console.log("here");

const initialState = {
  token: null,
  AuthUser: null,
  MongoUser: null,
};

// console.log(initialState)

const authSlice = createSlice({
  name: "auth",
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
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setAuthUser: (state, action) => {
      state.AuthUser = action.payload;
    },
    setMongoUser: (state, action) => {
      console.log(action.payload + "setMongoUser called");
      state.MongoUser = action.payload;
    },
  },
});

export const {
  setToken,
  logout,
  setUserId,
  setEmailId,
  setAuthUser,
  setMongoUser,
} = authSlice.actions;

// Add an asynchronous action to initialize AuthUser based on Firebase auth state
export const initializeAuthUser = () => async (dispatch) => {
  try {
    await onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("user found in authslice");
        console.log(user.toJSON());
        dispatch(setAuthUser(user.toJSON()));
      } else {
        console.log("user not found in aut slice");
        dispatch(setAuthUser(null));
      }
    });
  } catch (err) {
    console.error(err);
  }
  console.log("in initialize Auth User");
};

// Add an asynchronous action to initialize AuthUser based on Firebase auth state
export const initializeMongoUser = (token) => async (dispatch) => {
  try {

    console.log("in initialize Mongo User");
    console.log(token)
    await getMongoUser(token).then((res) => {
      
      console.log(res.data.InitialUserSchema);
      store.dispatch(setMongoUser(res.data.InitialUserSchema));
    });
  } catch (err) {console.error(err)}
};

export default authSlice.reducer;
