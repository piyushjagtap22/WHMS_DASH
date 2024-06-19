import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ReactApexChart from 'react-apexcharts';

const ApexGraphPrint = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  function calculateAverage(lastValues) {
    var sum = lastValues.reduce(function (acc, value) {
      return acc + value;
    }, 0);

    return sum / lastValues.length;
  }

  // Dummy data
  const labels = props.timestamp;
  console.log('apex', props.data.slice(90, 101));
  console.log('apex2', labels);
  console.log(props.zoomEnabled);
  const data = props.data;
  const name = props.name;
  const max = 30;

  const average = calculateAverage(data.slice(-10));
  const isAboveMax = average > max;

  const series = [
    {
      name: name,
      data: data,
    },
  ];
  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: props.zoomEnabled,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    colors: isAboveMax ? ['#FF5733'] : ['#7CD6AB'],
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: name,
      align: 'left',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + 'M';
        },
      },
      title: {
        text: 'Value',
      },
      // tickAmount: 4,
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
        },
      },
    },
  };

  return (
    <div ref={ref} className='print-container'>
      <header className='print-header'>
        <h1>Prodyogik Solutions</h1>
        <p>Address Line 1, Address Line 2, City, Country</p>
        <p>Phone: 9406928294 | Email: harshyadav@gmail.com</p>
        Name - {name}
      </header>
      <main className='print-content'>
        <Box
          gridColumn='span 7'
          gridRow='span 2'
          height='20rem'
          backgroundColor={theme.palette.secondary[300]}
          p='1.5rem'
          borderRadius='1.55rem'
          zIndex={2}
        >
          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <span
              style={{
                fontWeight: 'bold',
                marginRight: '1.5rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {name}
            </span>
            <span
              style={{
                marginLeft: '5rem',
                marginRight: '1rem',
                color: theme.palette.primary[100],
              }}
            >
              |
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FiberManualRecordIcon
                style={{
                  color: theme.palette.secondary[700],
                  marginRight: '0.2rem',
                  fontSize: '0.8rem',
                }}
              />
              Current Week
            </span>
          </div>
          <Box height='100%' width='100%'>
            <ReactApexChart
              options={options}
              series={series}
              type='area'
              height={250}
            />
          </Box>
        </Box>
      </main>
      <footer className='print-footer'>
        <p>Company Name - All Rights Reserved</p>
      </footer>
    </div>
  );
});

export default ApexGraphPrint;
