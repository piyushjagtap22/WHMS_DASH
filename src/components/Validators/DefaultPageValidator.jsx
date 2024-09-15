import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../Loader';
import { useLocation } from 'react-router-dom';
import DefaultPage from '../Pages/DefaultPage';
import Register from '../Pages/Register';

const DefaultPageValidator = () => {
  const [isDataPresent, setIsDataPresent] = useState(false);
  const location = useLocation();
  const AuthState = useSelector((state) => state.auth.AuthState);

  console.log('DefaultPageValidator validator');

  console.log(AuthState);

  console.log(isDataPresent);
  console.log(location.state);
  if (AuthState === '/dashboard' && location?.state) {
    return <DefaultPage rowData={location.state} />;
  } else {
    return <Navigate to={'/register'} />;
  }
};

DefaultPageValidator.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DefaultPageValidator);
