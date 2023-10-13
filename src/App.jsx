import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './components/Pages/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import store from './store';
import { initializeAuthUser } from './slices/authSlice';

function App() {
  useEffect(() => {
    store.dispatch(initializeAuthUser());
  }, []);
  return (
    <>
      <Header></Header>
      <ToastContainer />
      <Container className='my-2'>
        <Outlet></Outlet>
      </Container>
    </>
  );
}

export default App;
