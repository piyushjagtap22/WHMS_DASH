import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dashboard from '../Pages/Dashboard';
const DashboardValidator = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  console.log('DashBoard validator');

  const AuthState = useSelector((state) => state.auth.AuthState);
  console.log(AuthState);
  if (AuthState === '/dashboard') {
    console.log('here');
    return <Dashboard />;
  } else {
    return <Navigate to={AuthState} />;
  }
  // }
  // return <Navigate to='/unique' />;
};

DashboardValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DashboardValidator);
