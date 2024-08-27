import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

  const AuthState = useSelector((state) => state.auth.AuthState);
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
