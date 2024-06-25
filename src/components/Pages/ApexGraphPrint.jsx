import React from 'react';
import { Box, useTheme, useMediaQuery } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ReactApexChart from 'react-apexcharts';
import PrayogikLogo from "../../assets/PrayogikLogo.png";

const ApexGraphPrint = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  function calculateAverage(lastValues) {
    var sum = lastValues.reduce(function (acc, value) {
      return acc + value;
    }, 0);
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
  const options =  {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: props.zoomEnabled,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    colors: isAboveMax ? ['#FF5733'] : ['#7CD6AB'],
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: name,
      align: 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + 'M';
        },
      },
      title: {
        text: 'Value'
      },
    },
    xaxis: {
      categories: labels,
      tickAmount: 10,
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0) + 'M';
        }
      }
    }
  }

  const containerStyle = {
    backgroundColor: '#fff',
    color: '#333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto'
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
    zIndex: 2,
    height: 'calc(100% - 4rem)' // Adjust height to ensure proper alignment
  };

  const infoStyle = {
    marginBottom: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle = {
    fontWeight: 'bold',
    color: '#333'
  };

  const separatorStyle = {
    color: '#ccc'
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
              margin: 10mm;
            }
            .print-header, .print-footer {
              text-align: center;
            }
            .print-container {
              width: 90%;
              height: auto;
              padding: 10mm;
              box-sizing: border-box;
              background-color: #fff;
              color: #333;
              page-break-after: avoid;
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
      <main className="print-container" style={{ height: '100%' }}>
        <Box style={{ ...boxStyle, height: '20rem' }}>
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
          <Box height="100%">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={250}
            />
          </Box>
        </Box>
      </main>
      <footer className='print-footer' style={footerStyle}>
        <p>Company Name - All Rights Reserved</p>
      </footer>
    </div>
  );
});

export default ApexGraphPrint;
