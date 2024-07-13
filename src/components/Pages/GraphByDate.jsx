import { Grid, useMediaQuery } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ApexGraphPrint from './ApexGraphPrint';

const GraphByDate = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleGoBack = () => {
    navigate('/Default');
  };

  return (
    <>
      <Grid container>
        <Grid item></Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction='column'
          alignItems='flex-start'
        >
          <div style={{ padding: '20px', width: '100%' }}>
            <ApexGraphPrint
              name='shivanshu'
              data={data.data1}
              timestamp={data.data2}
              max={90}
              zoomEnabled={true}
              ref={componentRef}
            />
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={handlePrint}
                style={{
                  padding: '10px 20px',
                  fontSize: '1rem',
                  color: '#121318',
                  backgroundColor: '#7CD6AB',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Print this out!
              </button>
              <button
                onClick={handleGoBack}
                style={{
                  padding: '10px 20px',
                  fontSize: '1rem',
                  color: '#121318',
                  backgroundColor: '#7CD6AB',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default GraphByDate;
