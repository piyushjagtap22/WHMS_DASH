// AppInitializer.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuthUser, initializeMongoUser } from '../slices/authSlice';
import { setLoading } from '../slices/loadingSlice';
import store from '../store';

const AppInitializer = () => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));
        await store.dispatch(initializeAuthUser());
        // await store.dispatch(initializeMongoUser());
        dispatch(setLoading(false));
        await setInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        dispatch(setLoading(false));
      }
    };

    initializeApp();
  }, [dispatch]);

  if (!initialized) {
    return null;
  }

  return <></>; // Or any content you want to render after initialization
};

export default AppInitializer;
