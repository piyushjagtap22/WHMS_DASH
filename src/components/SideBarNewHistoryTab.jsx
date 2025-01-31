import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
function formatTimeString(timeString) {
  const date = new Date(timeString.trim());

  // Get current date for comparison
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  // Format time
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

  // Format time string
  const timeFormatted = `${hours}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm} IST`;

  // Format date string
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const dateFormatted = isToday
    ? 'Today'
    : date.toLocaleDateString('en-US', options);

  return `${timeFormatted}, ${dateFormatted}`;
}
const drawerWidth = 280;
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
const useStyles = makeStyles(() => ({
  sidebar: {
    width: drawerWidth,
    marginBottom: '16px',  // theme.spacing(2)
    backgroundColor: '#191C23',
    color: '#FFFFFF',
    padding: 0,  // theme.spacing(0)
    margin: '24px 0 0 24px',
    borderRadius: '16px',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  avatar: {
    width: '80px',
    height: '80px',
    margin: '24px 16px',  // theme.spacing(3, 2)
  },
  tab: {
    minWidth: '50%',
    textTransform: 'capitalize',
  },
  section: {
    margin: '24px 80px 0 24px',  // theme.spacing(3, 10, 0, 3)
  },
  title: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '1.6px',  // theme.spacing(0.2)
    color: '#75777B',
  },
  value: {
    fontSize: '14px',
    marginBottom: '4px',  // theme.spacing(0.5)
    color: '#FFFFFF',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',  // theme.spacing(2)
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  greenText: {
    color: '#7CD6AB',
  },
  divider: {
    backgroundColor: '#47494F',
    margin: 0,
    padding: 0,
  },
}));

const SideBarNewHistoryTab = () => {
  const data2 = useSelector((state) => state.device.sensorData);
  const [sensorData, setSensorData] = useState({
    heartSensor: '',
    BreathRateSensor: '',
    VentilatonSensor: '',
    TidalVolumeSensor: '',
    ActivitySensor: '',
    CadenceSensor: '',
    TemperatureSensor: '',
    OxygenSaturationSensor: '',
    BloodPressureSensor: '',
  });
  useEffect(() => {
    console.log('data2 :', data2);
    if (data2) {
      console.log('Sensor data received:', data2.sensorData);

      const heartSensor =
        data2?.heartRateObj?.[data2.heartRateObj.length - 1]?.value ?? '-';
      const BreathRateSensor =
        data2?.breathRateObj?.[data2.breathRateObj.length - 1]?.value ?? '-';
      const VentilatonSensor =
        data2?.ventilationObj?.[data2.ventilationObj.length - 1]?.value ?? '-';
      const TidalVolumeSensor =
        data2?.tidalVolObj?.[data2.tidalVolObj.length - 1]?.value ?? '-';
      const ActivitySensor =
        data2?.activityObj?.[data2.activityObj.length - 1]?.value ?? '-';
      const CadenceSensor =
        data2?.candenceObj?.[data2.candenceObj.length - 1]?.value ?? '-';
      const TemperatureSensor =
        data2?.tempObj?.[data2.tempObj.length - 1]?.value ?? '-';
      const OxygenSaturationSensor =
        data2?.oxygenSaturationObj?.[data2.oxygenSaturationObj.length - 1]
          ?.value ?? '-';
      const BloodPressureSensor =
        data2?.bpObj?.[data2.bpObj.length - 1]?.value ?? '-';

      // Update state with the sensor data
      setSensorData({
        heartSensor,
        BreathRateSensor,
        VentilatonSensor,
        TidalVolumeSensor,
        ActivitySensor,
        CadenceSensor,
        TemperatureSensor,
        OxygenSaturationSensor,
        BloodPressureSensor,
      });
    } else {
      console.log('No data');
      dispatch(setAuthState('/dashboard'));
      navigate('/dashboard');
    }
  }, [data2]);
  const classes = useStyles();
  const getUnitForKey = (key) => {
    const sensorMapping = sensorDataMappings.find(
      (mapping) => mapping.sensor === key
    );
    return sensorMapping ? sensorMapping.unit : '';
  };
  const timestamp =
    data2?.oxygenSaturationObj?.[data2.oxygenSaturationObj.length - 1]
      ?.timestamp ?? '';
  const getSensorName = (sensor) => {
    const sensorMapping = sensorDataMappings.find(
      (mapping) => mapping.sensor === sensor
    );
    return sensorMapping ? sensorMapping.name : 'Please select sensor';
  };
  return (
    <>
      {Object.keys(sensorData).map((key, index) => (
        <React.Fragment key={index}>
          <Box sx={{}} key={index}>
            {/* {sensorData[key] ? ( */}
            <Paper
              sx={{
                p: 2,
                color: '#fff',
                background: '#191C23',
              }}
            >
              <Typography
                sx={{
                  marginBottom: '2px',
                  fontSize: '0.9rem',
                  letterSpacing: '0.4px',
                  fontWeight: 'bold',
                }}
              >
                {getSensorName(key)}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: '#888888',
                  marginBottom: '0px',
                }}
              >
                {formatTimeString(timestamp)}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: '#888888',
                  marginBottom: '12px',
                }}
              >
                {/* {sensorData[key]} */}
              </Typography>
              <Grid container alignItems='center' spacing={1}>
                <Grid item>
                  <FavoriteIcon
                    style={{ color: '#7CD6AB', fontSize: '1rem' }}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: '0.9rem',
                      color: '#fff',
                    }}
                  >
                    {sensorData[key] == '' ? 'NaN' : sensorData[key]}{' '}
                    {getUnitForKey(key)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            {/* ) : (
                <h1>No data for {key}</h1>
              )} */}
          </Box>
          <Divider className={classes.divider}></Divider>
        </React.Fragment>
      ))}
    </>
  );
};

export default SideBarNewHistoryTab;
