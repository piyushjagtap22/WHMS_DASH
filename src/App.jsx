// App.jsx
import React, { useMemo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from './slices/loadingSlice';
import Loader from '../src/components/Loader';
import { initializeAuthUser, initializeMongoUser } from './slices/authSlice';
import store from './store';
import { themeSettings } from './theme';

function App() {
  const mode = useSelector((state) => state.mode.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const loading = useSelector((state) => state.loading.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('22');
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));
        console.log('25');
        await store.dispatch(initializeAuthUser());
        // await store.dispatch(initializeMongoUser());
        console.log('28');
        dispatch(setLoading(false));
        console.log('30');
      } catch (error) {
        console.error('Error initializing app:', error);
        dispatch(setLoading(false));
      }
    };

    initializeApp();
  }, [dispatch]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading ? <Loader /> : <Outlet />}
      </ThemeProvider>
    </>
  );
}

export default App;
