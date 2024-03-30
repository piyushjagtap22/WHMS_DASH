import React, { useEffect, useState } from 'react';
import FlexBetween from '../FlexBetween';
import Header from '../Header';
import { useLocation } from 'react-router-dom';
import { getSensorDB } from '../../slices/adminApiSlice';
import { Box, useMediaQuery } from '@mui/material';
import Body_Male from '../../assets/Body_Male.png';
import Graph from '../Graph';
import { useDispatch, useSelector } from 'react-redux';
import * as Realm from 'realm-web';
import IconButton from '@mui/material/IconButton';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
const app = new Realm.App({ id: 'application-0-vdlpx' });
const ENDPOINT = 'http://localhost:3000';
var socket;
const DefaultPage = () => {
  const [initialTable, setinitialTable] = useState({});
  const { state: userData } = useLocation();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const dispatch = useDispatch();
  var devices = [];
  const [user, setUser] = useState();
  const [heartRateData, setHeartRateData] = useState([]);
  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);
  const [BreathRateSensorData, setBreathRateSensorData] = useState([]);
  const [BreathRateSensorTimeStamp, setBreathRateSensorTimeStamp] = useState(
    []
  );
  const [VentilatonSensorData, setVentilatonSensorData] = useState([]);
  const [VentilatonSensorTimeStamp, setVentilatonSensorTimeStamp] = useState(
    []
  );
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const login = async () => {
      try {
        const id = userData.data.currentUserId;
        if (setEvents.length <= 1) {
          console.log(id);
          const response = await getSensorDB(token, id);
          if (response.status === 200) {
            setHeartRateData(
              response.data.heartSensor.map((item) => item.value)
            );
            setheartRateTimeStamp(
              response.data.heartSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setBreathRateSensorData(
              response.data.BreathRateSensor.map((item) => item.value)
            );

            setBreathRateSensorTimeStamp(
              response.data.BreathRateSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setVentilatonSensorData(
              response.data.VentilatonSensor.map((item) => item.value)
            );

            setVentilatonSensorTimeStamp(
              response.data.VentilatonSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );
            setEvents(response.data.deviceDocuments);
            setinitialTable(response.data.deviceDocuments);
          }
        }
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);
        const mongodb = app.currentUser.mongoClient('mongodb-atlas');
        const collection = mongodb.db('test').collection('sensordbs');

        const changeStream = collection.watch();
        for await (const change of changeStream) {
          if (userData.data.currentUserId == change?.fullDocument?._id) {
            setHeartRateData(
              change.fullDocument.heartSensor.map((item) => item.value)
            );
            setheartRateTimeStamp(
              change.fullDocument.heartSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setBreathRateSensorData(
              change.fullDocument.BreathRateSensor.map((item) => item.value)
            );

            setBreathRateSensorTimeStamp(
              change.fullDocument.BreathRateSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setVentilatonSensorData(
              change.fullDocument.VentilatonSensor.map((item) => item.value)
            );

            setVentilatonSensorTimeStamp(
              change.fullDocument.VentilatonSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );
          } else {
            console.log('Data is Not Relevant');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    login();
  }, []);

  return (
    <>
      {/* <UniqueLayout data={userData} />x */}
      <Box m='1.5rem 2.5rem'>
        <FlexBetween>
          <Header subtitle='Today' />
        </FlexBetween>

        <Box
          margin='20px'
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
            max={90}
          />

          {/* ROW 2 */}

          <Graph
            name={'BreathRateSensor'}
            data={BreathRateSensorData}
            timestamp={BreathRateSensorTimeStamp}
            max={90}
          />

          {/* ROW 3 */}
          <Graph
            name={'VentilatonSensor'}
            data={VentilatonSensorData}
            timestamp={VentilatonSensorTimeStamp}
            max={90}
          />

          {/* <Graph data={heartRateData}/> */}
          {/* ROW 4 */}
          {isNonMediumScreens && (
            <Box position='relative'>
              <img
                alt='body_male'
                src={Body_Male}
                style={{
                  gridColumn: 'span 1',
                  gridRow: 'span 2',
                  position: 'fixed',
                  top: '5rem',
                  right: 2,
                  height: '90vh',
                  width: '38%',
                  zIndex: 2,
                }}
              />
              <Tooltip
                title={`Heart rate : ${heartRateData[39]}`}
                arrow
                placement='right-end'
                style={{
                  fontSize: '15',
                  position: 'fixed',
                  top: '13rem',
                  right: 240,
                  zIndex: 3,
                }}
              >
                <IconButton>
                  <FavoriteRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
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
