import React, { useEffect, useRef, useState } from 'react';

import FlexBetween from '../FlexBetween';

import { useLocation, useNavigate } from 'react-router-dom';

import { getDeviceIds, getLoc, getSensorDB } from '../../slices/adminApiSlice';

import { Box, MenuItem, TextField, useMediaQuery } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import * as Realm from 'realm-web';

import IconButton from '@mui/material/IconButton';

import PowerIcon from '@mui/icons-material/Power';

import Tooltip from '@mui/material/Tooltip';

import { useTheme } from '@emotion/react';
import { Button } from 'react-bootstrap';
import BodyFigure from '../BodyFigure';
import ApexGraph from './ApexGraph';

const app = new Realm.App({ id: 'application-0-vdlpx' });

const ENDPOINT = 'http://localhost:3000';

var socket;

const DefaultPage = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);

  const [latitude, setLatitude] = useState(23); // Initial latitude

  const [longitude, setLongitude] = useState(77); // Initial longitude

  const [connectionStatus, setConnectionStatus] = useState(false);

  const [startDate, setStartDate] = useState();

  const [endDate, setEndDate] = useState();

  const [sensorType, setSensorType] = useState('');

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());

      if (heartRateTimeStamp.length > 0) {
        const latestTimestamp =
          heartRateTimeStamp[heartRateTimeStamp.length - 1];
        const latestTime = new Date(latestTimestamp);
        const currentTime = new Date();

        const timeDifference = (currentTime - latestTime) / 1000; // Difference in seconds
        console.log(currentTime);
        console.log(latestTime);
        console.log(timeDifference);

        setConnectionStatus(timeDifference <= 5);
      } else {
        setConnectionStatus(false); // No timestamp available, set connectionStatus to false
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [heartRateTimeStamp]);

  const mapContainerRef = useRef(null);

  const [initialTable, setinitialTable] = useState({});

  const { state: userData } = useLocation();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  const dispatch = useDispatch();

  var devices = [];

  const [user, setUser] = useState();

  const [heartRateData, setHeartRateData] = useState([]);

  const [BreathRateSensorData, setBreathRateSensorData] = useState([]);

  const [BreathRateSensorTimeStamp, setBreathRateSensorTimeStamp] = useState(
    []
  );

  const [VentilatonSensorData, setVentilatonSensorData] = useState([]);

  const [GraphDataByDate, setGraphDataByDate] = useState([]);

  const [GraphDataByDateTimestamp, setGraphDataByDateTimestamp] = useState([]);

  const [VentilatonSensorTimeStamp, setVentilatonSensorTimeStamp] = useState(
    []
  );

  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );

  const [events, setEvents] = useState([]);

  async function getGraphData() {
    const url = 'http://localhost:3000/api/admin/getGraphData';

    const body = JSON.stringify({
      id: '31vBWopGfQfudlsSHkKS0Prgkg42',

      sensorType: sensorType,

      startTimeStamp: convertDateToUnix(startDate),

      endTimeStamp: convertDateToUnix(endDate),
    });

    console.log(
      'dates',
      convertDateToUnix(startDate) + '  ' + convertDateToUnix(endDate)
    );

    try {
      const response = await fetch(url, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: body,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching data:', error);

      throw error;
    }
  }

  const handleSubmit = () => {
    console.log('startdate', startDate);
    console.log('enddate', endDate);
    console.log('sendor', sensorType);

    console.log('startdate', convertDateToUnix(startDate));

    getGraphData()
      .then((data) => {
        if (data && data.length > 0) {
          // Extracting values from data
          const values = data.map((item) => item.value);

          const timestamp = data.map((item) => item.timestamp.slice(11, 19));
          navigate(`/GraphByDate`, {
            state: {
              data1: values,
              data2: timestamp,
              startDate: startDate,
              endDate: endDate,
              sensorType: sensorType,
            },
          });

          setGraphDataByDate(values);

          setGraphDataByDateTimestamp(timestamp);

          console.log('shiv', GraphDataByDate);

          console.log('shiv', GraphDataByDateTimestamp);
        } else {
          window.confirm('invalid dates');
          console.log('Invalid dates');
        }
      })

      .catch((error) => {
        // Handle errors here
      });
  };

  useEffect(() => {
    const devicesdb = async () => {
      try {
        console.log('user data yaha hai', userData);
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          // console.log(id);

          const response = await getDeviceIds(token, id);

          console.log('req made ');

          if (response.status === 200) {
            // console.log('in 200');

            // console.log(response.data.deviceDocuments);

            for (var r in response.data.deviceDocuments) {
              if (
                response.data.deviceDocuments[r].currentUserId ==
                userData.data.currentUserId
              )
                // console.log(response.data.deviceDocuments[r].location[0].lat);

                // console.log(response.data.deviceDocuments[r].location[0].lon);

                setLatitude(response.data.deviceDocuments[r].location[0].lat);

              setLongitude(response.data.deviceDocuments[r].location[0].lon);
            }
          }
        }

        const user2 = await app.logIn(Realm.Credentials.anonymous());

        setUser(user2);

        const mongodb2 = app.currentUser.mongoClient('mongodb-atlas');

        const collection2 = mongodb2.db('test').collection('devices');

        // console.log('device db watch stream');

        const changeStream2 = collection2.watch();

        for await (const change of changeStream2) {
          // console.log('device db watch stream changes');

          if (
            userData.data.currentUserId == change?.fullDocument?.currentUserId
          ) {
            // console.log('Here in device changes');

            // console.log(change.fullDocument.location[0].lat);

            // console.log(

            //   change.fullDocument.location[0].lat,

            //   change.fullDocument.location[0].lon

            // );

            const lat = change.fullDocument.location[0].lat;

            const lon = change.fullDocument.location[0].lon;

            setLatitude(lat);

            setLongitude(lon);
          } else {
            console.log('Data is Not Relevant');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // getGraphData()

    // .then(data => {

    //   if (data && data.length > 0) {

    //     // Extracting values from data

    //     const values = data.map(item => item.value);

    //     const timestamp = data.map(item => item.timestamp.slice(11, 19));

    //     // Assuming setGraphDataByDate is a function to set state in React

    //     setGraphDataByDate(values);

    //     setGraphDataByDateTimestamp(timestamp);

    //     console.log("shiv", GraphDataByDate);

    //     console.log("shiv", GraphDataByDateTimestamp);

    //   }

    //   })

    // .catch(error => {

    //     // Handle errors here

    // });

    devicesdb();

    // console.log('mapbox setting up');

    // Load Mapbox script dynamically

    const mapboxScript = document.createElement('script');

    mapboxScript.src =
      'https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js';

    mapboxScript.onload = initializeMap;

    document.body.appendChild(mapboxScript);

    // Load Mapbox stylesheet

    const mapboxLink = document.createElement('link');

    mapboxLink.href =
      'https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css';

    mapboxLink.rel = 'stylesheet';

    document.head.appendChild(mapboxLink);

    function initializeMap() {
      if (mapContainerRef.current) {
        mapboxgl.accessToken =
          'pk.eyJ1IjoicGl5dXNoMjIiLCJhIjoiY2x1ZWM2cWtlMXFhZjJrcW40OHA0a2h0eiJ9.GtGi0PHDryu8IT04ueU7Pw';

        const map = new mapboxgl.Map({
          container: 'map',

          // Choose from Mapbox's core styles, or make your own style with Mapbox Studio

          style: 'mapbox://styles/mapbox/streets-v12',

          zoom: 14.0,
        });

        map.on('load', async () => {
          // Get the initial location of the International Space Station (ISS).

          const geojson = await getLocation();

          // Add the ISS location as a source.

          map.addSource('iss', {
            type: 'geojson',

            data: geojson,
          });

          // Add the rocket symbol layer to the map.

          map.addLayer({
            id: 'iss',

            type: 'symbol',

            source: 'iss',

            layout: {
              // This icon is a part of the Mapbox Streets style.

              // To view all images available in a Mapbox style, open

              // the style in Mapbox Studio and click the "Images" tab.

              // To add a new image to the style at runtime see

              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/

              'icon-image': 'rocket',
            },
          });

          // Update the source from the API every 2 seconds.

          const updateSource = setInterval(async () => {
            // const geojson = await getLocation(updateSource);

            map.getSource('iss').setData(geojson);
          }, 5000);

          async function getLocation(updateSource) {
            // Make a GET request to the API and return the location of the ISS.

            try {
              // const myHeaders = new Headers();

              // myHeaders.append(

              //   'apiKey',

              //   '3eIHUiQwLwgF9VQoiPbfcgMMo5NcmPcK4i6h4QuxBrXWnDUcctRFhw8SU9ZwVmlX'

              // );

              // myHeaders.append('Content-Type', 'application/json');

              // const raw = JSON.stringify({

              //   dataSource: 'whmstestdb',

              //   database: 'test',

              //   collection: 'devices',

              //   filter: {

              //     currentUserId: 'gk7mhNS7MxNBDLwVQOT08xn5M4W2',

              //   },

              // });

              // const requestOptions = {

              //   method: 'POST',

              //   headers: myHeaders,

              //   body: raw,

              //   redirect: 'follow',

              //   mode: 'no-cors',

              // };

              // const response = await fetch(

              //   'https://data.mongodb-api.com/app/data-atyht/endpoint/data/v1/action/find',

              //   requestOptions

              // );

              // const loc = await response.json();

              // console.log(loc);

              // let data = JSON.stringify({

              //   dataSource: 'whmstestdb',

              //   database: 'test',

              //   collection: 'devices',

              //   filter: {

              //     currentUserId: 'gk7mhNS7MxNBDLwVQOT08xn5M4W2',

              //   },

              // });

              // let config = {

              //   method: 'post',

              //   maxBodyLength: Infinity,

              //   url: 'https://cors-anywhere.herokuapp.com/https://data.mongodb-api.com/app/data-atyht/endpoint/data/v1/action/find',

              //   headers: {

              //     apiKey:

              //       '3eIHUiQwLwgF9VQoiPbfcgMMo5NcmPcK4i6h4QuxBrXWnDUcctRFhw8SU9ZwVmlX',

              //     'Content-Type': 'application/json',

              //   },

              //   data: data,

              // };

              // console.log('In here ', userData.data.currentUserId);

              // const response = await getLocation(

              //   token,

              //   userData.data.currentUserId

              // ).then((response) => {

              //   console.log(JSON.stringify(response.data));

              // });

              // const response = await fetch(

              //   'https://api.wheretheiss.at/v1/satellites/25544',

              //   { method: 'GET' }

              // );

              const dataloc = await getLoc(token, userData.data.currentUserId);

              const latitude = dataloc.data[0].lat;

              const longitude = dataloc.data[0].lon;

              // Fly the map to the location.

              map.flyTo({
                center: [longitude, latitude],

                speed: 4.5,
              });

              // Return the location of the ISS as GeoJSON.

              return {
                type: 'FeatureCollection',

                features: [
                  {
                    type: 'Feature',

                    geometry: {
                      type: 'Point',

                      coordinates: [longitude, latitude], //lon lat
                    },
                  },
                ],
              };
            } catch (err) {
              // If the updateSource interval is defined, clear the interval to stop updating the source.

              if (updateSource) clearInterval(updateSource);

              throw new Error(err);
            }
          }
        });
      }
    }

    return () => {
      // Clean up Mapbox instance if needed
    };
  }, []); // Empty dependency array: Execute only once on component mount

  const convertDateToUnix = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const unixTimestamp = dateObject.getTime();
      return unixTimestamp;
    }
  };

  useEffect(() => {
    const login = async () => {
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          // console.log(id);

          const response = await getSensorDB(token, id);

          if (response.status === 200) {
            console.log('shivanshu', response.data);

            setHeartRateData(
              response.data.heartSensor.map((item) => item.value)
            );

            setheartRateTimeStamp(
              response.data.heartSensor.map((item) => item.timestamp)
            );

            setBreathRateSensorData(
              response.data.BreathRateSensor.map((item) => item.value)
            );

            setBreathRateSensorTimeStamp(
              response.data.BreathRateSensor.map((item) => item.timestamp)
            );

            setVentilatonSensorData(
              response.data.VentilatonSensor.map((item) => item.value)
            );

            setVentilatonSensorTimeStamp(
              response.data.VentilatonSensor.map((item) => item.timestamp)
            );

            setEvents(response.data.deviceDocuments);

            setinitialTable(response.data.deviceDocuments);
          }
        }

        const user = await app.logIn(Realm.Credentials.anonymous());

        setUser(user);

        const mongodb = app.currentUser.mongoClient('mongodb-atlas');

        const collection = mongodb.db('test').collection('sensordbs');

        // console.log('sensor db watch stream');

        const changeStream = collection.watch();

        for await (const change of changeStream) {
          // console.log('sensor db watch stream changes');

          if (userData.data.currentUserId == change?.fullDocument?._id) {
            setHeartRateData(
              change.fullDocument.heartSensor.map((item) => item.value)
            );

            setheartRateTimeStamp(
              change.fullDocument.heartSensor.map((item) => item.timestamp)
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

      <Box m='2rem 2.5rem'>
        <FlexBetween></FlexBetween>

        <form
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            marginBottom: '2rem',
            marginLeft: '2rem',
          }}
        >
          <TextField
            label='Start Date'
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label='End Date'
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            style={{ width: '125px' }}
            select
            label='Sensor Type'
            value={sensorType}
            onChange={(e) => setSensorType(e.target.value)}
          >
            <MenuItem value='heartSensor'>Heart Rate</MenuItem>
            <MenuItem value='BloodPressureSensor'>Breath Rate</MenuItem>
            <MenuItem value='VentilatonSensor'>VentilatonSensor</MenuItem>
            <MenuItem value='TidalVolumeSensor'>TidalVolumeSensor</MenuItem>
            <MenuItem value='ActivitySensor'>ActivitySensor</MenuItem>
            <MenuItem value='CadenceSensor'>CadenceSensor</MenuItem>
          </TextField>

          <Button
            onClick={handleSubmit}
            variant='contained'
            color={theme.palette.secondary[700]}
          >
            Submit
          </Button>
        </form>

        <Box
          margin='2rem 2rem'
          display='grid'
          gridTemplateColumns='repeat(12, 1fr)'
          gridAutoRows='160px'
          gap='16px'
          zIndex={2}
          sx={{
            '& > div': {
              gridColumn: isNonMediumScreens ? undefined : 'span 12',
            },
          }}
        >
          {/* <ApexGraph
            name={sensorType}
            data={GraphDataByDate}
            timestamp={GraphDataByDateTimestamp}
            max={90}
            zoomEnabled={true}
          /> */}

          <div
            id='map'
            className='MuiBox-root css-1nt5awt'
            ref={mapContainerRef}
            style={{ height: '300px' }}
          />

          {/* ROW 1 */}

          <ApexGraph
            name={'HeartRate'}
            data={heartRateData}
            timestamp={heartRateTimeStamp}
            max={90}
            zoomEnabled={false}
          />

          {/* ROW 2 */}

          <ApexGraph
            name={'BreathRateSensor'}
            data={BreathRateSensorData}
            timestamp={BreathRateSensorTimeStamp}
            max={90}
            zoomEnabled={false}
          />

          <ApexGraph
            name={'VentilationSensor'}
            data={VentilatonSensorData}
            timestamp={VentilatonSensorTimeStamp}
            max={90}
            zoomEnabled={false}
          />

          {/* ROW 3 */}

          {/* <Graph

            name={'Testing'}

            data={VentilatonSensorData}

            timestamp={VentilatonSensorTimeStamp}

            max={90}

          /> */}

          {/* <Graph data={heartRateData}/> */}

          {/* ROW 4 */}

          {isNonMediumScreens && (
            <Box>
              <BodyFigure
                sensorData={{
                  'heart rate': heartRateData[heartRateData.length - 1],
                  temperature:
                    VentilatonSensorData[VentilatonSensorData.length - 1],
                  medication: heartRateData[heartRateData.length - 1],
                  'breath rate': BreathRateSensorData[BreathRateSensorData - 1],
                  activity: heartRateData[heartRateData.length - 1],
                }}
              />

              {/*

              <Tooltip
                title={`Heart rate : ${heartRateData[39]}`}
                arrow
                placement="right-end"
                style={{
                  fontSize: "15",

                  position: "fixed",

                  top: "13rem",

                  right: 240,

                  zIndex: 3,
                }}
              >
                <IconButton>
                  <FavoriteRoundedIcon />
                </IconButton>
              </Tooltip>

 */}

              {/* Pill shape to display connection status*/}

              <Tooltip
                title={`Connection Status: ${currentTime} and ${
                  heartRateTimeStamp[heartRateTimeStamp.length - 1]
                }`}
                arrow
                placement='left-end'
                style={{
                  fontSize: '15',
                  position: 'fixed',
                  top: '6.2rem',
                  right: '4rem',
                  padding: '0rem 1rem 0rem 0.5rem',
                  border: connectionStatus
                    ? '2px solid rgba(124, 214, 171, 0.3)'
                    : '2px solid rgba(255, 36, 36, 0.3)',
                  backgroundColor: connectionStatus
                    ? 'rgba(124, 214, 171, 0.3)'
                    : 'rgba(255, 36, 36, 0.3)',
                  borderRadius: '50px',
                  zIndex: 3,
                }}
              >
                <IconButton>
                  <PowerIcon
                    style={{
                      color: connectionStatus
                        ? 'rgba(124, 214, 171, 0.9)'
                        : 'rgba(255, 36, 36, 0.9)',
                    }}
                  />
                </IconButton>
                <span
                  style={{
                    color: connectionStatus
                      ? 'rgba(124, 214, 171, 0.9)'
                      : 'rgba(255, 36, 36, 0.9)',
                  }}
                >
                  {connectionStatus ? 'Connected' : 'Disconnected'}
                </span>
              </Tooltip>

              {/* <Tooltip
                title={`Connection Status :  ${currentTime} and ${
                  heartRateTimeStamp[heartRateTimeStamp.length - 1]
                }`}
                arrow
                placement="right-end"
                style={{
                  fontSize: "15",

                  position: "fixed",

                  top: "14rem",

                  right: 250,

                  zIndex: 3,

                  color: `${connectionStatus ? "green" : "red"}`,
                }}
              >
                <IconButton>
                  <PowerIcon />
                </IconButton>
              </Tooltip> */}
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
