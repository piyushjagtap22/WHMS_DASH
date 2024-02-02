import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMongoUser } from '../slices/usersApiSlice';
import { setMongoUser } from '../slices/authSlice';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from './Loader';
import DocumentVerificationScreen from './Pages/DocumentVerificationScreen';

const VerifyValidator = ({ auth: { AuthState, AuthUser, MongoUser } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Verify validator');
        if (MongoUser === null || MongoUser === undefined) {
          console.log('above');
          const mgu = await getMongoUser(AuthUser.stsTokenManager.accessToken);

          console.log(mgu);
          console.log('below');

          if (mgu.status === 204) {
            const token = AuthUser.stsTokenManager.accessToken;

            const newMgu = await fetch(
              'http://localhost:3000/api/auth/create-mongo-user',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  name: AuthUser.displayName,
                  role: 'admin',
                }),
              }
            );

            if (newMgu.ok) {
              const Muser = await getMongoUser(
                AuthUser.stsTokenManager.accessToken
              );
              console.log(Muser);
              dispatch(setMongoUser(Muser.data.InitialUserSchema));
            } else {
              console.error(`Error: ${newMgu.status} - ${newMgu.statusText}`);
              throw new Error('Failed to create Mongo user');
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [AuthUser, MongoUser, dispatch]);

  if (isLoading) {
    // You can render a loading spinner or any other loading indicator here
    return <Loader />;
  }

  if (AuthState === '/verify') {
    console.log('Here');
    return <DocumentVerificationScreen />;
  } else {
    console.log('else');
    return <Navigate to={AuthState} />;
  }
};

VerifyValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(VerifyValidator);
