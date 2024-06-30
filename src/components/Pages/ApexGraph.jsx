import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexGraph = React.memo((props) => {
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
        show: true,
        tools: {
          download: false
        },
        autoSelected: 'zoom',

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
      enabled: false,
    },
    markers: {
      size: 0,
    },
    // title: {
    //   text: name,
    //   align: 'right',
    // },
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
        formatter: function (val) {
          return val.toFixed(0) + 'M';
        },
        style: {
          colors: 'rgba(255,255,255,0.4)',  // set the x-axis label color to white
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label',
        },
      },
      title: {
        text: 'Value',
      },
      tickAmount: 4,
    },
    xaxis: {
      type: 'category', // Assuming x-axis is categorical based on your labels
      labels: {
        formatter: function (val) {
          const date = new Date(val);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',second: "2-digit"})
        },
        style: {
          colors: 'rgba(255,255,255,0.4)',  // set the x-axis label color to white
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label',
        },
        rotate: 0,
      },
      categories: labels, // Ensure labels array contains timestamp strings
      tickAmount: 10,
      title: {
        text: 'Time',
      },
       // Ensure x-axis labels are horizontal
      
    },
    grid: {
      borderColor: '#FFFFFF44',  // set the grid line color
      strokeDashArray: 0, // set dashed grid lines
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      onDatasetHover: {
        highlightDataSeries: true,
      },
      x: {
        show: true,
        format: 'dd MMM',
      },
      y: {
        title: {
          formatter: (seriesName) => seriesName,
        },
      },},

  };

  return (
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
  );
});

export default ApexGraph;
