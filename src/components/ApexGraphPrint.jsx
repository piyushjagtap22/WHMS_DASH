import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import PrayogikFullLogo from '../assets/PrayogikFullLogo.png';

const ApexGraphPrint = React.forwardRef((props, ref) => {
  const theme = useTheme();

  const calculateAverage = (lastValues) => {
    return (
      lastValues.reduce((acc, value) => acc + value, 0) / lastValues.length
    );
  };
  const sensorDataMappings = [
    {
      sensor: 'heartSensor',
      name: 'Heart Rate',
      unit: 'bpm',
    },
    {
      sensor: 'BreathRateSensor',
      name: 'Breath Rate',
      unit: 'resp/min',
    },
    {
      sensor: 'VentilatonSensor',
      name: 'Ventilaton',
      unit: 'L/min',
    },
    {
      sensor: 'ActivitySensor',
      name: 'Activity',
      unit: 'g',
    },
    {
      sensor: 'BloodPressureSensor',
      name: 'Blood Pressure',
      unit: 'mmHg',
    },
    {
      sensor: 'CadenceSensor',
      name: 'Cadence',
      unit: 'step/min ',
    },
    {
      sensor: 'OxygenSaturationSensor',
      name: 'Oxygen Saturation',
      unit: '%',
    },
    {
      sensor: 'TemperatureSensor',
      name: 'Temperature',
      unit: '°C',
    },
    {
      sensor: 'TidalVolumeSensor',
      name: 'Tidal Volume',
      unit: 'L',
    },
  ];

  const getUnitForKey = (key) => {
    const sensorMapping = sensorDataMappings.find(
      (mapping) => mapping.name.toLowerCase() === key.toLowerCase()
    );
    console.log(sensorMapping ? sensorMapping.unit : '');
    return sensorMapping ? sensorMapping.unit : '';
  };
  function convertUTCToIST(dateString) {
    // Parse the UTC date-time string
    const utcDate = new Date(dateString);

    // IST offset in milliseconds (IST is UTC + 5 hours 30 minutes)
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;

    // Calculate IST time by adding the IST offset to the UTC date
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Extract day, month, year, hours, minutes, and seconds
    const day = String(istDate.getDate()).padStart(2, '0');
    const month = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = istDate.getFullYear();
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const seconds = String(istDate.getSeconds()).padStart(2, '0');

    // Format the date and time as "DD-MM-YYYY HH:MM:SS"
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
  const {
    timestamp: labels,
    data,
    name,
    email,
    phone,
    sensorType,
    zoomEnabled,
    startDate,
    endDate,
  } = props;
  const max = 30;
  const average = useMemo(() => calculateAverage(data.slice(-10)), [data]);
  const isAboveMax = average > max;
  console.log(JSON.stringify(startDate));
  const series = [{ name, data }];
  const options = {
    chart: {
      type: 'area',
      stacked: false,
      zoom: {
        type: 'x',
        enabled: zoomEnabled,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      width: 2,
    },
    colors: [
      isAboveMax ? theme.palette.error.main : theme.palette.success.main,
    ],
    dataLabels: { enabled: false },
    markers: { size: 0 },
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
      labels: { formatter: (val) => `${val.toFixed(0)}` },
      title: { text: getUnitForKey(sensorType) },
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
        rotate: -90,
        offsetY: 10,
      },
      categories: labels,
      tickAmount: 20,
    },
    tooltip: {
      shared: false,
      y: { formatter: (val) => `${val.toFixed(0)}` },
    },
  };

  const containerStyle = {
    backgroundColor: '#fff',
    color: '#333',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '21cm',
    height: '29.7cm',
    margin: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    boxSizing: 'border-box',
  };

  const headerStyle = {
    marginBottom: '20px',
    textAlign: 'center',
    marginTop: '20px',
  };

  const footerStyle = {
    marginTop: '12rem',
    textAlign: 'center',
  };

  const boxStyle = {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '1.55rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const infoStyle = {
    marginBottom: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
  };

  const titleStyle = {
    fontWeight: 'bold',
    color: '#333',
  };

  const separatorStyle = {
    color: '#121212',
  };

  const currentWeekStyle = {
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    flexGrow: 1,
    justifyContent: 'flex-end',
  };

  return (
    <div>
      {data.length !== 0 ? (
        <>
          <div ref={ref} style={containerStyle}>
            <header className='print-header' style={headerStyle}>
              W-HMS Health Report
              <p>Patient Details:</p>
              <p> Name - {name}</p>
              <p>
                Phone: {phone} | Email: {email}
              </p>
            </header>
            <main>
              <Box style={boxStyle}>
                <div style={infoStyle}>
                  <span style={titleStyle}>{sensorType}</span>

                  <span style={separatorStyle}>|</span>
                  <span style={currentWeekStyle}>
                    <FiberManualRecordIcon
                      style={{
                        color: isAboveMax
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                        marginRight: '0.2rem',
                        fontSize: '0.8rem',
                      }}
                    />
                    {startDate !== null &&
                      `Start Date: ${convertUTCToIST(startDate)}`}
                    {endDate !== null &&
                      ` | End Date: ${convertUTCToIST(endDate)} `}
                  </span>
                </div>
                <ReactApexChart options={options} series={series} type='area' />
              </Box>
            </main>
            <footer className='print-footer' style={footerStyle}>
              <h1>Prodyogik Solutions</h1>
              <img src={PrayogikFullLogo} height='80rem' alt='Prayogik Logo' />

              <p>Address Line 1, Address Line 2, City, Country</p>

              <p>Company Name - All Rights Reserved</p>
            </footer>
          </div>
        </>
      ) : (
        <>
          <p style={{ paddingLeft: '15px' }}>
            {startDate === null || endDate === null || sensorType === ''
              ? 'Dates and sensor not selected'
              : ''}
          </p>
        </>
      )}
    </div>
  );
});

export default ApexGraphPrint;
