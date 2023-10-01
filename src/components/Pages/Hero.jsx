import { Button, Card, Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, getProfileData } from '../../slices/profileApiSlice';
import { setUserInfo } from '../../slices/authSlice';
import { setProfileInfo } from '../../slices/profileSlice';

const Hero = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async function () {
      const token = localStorage.getItem('accessToken');
      await getUserData(token).then((res) => {
        dispatch(setUserInfo({ ...res.data }));
      });

      await getProfileData(token)
        .then((res) => {
          console.log(res);
          dispatch(setProfileInfo({ ...res.data }));
        })
        .catch((error) => {
          // Handle errors here
          console.error('Error fetching profile data:', error);
        });
    })();
  }, []);

  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center w-100'>
        <Card className='border-0 shadow-sm p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>MERN Authentication</h1>
          <p className='text-center mb-4'>
            This is a boilerplate for MERN authentication that stores a JWT in
            an HTTP-Only cookie. It also uses Redux Toolkit and the React
            Bootstrap library
          </p>
          <div className='d-flex'>
            <Button variant='primary' href='/login' className='me-3'>
              Sign In
            </Button>
            <Button variant='secondary' href='/register'>
              Register
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
