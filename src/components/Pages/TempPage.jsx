import React, { useEffect } from 'react';

const TempPage = () => {
  useEffect(() => {
    console.log('Temp page 1 Mounted');
  }, []);
  console.log('Temp page 1 before ');
  return <div>In Temp Page 1</div>;
};

export default TempPage;
