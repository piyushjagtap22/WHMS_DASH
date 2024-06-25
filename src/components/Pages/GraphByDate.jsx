import React, { useEffect, useRef } from 'react';
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
    navigate('/Default')
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 20px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    minHeight: '100vh',
    padding: '20px'
  };

  const headerStyle = {
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '600'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#121318',
    backgroundColor: '#7CD6AB', // Grey color
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#696969' // Slightly darker grey color
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
      </header>
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
  );
}

export default GraphByDate;
