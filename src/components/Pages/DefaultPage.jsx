import React, { useEffect, useState } from 'react';
import FlexBetween from '../FlexBetween';
import Header from '../Header';
import { DownloadOutlined } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  CardMedia,
} from '@mui/material';
import Body_Male from '../../assets/Body_Male.png';
import Graph from '../Graph';
import { getMongoUserByEmail } from '../../slices/usersApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import UniqueLayout from './UniqueLayout';

const ENDPOINT = 'http://localhost:3000';
var socket;
const DefaultPage = () => {
  const theme = useTheme();
  const { state: userData } = useLocation();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const dispatch = useDispatch();
  const [heartRateData, setHeartRateData] = useState([]);
  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);
  const [xSensorData, setxSensorData] = useState([]);
  const [xSensorTimeStamp, setxSensorTimeStamp] = useState([]);
  const [ySensorData, setySensorData] = useState([]);
  const [ySensorTimeStamp, setySensorTimeStamp] = useState([]);
  const MonogoUser = useSelector((state) => state.auth.MongoUser);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    console.log('harsh user data', userData);
    console.log(userData);
    const id = userData?.currentUserId;
    socket = io(ENDPOINT);
    socket.emit('setup', id);
    socket.on('initialData', (data) => {
      console.log('Initial data received:', data);
      if (data && Array.isArray(data.message.heartSensor)) {
        // Extracting only the "value" field from each object in the array
        const heartsensor = data.message.heartSensor.map((item) => item.value);
        const timestamp = data.message.heartSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const xSensor = data.message.xSensor.map((item) => item.value);
        const xtimestamp = data.message.xSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const ySensor = data.message.ySensor.map((item) => item.value);
        const ytimestamp = data.message.ySensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        setHeartRateData(heartsensor);
        setheartRateTimeStamp(timestamp);
        setxSensorData(xSensor);
        setxSensorTimeStamp(xtimestamp);
        setySensorData(ySensor);
        setySensorTimeStamp(ytimestamp);
      } else {
        console.error('Invalid data format from the API');
      }
    });

    socket.on('dataChange', (data) => {
      console.log('Real-time data change detected:', data.data.heartSensor);
      if (data && Array.isArray(data.data.heartSensor)) {
        // Extracting only the "value" field from each object in the array
        const heartsensor = data.data.heartSensor.map((item) => item.value);
        const timestamp = data.data.heartSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const xSensor = data.data.xSensor.map((item) => item.value);
        const xtimestamp = data.data.xSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const ySensor = data.data.ySensor.map((item) => item.value);
        const ytimestamp = data.data.ySensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        setHeartRateData(heartsensor);
        setheartRateTimeStamp(timestamp);
        setxSensorData(xSensor);
        setxSensorTimeStamp(xtimestamp);
        setySensorData(ySensor);
        setySensorTimeStamp(ytimestamp);
      } else {
        console.error('Invalid data format from the API');
      }
      // Update state with the new data
    });
    // Function to fetch heart rate data from the API

    // Call the fetch function
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  // Log the state for debugging
  console.log('heartRateData state:', heartRateData);

  return (
    <>
      <UniqueLayout data={userData} />
      <Box m='1.5rem 2.5rem'>
        <FlexBetween>
          <Header subtitle='Today' />
        </FlexBetween>

        <Box
          mt='20px'
          display='grid'
          gridTemplateColumns='repeat(12, 1fr)'
          gridAutoRows='160px'
          gap='20px'
          zIndex={2}
          sx={{
            '& > div': {
              gridColumn: isNonMediumScreens ? undefined : 'span 12',
            },
          }}
        >
          {/* ROW 1 */}
          <Graph
            name={'HeartRate'}
            data={heartRateData}
            timestamp={heartRateTimeStamp}
          />

          {/* ROW 2 */}

          <Graph
            name={'XSensor'}
            data={xSensorData}
            timestamp={xSensorTimeStamp}
          />

          {/* ROW 3 */}
          <Graph
            name={'YSensor'}
            data={ySensorData}
            timestamp={ySensorTimeStamp}
          />

          {/* <Graph data={heartRateData}/> */}
          {/* ROW 4 */}
          {isNonMediumScreens && (
            <Box
              component='img'
              alt='body_male'
              src={Body_Male}
              gridColumn='span 1'
              gridRow='span 2'
              position='fixed'
              top='5rem'
              right={2}
              height='90vh'
              width='38%'
              zIndex={1}
            />
          )}
        </Box>
        {/* <div>
        {heartRateData.map((item, index) => (
          <div key={index}>Heart Rate: {item}</div>
        ))}
      </div> */}
      </Box>
    </>
  );
};

export default DefaultPage;
