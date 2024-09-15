import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { useSelector } from 'react-redux';
import SAdminScreen from '../Pages/SAdminScreen.jsx';
const DashboardValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('Superadmin validator');
  const AuthState = useSelector((state) => state.auth.AuthState);
  console.log(AuthState);
  if (AuthState === '/superadmin') {
    console.log('here');
    return <SAdminScreen />;
  } else {
    return <Navigate to={AuthState} />;
  }
};

DashboardValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DashboardValidator);
