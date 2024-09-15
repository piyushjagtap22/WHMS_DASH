import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMongoUser } from '../../slices/usersApiSlice';
import { setMongoUser } from '../../slices/authSlice';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentVerificationScreen from '../Pages/DocumentVerificationScreen';

const VerifyValidator = ({ auth: { AuthState, AuthUser, MongoUser } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mongoUserSet, setMongoUserSet] = useState(false); // New state to track if setMongoUser has completed
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    console.log({ AuthState, AuthUser, MongoUser });

    const fetchData = async () => {
      try {
        console.log('Verify validator');
        if (!MongoUser && AuthUser != null) {
          const mgu = await getMongoUser(AuthUser.stsTokenManager.accessToken);
          if (mgu.status === 204) {
            const token = AuthUser.stsTokenManager.accessToken;
            const newMgu = await fetch(
              `${API_URL}/api/auth/create-mongo-user`,
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
            console.log(AuthUser != null);
            if (newMgu.ok && AuthUser != null) {
              const Muser = await getMongoUser(
                AuthUser?.stsTokenManager?.accessToken
              );
              dispatch(setMongoUser(Muser.data.InitialUserSchema));
            } else {
              console.error(`Error: ${newMgu.status} - ${newMgu.statusText}`);
              throw new Error('Failed to create Mongo user');
            }
          } else {
            dispatch(setMongoUser(mgu.data.InitialUserSchema));
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

  useEffect(() => {
    if (MongoUser) {
      setMongoUserSet(true);
    }
  }, [MongoUser]);

  if (AuthState === '/verify') {
    return <DocumentVerificationScreen mongoUser={MongoUser} />;
  } else {
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
