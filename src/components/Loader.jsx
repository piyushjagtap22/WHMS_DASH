import React from 'react';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh' /* Set height to 100% of viewport height */,
      }}
    >
      <img
        src='../assets/loader.gif'
        alt='Loading...'
        style={{
          width: '100px' /* Adjust the width as needed */,
          height: '100px',
          scale: '2' /* Adjust the height as needed */,
        }}
      />
    </div>
  );
};

export default Loader;
