import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { useSelector } from 'react-redux';
import LoginScreen from '../Pages/LoginScreen';
const LoginValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('Login validator');
  const AuthState = useSelector((state) => state.auth.AuthState);
  console.log(AuthState);
  if (AuthState === '/register' || AuthState === '/login') {
    return <LoginScreen />;
  } else {
    return <Navigate to={AuthState} />;
  }
};

LoginValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(LoginValidator);
