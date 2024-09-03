import React from 'react';
import { useState } from 'react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import CustomButton from './Button';
import { useReactToPrint } from 'react-to-print';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import axios from 'axios';
import ApexGraphPrint from '../components/ApexGraphPrint';
import { Toaster, toast } from 'react-hot-toast';
import { Grid, MenuItem, TextField } from '@mui/material';
const url = import.meta.env.VITE_REACT_API_URL;
const sensorDataMappings = [
  {
    sensor: 'heartSensor',
    name: 'Heart Rate',
    data: 'heartRateData',
    unit: 'bpm',
  },
  {
    sensor: 'BreathRateSensor',
    name: 'Breath Rate',
    data: 'BreathRateSensorData',
    unit: 'resp/min',
  },
  {
    sensor: 'VentilatonSensor',
    name: 'Ventilaton',
    data: 'VentilatonSensorData',
    unit: 'L/min',
  },
  {
    sensor: 'ActivitySensor',
    name: 'Activity',
    data: 'ActivitySensorData',
    unit: 'g',
  },
  {
    sensor: 'BloodPressureSensor',
    name: 'Blood Pressure',
    data: 'BPSensorData',
    unit: 'mmHg',
  },
  {
    sensor: 'CadenceSensor',
    name: 'Cadence',
    data: 'CadenceSensorData',
    unit: 'step/min ',
  },
  {
    sensor: 'OxygenSaturationSensor',
    name: 'Oxygen Saturation',
    data: 'OxygenSaturationSensorData',
    unit: '%',
  },
  {
    sensor: 'TemperatureSensor',
    name: 'Temperature',
    data: 'TemperatureSensorData',
    unit: '°C',
  },
  {
    sensor: 'TidalVolumeSensor',
    name: 'Tidal Volume',
    data: 'TidalVolumeSensorData',
    unit: 'L',
  },
];
const HistoryTab = () => {
  const getSensorName = (sensor) => {
    console.log('get Sonsor name running');
    console.log(sensor);
    const sensorMapping = sensorDataMappings.find(
      (mapping) => mapping.sensor === sensor
    );
    return sensorMapping ? sensorMapping.name : 'Please select sensor';
  };
  const componentRef = useRef();
  const [graphByDateData, setGraphByDateData] = useState([]);
  const [graphByDateTimeStamp, setGraphByDateTimeStamp] = useState([]);
  async function getGraphData(iid, startTimeStamp, endTimeStamp) {
    const getGraphUrl = `${url}/api/admin/getGraphData`;
    console.log('id of user', userData?.currentUserId);
    const payload = {
      id: userData?.currentUserId,
      sensorType: sensorType,
      startTimeStamp: startTimeStamp,
      endTimeStamp: endTimeStamp,
    };

    try {
      const response = await axios.post(getGraphUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [startDate, setStartDate] = useState(null); // Use null instead of undefined
  const [endDate, setEndDate] = useState(null); // Use null instead of undefined
  const [sensorType, setSensorType] = useState('');
  const userId = useSelector((state) => state.device.currentUserId);
  const userData = useSelector((state) => state.device.currentDeviceData);
  console.log('received data history tab ', userData);
  const convertDateToUnix = (dateString) => {
    if (dateString) {
      // Create a new Date object from the dateString
      const dateObject = new Date(dateString);

      // Calculate Unix timestamp in milliseconds
      const unixTimestamp = dateObject.getTime();

      return unixTimestamp;
    }
    return null; // Handle case where no date string is provided
  };
  const handleSubmit = async () => {
    try {
      const startUnix = convertDateToUnix(startDate);
      const endUnix = convertDateToUnix(endDate);

      const data = await getGraphData(userId, startUnix, endUnix);
      console.log("shiv" + data);
      if (data && data.length > 0) {
        const values = data.map((item) => item.value);
        const timestamp = data.map((item) => item.timestamp.slice(11, 19));

        setGraphByDateData(values);
        setGraphByDateTimeStamp(timestamp);
      } else {
        toast.error('No data points found');
      }
    } catch (error) {
      toast.error('Error fetching data. Please check dates.');
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
      <form className='dpForm'>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label='Start Date'
            value={startDate}
            onChange={(e) => {
              //console.log(e);
              setStartDate(e);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DateTimePicker
            label='End Date'
            value={endDate}
            onChange={(e) => {
              //console.log(e);
              setEndDate(e);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </LocalizationProvider>
        <TextField
          style={{ width: '125px' }}
          select
          label='Sensor Type'
          value={sensorType}
          onChange={(e) => setSensorType(e.target.value)}
        >
          <MenuItem value='heartSensor'>Heart Rate</MenuItem>
          <MenuItem value='BloodPressureSensor'>Blood Pressure</MenuItem>
          <MenuItem value='VentilatonSensor'>Ventilation</MenuItem>

          <MenuItem value='BreathRateSensor'>Breath Rate</MenuItem>
          <MenuItem value='TidalVolumeSensor'>Tidal Volume</MenuItem>
          <MenuItem value='ActivitySensor'>Activity</MenuItem>
          <MenuItem value='CadenceSensor'>Cadence</MenuItem>

          <MenuItem value='OxygenSaturationSensor'>Oxygen Saturation</MenuItem>
          <MenuItem value='TemperatureSensor'>Temperature</MenuItem>
        </TextField>

        <CustomButton onClick={handleSubmit} variant='contained'>
          Submit
        </CustomButton>
      </form>
      <Grid container>
        <Grid item></Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction='column'
          alignItems='flex-start'
        >
          <div style={{ padding: '20px', width: '100%' }}>
            <ApexGraphPrint
              name={userData?.initialUserData?.name}
              email={userData?.initialUserData?.email}
              phone={userData?.initialUserData?.phone}
              data={graphByDateData}
              timestamp={graphByDateTimeStamp}
              max={90}
              zoomEnabled={true}
              ref={componentRef}
              startDate={startDate}
              endDate={endDate}
              sensorType={getSensorName(sensorType)}
            />
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                justifyContent: 'center',
              }}
            >
              <CustomButton onClick={handlePrint}>Print this out!</CustomButton>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default HistoryTab;
