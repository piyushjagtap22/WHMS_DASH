import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { useSelector } from 'react-redux';
import EmailRegister from '../Pages/EmailRegister';

const EmailRegisterValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('EmailRegister validator');
  const AuthState = useSelector((state) => state.auth.AuthState);
  console.log(AuthState);
  if (AuthState === '/emailregister') {
    return <EmailRegister />;
  } else {
    return <Navigate to={AuthState} />;
  }
};

EmailRegisterValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(EmailRegisterValidator);
