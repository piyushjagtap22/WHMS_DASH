import { Grid, useMediaQuery } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import SidebarNew from '../SideBarNew';
import ApexGraphPrint from './ApexGraphPrint';
import Navbar from './Navbar';

const GraphByDate = () => {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { state: userData } = useLocation();
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleGoBack = () => {
    navigate('/Default');
  };

  const containerStyle = {
    backgroundColor: '#121318',
    color: '#FFFFFF',
    minHeight: '100vh',
    padding: '20px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'center',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#121318',
    backgroundColor: '#7CD6AB',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#696969',
  };

  return (
    <>
      <Navbar />
      <Grid container>
        <Grid item>
          <SidebarNew
            user={userData || {}}
            isNonMobile={isNonMobile}
            drawerWidth={280}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </Grid>
        <Grid item xs={12} md={6} container direction="column" alignItems="flex-start">
          <div style={{ padding: '20px', width: '100%' }}>
            <ApexGraphPrint
              name="shivanshu"
              data={data.data1}
              timestamp={data.data2}
              max={90}
              zoomEnabled={true}
              ref={componentRef}
            />
            <div style={buttonContainerStyle}>
              <button
                onClick={handlePrint}
                style={buttonStyle}
                onMouseOver={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
              >
                Print this out!
              </button>
              <button
                onClick={handleGoBack}
                style={buttonStyle}
                onMouseOver={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
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
