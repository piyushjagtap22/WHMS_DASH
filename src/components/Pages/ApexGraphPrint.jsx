import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PrayogikLogo from "../../assets/PrayogikLogo.png";

const ApexGraphPrint = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  function calculateAverage(lastValues) {
    var sum = lastValues.reduce((acc, value) => acc + value, 0);
    return sum / lastValues.length;
  }

  const labels = props.timestamp;
  const data = props.data;
  const name = props.name;
  const max = 30;

  const average = calculateAverage(data.slice(-10));
  const isAboveMax = average > max;

  const series = [{
    name: name,
    data: data
  }];
  const options = {
    chart: {
      type: 'area',
      stacked: false,
      zoom: {
        type: 'x',
        enabled: props.zoomEnabled,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      width: 2,
      dashArray: 0, 
    },
    colors: isAboveMax ? ['#FF5733'] : ['#7CD6AB'],
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: val => `${val.toFixed(0)}M`,
      },
      title: {
        text: 'Value',
      },
      tickAmount: 4,
    },
    xaxis: {
      type: 'category',
      labels: {
        style: {
          colors: 'rgba(0,0,0,0.4)',
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label',
        },
        rotate: 0,
      },
      categories: labels,
      tickAmount: 5,
    },
    tooltip: {
      shared: false,
      y: {
        formatter: val => `${val.toFixed(0)}M`,
      }
    }
  }

  const containerStyle = {
    backgroundColor: '#fff',
    color: '#333',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '21cm', // A4 width
    height: '29.7cm', // A4 height
    margin: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    // overflow: 'hidden', // Ensure content doesn't overflow
    boxSizing: 'border-box' // Include padding in the element's total width and height
  };

  const headerStyle = {
    marginBottom: '20px',
    textAlign: 'center',
    marginTop: '20px'
  };

  const footerStyle = {
    marginTop: '20px',
    textAlign: 'center'
  };

  const boxStyle = {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '1.55rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    // overflow: 'hidden',
    // width: '100%' // Ensure it takes full width of the container
  };

  const infoStyle = {
    marginBottom: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex'
  };

  const titleStyle = {
    fontWeight: 'bold',
    color: '#333'
  };

  const separatorStyle = {
    color: '#121212'
  };

  const currentWeekStyle = {
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    flexGrow: 1,
    justifyContent: 'flex-end'
  };

  return (
    <div ref={ref} style={containerStyle}>
      <style>
        {`
          @media print {
            @page {
              size: A4;
            }
            .print-header, .print-footer {
              text-align: center;
            }
          
          }
        `}
      </style>
      <header className='print-header' style={headerStyle}>
        <img src={PrayogikLogo} height="80rem" alt="Prayogik Logo" />
        <h1>Prodyogik Solutions</h1>
        <p>Address Line 1, Address Line 2, City, Country</p>
        <p>Phone: 9406928294 | Email: harshyadav@gmail.com</p>
        Name - {name}
      </header>
      <main className="" >
        <Box style={boxStyle}>
          <div style={infoStyle}>
            <span style={titleStyle}>{name}</span>
            <span style={separatorStyle}>|</span>
            <span style={currentWeekStyle}>
              <FiberManualRecordIcon
                style={{
                  color: isAboveMax ? '#FF5733' : '#7CD6AB',
                  marginRight: "0.2rem",
                  fontSize: "0.8rem",
                }}
              />
              Current Week
            </span>
          </div>
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              // height="100%"
              // width="100%"
            />
        </Box>
      </main>
      <footer className='print-footer' style={footerStyle}>
        <p>Company Name - All Rights Reserved</p>
      </footer>
    </div>
  );
});

export default ApexGraphPrint;
