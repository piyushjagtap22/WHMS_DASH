import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';

// Define the sensor data mappings outside the component
const sensorDataMappings = [
  { sensor: 'heartSensor', name: 'Heart Rate', unit: 'bpm' },
  { sensor: 'BreathRateSensor', name: 'Breath Rate', unit: 'resp/min' },
  { sensor: 'VentilatonSensor', name: 'Ventilaton', unit: 'L/min' },
  { sensor: 'ActivitySensor', name: 'Activity', unit: 'g' },
  { sensor: 'BloodPressureSensor', name: 'Blood Pressure', unit: 'mmHg' },
  { sensor: 'CadenceSensor', name: 'Cadence', unit: 'step/min ' },
  { sensor: 'OxygenSaturationSensor', name: 'Oxygen Saturation', unit: '%' },
  { sensor: 'TemperatureSensor', name: 'Temperature', unit: '°C' },
  { sensor: 'TidalVolumeSensor', name: 'Tidal Volume', unit: 'L' },
];

const ApexGraph = React.memo((props) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  const calculateAverage = useCallback((lastValues) => {
    console.log('calculate average running');
    const sum = lastValues.reduce((acc, value) => acc + value, 0);
    return sum / lastValues.length;
  }, []);

  const zoomEnabled = false;

  const { timestamp: labels, data, name, unit } = props;
  console.log('Apex graph Untis', unit);
  const max = 100;
  const average = useMemo(
    () => calculateAverage(data),
    [data, calculateAverage]
  );
  const isAboveMax = useMemo(() => average > max, [average, max]);

  const series = useMemo(() => [{ name, data, unit }], [data, name, unit]);

  const options = useMemo(
    () => ({
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: zoomEnabled,
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
      colors: isAboveMax ? ['#FF5733'] : ['#7CD6AB'],
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
          formatter: (val) => val.toFixed(0),
          style: {
            colors: 'rgba(255,255,255,0.4)',
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
        },
        title: {
          text: { unit },
        },
        tickAmount: 4,
      },
      xaxis: {
        type: 'category',
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
            colors: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
          rotate: 0,
        },
        categories: labels,
        tickAmount: 10,
        title: {
          text: 'Time',
        },
      },
      grid: {
        borderColor: '#FFFFFF44',
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
    [name, labels, isAboveMax, unit]
  );

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
