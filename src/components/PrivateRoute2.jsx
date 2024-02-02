import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from './Loader';
import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeMongoUser } from '../slices/authSlice';
import Register from './Pages/Register';
import EmailRegister from './Pages/EmailRegister';
import UniqueLayout from './Pages/UniqueLayout';
import TempPage from './Pages/TempPage';
import TempPage2 from './Pages/TempPage2';
import { TroubleshootOutlined } from '@mui/icons-material';
const PrivateRoute2 = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  // if (loading) return <Loader />;
  // if (isAuthenticated) return <Component />;

  const navigate = useNavigate();
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const dispatch = useDispatch();
  var page = '';
  // useEffect(() => {
  //   const handleAuthLogic = async () => {
  //     console.log('before AuthUser Logic');
  //     console.log(AuthUser);
  //     console.log('before AuthUser Logic');

  //     if (AuthUser === null) {
  //       console.log('Not Auth User');
  //       // console.log(<Component />);
  //       page = 'temppage';
  //       // return navigate('/temppage');
  //     } else {
  //       page = 'temppage2';
  //       // return navigate('/temppage2');
  //     }

  //   else if (
  //     AuthUser !== null &&
  //     AuthUser.email !== null &&
  //     AuthUser.emailVerified === false
  //   ) {
  //     console.log('Email REGISTER AND verified loop');
  //     // console.log(AuthUser.email);
  //     return <EmailRegister />;
  //   } else if (
  //     AuthUser !== null &&
  //     AuthUser.email !== null &&
  //     AuthUser.emailVerified === true
  //   ) {
  //     console.log(AuthUser.stsTokenManager.accessToken);
  //     if (!initializeMongoUserCalled.current) {
  //       try {
  //         console.log('in try block');
  //         const res = await dispatch(
  //           initializeMongoUser(AuthUser.stsTokenManager.accessToken)
  //         );
  //         console.log('res: ', res);
  //         initializeMongoUserCalled.current = true;
  //       } catch (error) {
  //         console.error('Error in initializeMongoUser:', error);
  //         // Handle the error as needed
  //       }
  //     }

  //     // Assuming MongoUser is set after initializing with initializeMongoUser
  //     if (MongoUser && MongoUser.roles[0] === 'superadmin') {
  //       console.log('superadmin jao');
  //       navigate('/superadmin');
  //     } else if (
  //       MongoUser &&
  //       MongoUser.doc_uploaded === true &&
  //       MongoUser.doc_verified === true
  //     ) {
  //       console.log('Dashboard jao');
  //       navigate('/temppage');
  //     } else {
  //       console.log('verify jao');
  //       navigate('/verify');
  //     }
  //   }
  //   console.log('after AuthUser Logic');
  //   };

  //   // Call the function to handle authentication logic
  //   handleAuthLogic();
  // }, [AuthUser, MongoUser, navigate, dispatch]);

  // if (AuthUser === null) {
  //   console.log('Not Auth User');
  //   // console.log(<Component />);
  if (!true) {
    console.log('pr2 = if');
    return <TempPage />;
  } else {
    console.log('pr2 = else');
    return <Navigate to='/temppage2' />;
  }
  // }
  return <Navigate to='/unique' />;
};

PrivateRoute2.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute2);
