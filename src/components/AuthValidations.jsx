import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeMongoUser } from '../slices/authSlice';

const AuthValidations = () => {
  console.log('in auth validations');
  const navigate = useNavigate();
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const dispatch = useDispatch();

  // Use a ref to keep track of whether initializeMongoUser has been called
  const initializeMongoUserCalled = useRef(false);

  useEffect(() => {
    const handleAuthLogic = async () => {
      console.log('before AuthUser Logic');
      console.log(AuthUser);
      console.log('before AuthUser Logic');

      if (AuthUser === null) {
        console.log('Not Auth User');
        navigate('/register');
      } else if (
        AuthUser !== null &&
        AuthUser.email !== null &&
        AuthUser.emailVerified === false
      ) {
        console.log('Email REGISTER AND verified loop');
        console.log(AuthUser.email);
        navigate('/emailregister');
      } else if (
        AuthUser !== null &&
        AuthUser.email !== null &&
        AuthUser.emailVerified === true
      ) {
        console.log(AuthUser.stsTokenManager.accessToken);
        if (!initializeMongoUserCalled.current) {
          try {
            console.log('in try block');
            const res = await dispatch(
              initializeMongoUser(AuthUser.stsTokenManager.accessToken)
            );
            console.log('res: ', res);
            initializeMongoUserCalled.current = true;
          } catch (error) {
            console.error('Error in initializeMongoUser:', error);
            // Handle the error as needed
          }
        }

        // Assuming MongoUser is set after initializing with initializeMongoUser
        if (MongoUser && MongoUser.roles[0] === 'superadmin') {
          console.log('superadmin jao');
          navigate('/superadmin');
        } else if (
          MongoUser &&
          MongoUser.doc_uploaded === true &&
          MongoUser.doc_verified === true
        ) {
          console.log('Dashboard jao');
          navigate('/temppage');
        } else {
          console.log('verify jao');
          navigate('/verify');
        }
      }
      console.log('after AuthUser Logic');
    };

    // Call the function to handle authentication logic
    handleAuthLogic();
  }, [AuthUser, MongoUser, navigate, dispatch]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthValidations;
