import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#7CD6AB',
      }}
    >
      <CircularProgress color='inherit' />
    </div>
  );
};

export default Loader;
