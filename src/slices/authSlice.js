// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getMongoUser } from "./usersApiSlice";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createMongoUser } from "./usersApiSlice";
import axios from "axios";
const initialState = {
  token: null,
  AuthUser: null,
  MongoUser: null,
  AuthState: "/register",
};

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
      const payload = action.payload;

      if (payload) {
        const {
          email,
          emailVerified,
          phoneNumber,
          photoURL,
          providerData,
          stsTokenManager,
          uid,
          displayName,
        } = payload;

        state.AuthUser = {
          email: email || null,
          emailVerified: emailVerified || null,
          phoneNumber: phoneNumber || null,
          photoURL: photoURL || null,
          providerData: providerData || null,
          stsTokenManager: {
            accessToken: stsTokenManager?.accessToken || null,
            expirationTime: stsTokenManager?.expirationTime || null,
            refreshToken: stsTokenManager?.refreshToken || null
          },
          uid: uid || null,
          displayName: displayName || null,
        };
      } else {
        // Handle the case where payload is null (e.g., when user is not found)
        state.AuthUser = null;
      }
    },

    setMongoUser: (state, action) => {
      console.log(action.payload + " setMongoUser called");
      state.MongoUser = action.payload;
    },
    setAuthState: (state, action) => {
      state.AuthState = action.payload;
      console.log(action.payload + " setAuthState called");
    }
  },
});

export const {
  setToken,
  logout,
  setUserId,
  setEmailId,
  setAuthUser,
  setMongoUser,
  setAuthState,
} = authSlice.actions;


export const initializeAuthUser = () => async (dispatch) => {
  try {
    console.log("here");
    await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe after the initial check

        try {
          if (user) {
            console.log("user found in authslice");
            console.log(user.toJSON());
            const json = user.toJSON();
            const token = json.stsTokenManager.accessToken;
            dispatch(setAuthUser(json));
            let mgu = await getMongoUser(token);
            console.log(mgu);
            if (mgu.status === 204) {
              const newMgu = await fetch(
                'https://whms-isro-sxur.vercel.app/api/auth/create-mongo-user',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ name: json.displayName, role: 'admin' }),
                }
              );

              // Check if the request was successful (status code in the range 200-299)
              if (newMgu.ok) {
                mgu = await getMongoUser(token);
              } else {
                // Handle the error case
                console.error(`Error: ${newMgu.status} - ${newMgu.statusText}`);
              }

            }
            if (mgu.status === 200) {
              console.log(mgu.data.InitialUserSchema);
              dispatch(setMongoUser(mgu.data.InitialUserSchema));
              if (
                mgu.data.InitialUserSchema &&
                mgu.data.InitialUserSchema.roles[0] === "superadmin"
              ) {
                dispatch(setAuthState("/superadmin"));
              } else if (
                mgu.data.InitialUserSchema &&
                mgu.data.InitialUserSchema.doc_uploaded === true &&
                mgu.data.InitialUserSchema.doc_verified === true
              ) {
                dispatch(setAuthState("/dashboard"));
                console.log("dashboard");
              } else {
                dispatch(setAuthState("/verify"));
                console.log("verify");
              }
            } else if (mgu.status !== 200 && json) {
              if (
                json !== null &&
                json.email !== null &&
                json.emailVerified === false
              ) {
                dispatch(setAuthState("/emailregister"));
                console.log("emailregister");
              } else if (
                json !== null &&
                json.email !== null &&
                json.emailVerified === true
              ) {
                dispatch(setAuthState("/verify"));
                console.log("verify");
              }
            } else {
              console.log("user not found in auth slice");
              dispatch(setAuthUser(null));
              dispatch(setAuthState("/register"));
              console.log("register");
            }
          }
          resolve(); // Resolve the promise once the operation is complete
        } catch (error) {
          reject(error); // Reject the promise if there's an error
        }
      });
    });
  } catch (err) {
    console.error(err);
  }

  console.log("in initialize Auth User");
};



export const initializeMongoUser = (token) => async (dispatch) => {
  try {
    console.log("in initialize Mongo User");
    // console.log(token);

    await new Promise((resolve, reject) => {
      getMongoUser(token)
        .then((res) => {
          console.log(res.data.InitialUserSchema);
          dispatch(setMongoUser(res.data.InitialUserSchema));
          if (MongoUser && MongoUser.roles[0] === 'superadmin') {
            dispatch(setAuthState("/superadmin"));
            console.log("superadmin")
          }
          else if (
            MongoUser &&
            MongoUser.doc_uploaded === true &&
            MongoUser.doc_verified === true
          ) {
            dispatch(setAuthState("/dashboard"));

            console.log("dashboard")
          } else {
            dispatch(setAuthState("/verify"));

            console.log("verify")
          }
          resolve(); // Resolve the promise once the operation is complete
        })
        .catch(reject);
    });
  } catch (err) {
    console.error(err);
  }
};


export default authSlice.reducer;
