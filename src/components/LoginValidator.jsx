import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from './Loader';
import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeMongoUser } from '../slices/authSlice';
import { setAuthState } from '../slices/authSlice';
import Register from './Pages/Register';
import EmailRegister from './Pages/EmailRegister';
import UniqueLayout from './Pages/UniqueLayout';
// import TempPage from './Pages/TempPage';
// import TempPage2 from './Pages/TempPage2';
import { TroubleshootOutlined } from '@mui/icons-material';
import LoginScreen from './Pages/LoginScreen';
const LoginValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('Login validator');
  const navigate = useNavigate();
  const AuthUser = useSelector((state) => state.auth.AuthUser);

  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const AuthState = useSelector((state) => state.auth.AuthState);
  const dispatch = useDispatch();
  console.log(AuthState);
  if (AuthState === '/register' || AuthState === '/login') {
    return <LoginScreen />;
  } else {
    return <Navigate to={AuthState} />;
  }
  // }
  // return <Navigate to='/unique' />;
};

LoginValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(LoginValidator);
