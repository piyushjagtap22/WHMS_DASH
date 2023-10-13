import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { InvalidTokenError } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setAuthUser } from '../slices/authSlice';
import Loader from './Loader';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setAuthUser(user.toJSON()));
      } else {
        dispatch(setAuthUser(null));
      }
      setInitializing(false); // Authentication state initialization is complete
    });

    return () => {
      listen();
    };
  }, []);

  const AuthUser = useSelector((state) => state.auth.AuthUser);

  if (initializing) {
    // Display a loading indicator while initializing
    return <></>;
  }

  // After initialization, check the value of AuthUser
  return AuthUser ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
