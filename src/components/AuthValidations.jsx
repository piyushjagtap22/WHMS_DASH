import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import store from '../store';
import { initializeMongoUser } from '../slices/authSlice';
import { useRef } from 'react';
// Custom hook to handle logic dependent on AuthUser
// const useAuthUserLogic = (AuthUser, MongoUser, navigate) => {
//   useEffect(() => {
//     console.log('In AuthUser Logic');
//     console.log(AuthUser);
//     console.log(!AuthUser);

//     if (AuthUser === null) {
//       console.log('Not Auth User');
//       navigate('/register');
//     } else if (AuthUser !== null && AuthUser.email !== null && AuthUser.emailVerified === false) {
//       console.log('Email REGISTER AND verified loop');
//       console.log(AuthUser.email);
//       navigate('/emailregister');
//     } else if (AuthUser !== null && AuthUser.email !== null && AuthUser.emailVerified === true) {
//       console.log(AuthUser.stsTokenManager.accessToken);
//       (async () => {
//         await store.dispatch(initializeMongoUser(AuthUser.stsTokenManager.accessToken));
//       })();

//       // Assuming MongoUser is set after initializing with initializeMongoUser
//       console.log(MongoUser)
//       if (MongoUser && MongoUser.fieldA === true) {
//         navigate('/dashboard');
//       } else {
//         navigate('/verify');
//       }
//     }
//   }, [AuthUser, MongoUser, navigate]);
// };

// ... other imports

const AuthValidations = () => {
  const navigate = useNavigate();
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const MongoUser = useSelector((state) => state.auth.MongoUser);

  // Use a ref to keep track of whether initializeMongoUser has been called
  const initializeMongoUserCalled = useRef(false);

  useEffect(() => {
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
        (async () => {
          await store.dispatch(
            initializeMongoUser(AuthUser.stsTokenManager.accessToken)
          );
          initializeMongoUserCalled.current = true; // Set the ref to true after calling initializeMongoUser
        })();
      }

      // Assuming MongoUser is set after initializing with initializeMongoUser
      // console.log(MongoUser);
      // if (MongoUser && MongoUser.doc_uploaded === true && MongoUser.doc_verified === true) {
      //   console.log("Dashboard jao")
      //   navigate('/dashboard');
      // } else {
      //   console.log("verify jao")
      //   navigate('/verify');
      // }
      else if (MongoUser && MongoUser.roles[0] === 'superadmins') {
        console.log('superadmin jao');
        navigate('/superadmin');
      } else if (
        MongoUser &&
        MongoUser.doc_uploaded === true &&
        MongoUser.doc_verified === true
      ) {
        console.log('Dashboard jao');
        navigate('/dashboard');
      } else {
        console.log('verify jao');
        navigate('/verify');
      }
    }
  }, [AuthUser, MongoUser, navigate]);

  console.log('after AuthUser Logic');

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthValidations;
