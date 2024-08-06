import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const sensorDataMappings = [
  {
    sensor: 'heartSensor',
    name: 'Heart Rate',
    unit: 'bpm',
    ranges: {
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
    sensor: 'BreathRateSensor',
    name: 'Breath Rate',
    unit: 'resp/min',
    ranges: {
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
    sensor: 'VentilatonSensor',
    name: 'Ventilaton',
    unit: 'L/min',
    ranges: {
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
    sensor: 'ActivitySensor',
    name: 'Activity',
    unit: 'g',
    ranges: {
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
    sensor: 'BloodPressureSensor',
    name: 'Blood Pressure',
    unit: 'mmHg',
    ranges: {
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
    sensor: 'CadenceSensor',
    name: 'Cadence',
    unit: 'step/min',
    ranges: {
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
    sensor: 'OxygenSaturationSensor',
    name: 'Oxygen Saturation',
    unit: '%',
    ranges: {
      green: [90, 100],
      yellow: [75, 90],
      orange: [50, 75],
      red: [0, 50],
    },
  },
  {
    sensor: 'TemperatureSensor',
    name: 'Temperature',
    unit: '°C',
    ranges: {
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
    sensor: 'TidalVolumeSensor',
    name: 'Tidal Volume',
    unit: 'L',
    ranges: {
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

const ApexGraph = React.memo((props) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  const getUnitForKey = (key) => {
    const sensorMapping = sensorDataMappings.find(
      (mapping) => mapping.name.toLowerCase() === key.toLowerCase()
    );
    console.log(sensorMapping ? sensorMapping.unit : '');
    return sensorMapping ? sensorMapping.unit : '';
  };

  const labels = props.timestamp;
  const data = props.data;
  const name = props.name;
  if (name == 'Tidal Volume') {
    console.log(data);
  }
  function calculateAverage(lastValues) {
    var sum = lastValues.reduce(function (acc, value) {
      return acc + value;
    }, 0);

    return sum / lastValues.length;
  }

  function getColor(average, ranges) {
    for (const [color, range] of Object.entries(ranges)) {
      if (Array.isArray(range[0])) {
        for (const subRange of range) {
          if (average >= subRange[0] && average <= subRange[1]) {
            return color === 'red'
              ? '#FF5733'
              : color === 'green'
              ? '#7CD6AB'
              : color;
          }
        }
      } else if (average >= range[0] && average <= range[1]) {
        return color === 'red'
          ? '#FF5733'
          : color === 'green'
          ? '#7CD6AB'
          : color;
      }
    }
    return '#FF5733'; // Default color if no range matches
  }
  const average = calculateAverage(data);
  const sensorMapping = sensorDataMappings.find(
    (mapping) => mapping.name === name
  );
  const color = sensorMapping
    ? getColor(average, sensorMapping.ranges)
    : '#FF5733';

  // const isAboveMax = average > max;

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
    colors: [color],
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
          return name === 'Tidal Volume' ? val.toFixed(2) : val.toFixed(0);
        },
        style: {
          colors: 'rgba(255,255,255,0.4)', // set the y-axis label color to white
          fontSize: '16px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-yaxis-label',
        },
      },
      title: {
        text: `${getUnitForKey(name)}`,
      },
      tickAmount: 4,
    },

    xaxis: {
      type: 'category', // Assuming x-axis is categorical based on your labels
      labels: {
        formatter: function (val) {
          const date = new Date(val);
          return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        },
        style: {
          colors: 'rgba(255,255,255,0.4)', // set the x-axis label color to white
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
      borderColor: '#FFFFFF44', // set the grid line color
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
      },
    },
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
        ></span>
        {/* <span style={{ display: 'flex', alignItems: 'center' }}>
          <FiberManualRecordIcon
            style={{
              color: theme.palette.secondary[700],
              marginRight: '0.2rem',
              fontSize: '0.8rem',
            }}
          />
          Current Week
        </span> */}
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
