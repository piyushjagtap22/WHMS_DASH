import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh' /* Set height to 100% of viewport height */,
        color: '#7CD6AB',
      }}
    >
      {/* <img
        src='/src/assets/loader.gif'
        alt='Loading...'
        style={{
          width: '100px' /* Adjust the width as needed 
          height: '100px',
          scale: '2' /* Adjust the height as needed 
        }}
      /> */}

      <CircularProgress color='inherit' />
    </div>
  );
};

export default Loader;
