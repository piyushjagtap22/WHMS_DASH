import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from './Loader';
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeMongoUser } from '../slices/authSlice';
import Register from './Pages/Register';
import EmailRegister from './Pages/EmailRegister';
import UniqueLayout from './Pages/UniqueLayout';
// import TempPage from './Pages/TempPage';
// import TempPage2 from './Pages/TempPage2';
import { TroubleshootOutlined } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import DefaultPage from './Pages/DefaultPage';

const DefaultPageValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  const [isDataPresent, setIsDataPresent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log('use effect DPV');
    console.log(location.state);
    console.log(location.state.rowData);
    if (location.state) {
      console.log('updated to true');
      setIsDataPresent(true);
    }
    if (AuthState === '/dashboard' && isDataPresent) {
      console.log(isDataPresent);
      console.log(location.state);
      return <DefaultPage rowData={location.state} />;
    } else {
      return <Navigate to={AuthState} />;
    }
  }, [location.state]);

  console.log('DefaultPageValidator validator');
  const navigate = useNavigate();
  const AuthUser = useSelector((state) => state.auth.AuthUser);

  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const AuthState = useSelector((state) => state.auth.AuthState);
  const dispatch = useDispatch();
  console.log(AuthState);

  console.log(isDataPresent);
};

DefaultPageValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DefaultPageValidator);
