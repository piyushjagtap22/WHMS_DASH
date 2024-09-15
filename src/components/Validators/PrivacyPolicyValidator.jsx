import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PrivacyAndSecurityPage from '../Pages/PrivacyAndSecurityPage';
const PrivacyPolicyValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('DashBoard validator');

  const AuthState = useSelector((state) => state.auth.AuthState);
  console.log(AuthState);
  if (AuthState === '/dashboard') {
    console.log('here');
    return <PrivacyAndSecurityPage />;
  } else {
    return <Navigate to={AuthState} />;
  }
  // }
  // return <Navigate to='/unique' />;
};

PrivacyPolicyValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivacyPolicyValidator);
