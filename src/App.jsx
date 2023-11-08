import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './components/Pages/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import store from './store';
import { initializeAuthUser } from './slices/authSlice';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { themeSettings } from './theme'; // Make sure this import is correct

function App() {
  const mode = useSelector((state) => state.mode.mode);
  console.log(mode);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    store.dispatch(initializeAuthUser());
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Header></Header> */}
        <ToastContainer />
        <Container className='my-2'>
          <Outlet />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
