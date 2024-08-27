import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { useSelector } from 'react-redux';
import Register from '../Pages/Register';
const RegisterValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('Register validator');
  const AuthState = useSelector((state) => state.auth.AuthState);
  console.log(AuthState);
  if (AuthState === '/register' || AuthState === '/login') {
    return <Register />;
  } else {
    return <Navigate to={AuthState} />;
  }
};

RegisterValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(RegisterValidator);
