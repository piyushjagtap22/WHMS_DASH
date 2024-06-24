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
// import TempPage from './Pages/TempPage';
// import TempPage2 from './Pages/TempPage2';
import { TroubleshootOutlined } from '@mui/icons-material';

import Dashboard from './Pages/Dashboard';

import { useLocation } from 'react-router-dom';
import DefaultPage from './Pages/DefaultPage';
const DefaultPageValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('Superadmin validator');
  const navigate = useNavigate();
  const AuthUser = useSelector((state) => state.auth.AuthUser);

  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const AuthState = useSelector((state) => state.auth.AuthState);
  const dispatch = useDispatch();
  console.log(AuthState);
  if (AuthState === '/dashboard') {
    const { state: userData } = useLocation();
    console.log(userData);
    if (userData !== null) {
      return <DefaultPage />;
    } else {
      return <Navigate to={AuthState} />;
    }
  } else {
    return <Navigate to={AuthState} />;
  }
  // }
  // return <Navigate to='/unique' />;
};

DefaultPageValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DefaultPageValidator);
