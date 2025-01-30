import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
// Define the sensor data mappings outside the component
const sensorRanges = [
  {
    'Heart Rate':
    {
      green: [60, 100],
      yellow: [
        [45, 60],
        [100, 160],
      ],
      orange: [
        [30, 45],
        [160, 220],
      ],
      red: [
        [0, 30],
        [220, Infinity],
      ],
    },
  },
  {
    'Breath Rate': {
      green: [12, 16],
      yellow: [
        [6, 12],
        [16, 60],
      ],
      orange: [
        [3, 6],
        [60, 90],
      ],
      red: [
        [0, 3],
        [90, Infinity],
      ],
    },
  },
  {
    'Ventilaton': {
      green: [5, 8],
      yellow: [
        [4, 5],
        [8, 40],
      ],
      orange: [
        [3, 4],
        [40, 90],
      ],
      red: [
        [0, 3],
        [90, Infinity],
      ],
    },
  },
  {
    'Activity': {
      green: [60, 100],
      yellow: [
        [45, 60],
        [100, 160],
      ],
      orange: [
        [30, 45],
        [160, 220],
      ],
      red: [
        [0, 30],
        [220, Infinity],
      ],
    },
  },
  {
    'Blood Pressure': {
      green: [110, 130],
      yellow: [
        [100, 110],
        [130, 140],
      ],
      orange: [
        [80, 100],
        [140, 180],
      ],
      red: [
        [0, 80],
        [180, Infinity],
      ],
    },
  },
  {
   'Cadence': {
      green: [70, 100],
      yellow: [
        [45, 70],
        [100, 200],
      ],
      orange: [
        [30, 45],
        [200, 240],
      ],
      red: [
        [0, 30],
        [240, Infinity],
      ],
    },
  },
  {
    'Oxygen Saturation': {
      green: [90, 100],
      yellow: [75, 90],
      orange: [50, 75],
      red: [0, 50],
    },
  },
  {
    'Temperature': {
      green: [35, 37],
      yellow: [34, 35],
      orange: [37, 38],
      red: [
        [0, 34],
        [38, Infinity],
      ],
    },
  },
  {
  'Tidal Volume': {
      green: [0.5, 0.7],
      yellow: [
        [0.3, 0.5],
        [0.7, 0.8],
      ],
      orange: [
        [0.1, 0.3],
        [0.8, 0.9],
      ],
      red: [
        [0, 0.1],
        [0.9, Infinity],
      ],
    },
  },
];

const ApexGraph = React.memo(({ timestamp, data, name, unit }) => {
  const theme = useTheme();
 
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  const average = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }, [data]);

  // Determine graph color based on average value
  const getColor = useMemo(() => {
    const ranges = sensorRanges[name];
    if (!ranges) return '#7CD6AB'; // Default green if no ranges defined

    for (const [color, range] of Object.entries(ranges)) {
      if (Array.isArray(range[0])) {
        for (const [min, max] of range) {
          if (average >= min && average <= max) {
            return color === 'red' ? '#FF5733' : 
                   color === 'green' ? '#7CD6AB' : 
                   color === 'yellow' ? '#FFC300' : '#FF851B';
          }
        }
      } else {
        const [min, max] = range;
        if (average >= min && average <= max) {
          return color === 'red' ? '#FF5733' : 
                 color === 'green' ? '#7CD6AB' : 
                 color === 'yellow' ? '#FFC300' : '#FF851B';
        }
      }
    }
    return '#FF5733';
  }, [average, name]);


  const max = 100;

  const isAboveMax = useMemo(() => average > max, [average, max]);


  const chartOptions = useMemo(
    () => ({
      chart: {
        type: 'area',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
          autoSelected: 'zoom',
        },
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 2,
        dashArray: 0,
      },
      colors: [getColor],
      dataLabels: {
        enabled: false,
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
          formatter: function (val) {
            return name === 'Tidal Volume' ? val.toFixed(2) : val.toFixed(0);
          },
          style: {
            colors: 'rgba(255,255,255)',
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
        },
        title: {
          text: unit,
          style: {
            color: '#ffffff',
          },
        },
        tickAmount: 4,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: (val) => {
            const date = new Date(val);
            return date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          },
          style: {
            colors: 'rgba(255,255,255)',
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
          rotate: -90,
          offsetY: 10,
        },
        categories: timestamp,
        tickAmount: 20,
        title: {
          text: 'Time',
          style: {
            color: '#ffffff', // Set the title color to white
            fontSize: '14px',
          },
        },
      },
      grid: {
        borderColor: '#FFFFFF',
        strokeDashArray: 0,
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
        },
      },
    }),
    [getColor, name, unit, timestamp]
  );

  const series = useMemo(() => [{
    name,
    data
  }], [name, data]);

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
        ></span>
      </div>
      <Box height='100%' width='100%'>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type='area'
          height={250}
        />
      </Box>
    </Box>
  );
});

export default ApexGraph;
