import React, { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { getDeviceIds, getLoc, getSensorDB } from '../../slices/adminApiSlice';

import { Box, Grid, MenuItem, TextField, useMediaQuery } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import * as Realm from 'realm-web';

import IconButton from '@mui/material/IconButton';

import PowerIcon from '@mui/icons-material/Power';

import Tooltip from '@mui/material/Tooltip';
import { useReactToPrint } from 'react-to-print';
import { useTheme } from '@emotion/react';
import BodyFigure from '../BodyFigure';
import CustomButton from '../Button';
import SidebarNew from '../SideBarNew';
import GraphByDate from './GraphByDate';
import ApexGraph from './ApexGraph';
import Navbar from './Navbar';
import ApexGraphPrint from './ApexGraphPrint';

const app = new Realm.App({ id: 'application-0-vdlpx' });

const ENDPOINT = 'http://localhost:3000';

var socket;

const DefaultPage = () => {
  const theme = useTheme();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);

  const [latitude, setLatitude] = useState(23); // Initial latitude

  const [longitude, setLongitude] = useState(77); // Initial longitude

  const [connectionStatus, setConnectionStatus] = useState(false);

  const [startDate, setStartDate] = useState();

  const [endDate, setEndDate] = useState();

  const [sensorType, setSensorType] = useState('');

  const [tabValue, setTabValue] = useState(0);

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const heartRateTimeStampRef = useRef(heartRateTimeStamp);

  useEffect(() => {
    heartRateTimeStampRef.current = heartRateTimeStamp;
  }, [heartRateTimeStamp]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log('useEffect ran');
      // console.log(heartRateTimeStampRef.current.length);

      if (heartRateTimeStampRef.current.length > 0) {
        const latestTimestamp =
          heartRateTimeStampRef.current[
            heartRateTimeStampRef.current.length - 1
          ];
        const latestTime = new Date(latestTimestamp);
        const currentTime = new Date();

        const timeDifference = (currentTime - latestTime) / 1000; // Difference in seconds

        if (timeDifference <= 13) {
          setConnectionStatus(true);
        } else {
          setConnectionStatus(false);
        }

        // console.log(connectionStatus);
        // console.log(timeDifference);
        // console.log(currentTime, latestTime);
      } else {
        setConnectionStatus(false); // No timestamp available, set connectionStatus to false
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount

  const mapContainerRef = useRef(null);

  const [initialTable, setinitialTable] = useState({});

  const { state: userData } = useLocation();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  const dispatch = useDispatch();

  var devices = [];

  const [user, setUser] = useState();

  const [graphByDateData, setGraphByDateData] = useState([]);
  const [graphByDateTimeStamp, setGraphByDateTimeStamp] = useState([]);

  const [heartRateData, setHeartRateData] = useState([]);

  const [BreathRateSensorData, setBreathRateSensorData] = useState([]);

  const [BreathRateSensorTimeStamp, setBreathRateSensorTimeStamp] = useState(
    []
  );

  const [VentilatonSensorData, setVentilatonSensorData] = useState([]);
  const [VentilatonSensorTimeStamp, setVentilatonSensorTimeStamp] = useState(
    []
  );

  const [ActivitySensorData, setActivitySensorData] = useState([]);
  const [ActivitySensorTimeStamp, setActivitySensorTimeStamp] = useState([]);

  const [BPSensorData, setBPSensorData] = useState([]);
  const [BPSensorTimeStamp, setBPSensorTimeStamp] = useState([]);

  const [CadenceSensorData, setCadenceSensorData] = useState([]);
  const [CadenceSensorTimeStamp, setCadenceSensorTimeStamp] = useState([]);

  const [OxygenSaturationSensorData, setOxygenSaturationSensorData] = useState(
    []
  );
  const [OxygenSaturationSensorTimeStamp, setOxygenSaturationSensorTimeStamp] =
    useState([]);

  const [TemperatureSensorData, setTemperatureSensorData] = useState([]);
  const [TemperatureSensorTimeStamp, setTemperatureSensorTimeStamp] = useState(
    []
  );

  const [TidalVolumeSensorData, setTidalVolumeSensorData] = useState([]);
  const [TidalVolumeSensorTimeStamp, setTidalVolumeSensorTimeStamp] = useState(
    []
  );

  const [VentilationSensorData, setVentilationSensorData] = useState([]);
  const [VentilationSensorTimeStamp, setVentilationSensorTimeStamp] = useState(
    []
  );

  const [GraphDataByDate, setGraphDataByDate] = useState([]);
  const [GraphDataByDateTimestamp, setGraphDataByDateTimestamp] = useState([]);

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

    // //console.log(
    //   'dates',
    //   convertDateToUnix(startDate) + '  ' + convertDateToUnix(endDate)
    // );

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
  const isNonMobile = useMediaQuery('(min-width: 600px)');

  const handleSubmit = () => {
    getGraphData()
      .then((data) => {
        if (data && data.length > 0) {
          // Extracting values from data
          const values = data.map((item) => item.value);

          const timestamp = data.map((item) => item.timestamp.slice(11, 19));
          setGraphByDateData(values);
          setGraphByDateTimeStamp(timestamp);

          setGraphDataByDate(values);

          setGraphDataByDateTimestamp(timestamp);

          //console.log('shiv', GraphDataByDate);

          //console.log('shiv', GraphDataByDateTimestamp);
        } else {
          window.confirm('invalid dates');
          //console.log('Invalid dates');
        }
      })

      .catch((error) => {
        // Handle errors here
      });
  };

  useEffect(() => {
    const devicesdb = async () => {
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          // //console.log(id);

          const response = await getDeviceIds(token, id);

          //console.log('req made ');

          if (response.status === 200) {
            // //console.log('in 200');

            // //console.log(response.data.deviceDocuments);

            for (var r in response.data.deviceDocuments) {
              if (
                response.data.deviceDocuments[r].currentUserId ==
                userData.data.currentUserId
              )
                // //console.log(response.data.deviceDocuments[r].location[0].lat);

                // //console.log(response.data.deviceDocuments[r].location[0].lon);

                setLatitude(response.data.deviceDocuments[r].location[0].lat);

              setLongitude(response.data.deviceDocuments[r].location[0].lon);
            }
          }
        }

        const user2 = await app.logIn(Realm.Credentials.anonymous());

        setUser(user2);

        const mongodb2 = app.currentUser.mongoClient('mongodb-atlas');

        const collection2 = mongodb2.db('test').collection('devices');

        // //console.log('device db watch stream');

        const changeStream2 = collection2.watch();

        for await (const change of changeStream2) {
          // //console.log('device db watch stream changes');

          if (
            userData.data.currentUserId == change?.fullDocument?.currentUserId
          ) {
            // //console.log('Here in device changes');

            // //console.log(change.fullDocument.location[0].lat);

            // //console.log(

            //   change.fullDocument.location[0].lat,

            //   change.fullDocument.location[0].lon

            // );

            const lat = change.fullDocument.location[0].lat;

            const lon = change.fullDocument.location[0].lon;

            setLatitude(lat);

            setLongitude(lon);
          } else {
            //console.log('Data is Not Relevant');
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

    //     const timestamp = data.map(item => item.timestamp);

    //     // Assuming setGraphDataByDate is a function to set state in React

    //     setGraphDataByDate(values);

    //     setGraphDataByDateTimestamp(timestamp);

    //     //console.log("shiv", GraphDataByDate);

    //     //console.log("shiv", GraphDataByDateTimestamp);

    //   }

    //   })

    // .catch(error => {

    //     // Handle errors here

    // });

    devicesdb();

    // //console.log('mapbox setting up');

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
              'icon-image': 'rocket',
            },
          });

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

              // //console.log(loc);

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

              // //console.log('In here ', userData.data.currentUserId);

              // const response = await getLocation(

              //   token,

              //   userData.data.currentUserId

              // ).then((response) => {

              //   //console.log(JSON.stringify(response.data));

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
    //console.log('shivnashu 22', localStorage.getItem('tabhistory'));
    const login = async () => {
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          // //console.log(id);

          const response = await getSensorDB(token, id);
          console.log(response);

          if (response.status === 200) {
            //console.log('shivanshu', response.data);

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

            setActivitySensorData(
              response.data.ActivitySensor.map((item) => item.value)
            );

            setActivitySensorTimeStamp(
              response.data.ActivitySensor.map((item) => item.timestamp)
            );

            setBPSensorData(
              response.data.BloodPressureSensor.map((item) => item.value)
            );

            setBPSensorTimeStamp(
              response.data.BloodPressureSensor.map((item) => item.timestamp)
            );

            setCadenceSensorData(
              response.data.CadenceSensor.map((item) => item.value)
            );

            setCadenceSensorTimeStamp(
              response.data.CadenceSensor.map((item) => item.timestamp)
            );

            setOxygenSaturationSensorData(
              response.data.OxygenSaturationSensor.map((item) => item.value)
            );

            setOxygenSaturationSensorTimeStamp(
              response.data.OxygenSaturationSensor.map((item) => item.timestamp)
            );

            setTemperatureSensorData(
              response.data.TemperatureSensor.map((item) => item.value)
            );

            setTemperatureSensorTimeStamp(
              response.data.TemperatureSensor.map((item) => item.timestamp)
            );

            setTidalVolumeSensorData(
              response.data.TidalVolumeSensor.map((item) => item.value)
            );

            setTidalVolumeSensorTimeStamp(
              response.data.TidalVolumeSensor.map((item) => item.timestamp)
            );

            setVentilationSensorData(
              response.data.VentilatonSensor.map((item) => item.value)
            );

            setVentilationSensorTimeStamp(
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

        // //console.log('sensor db watch stream');

        const changeStream = collection.watch();

        for await (const change of changeStream) {
          // //console.log('sensor db watch stream changes');

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
              change.fullDocument.BreathRateSensor.map((item) => item.timestamp)
            );

            setVentilatonSensorData(
              change.fullDocument.VentilatonSensor.map((item) => item.value)
            );

            setVentilatonSensorTimeStamp(
              change.fullDocument.VentilatonSensor.map((item) => item.timestamp)
            );

            setActivitySensorData(
              change.fullDocument.ActivitySensor.map((item) => item.value)
            );

            setActivitySensorTimeStamp(
              change.fullDocument.ActivitySensor.map((item) => item.timestamp)
            );

            setBPSensorData(
              change.fullDocument.BloodPressureSensor.map((item) => item.value)
            );

            setBPSensorTimeStamp(
              change.fullDocument.BloodPressureSensor.map(
                (item) => item.timestamp
              )
            );

            setCadenceSensorData(
              change.fullDocument.CadenceSensor.map((item) => item.value)
            );

            setCadenceSensorTimeStamp(
              change.fullDocument.CadenceSensor.map((item) => item.timestamp)
            );

            setOxygenSaturationSensorData(
              change.fullDocument.OxygenSaturationSensor.map(
                (item) => item.value
              )
            );

            setOxygenSaturationSensorTimeStamp(
              change.fullDocument.OxygenSaturationSensor.map(
                (item) => item.timestamp
              )
            );

            setTemperatureSensorData(
              change.fullDocument.TemperatureSensor.map((item) => item.value)
            );

            setTemperatureSensorTimeStamp(
              change.fullDocument.TemperatureSensor.map(
                (item) => item.timestamp
              )
            );

            setTidalVolumeSensorData(
              change.fullDocument.TidalVolumeSensor.map((item) => item.value)
            );

            setTidalVolumeSensorTimeStamp(
              change.fullDocument.TidalVolumeSensor.map(
                (item) => item.timestamp
              )
            );
          } else {
            //console.log('Data is Not Relevant');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    login();
  }, []);

  //console.log('in layout');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  //console.log('sidebar', userData.data.initialUserData.name);

  return (
    <>
      <Navbar />

      <Box display='flex' flexDirection='row'>
        <SidebarNew
          user={userData || {}}
          isNonMobile={isNonMobile}
          drawerWidth='250px'
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setTabValue={setTabValue}
        />
        <Box flexGrow={1} m='2rem 0rem'>
          {tabValue === 0 ? (
            <Box
              margin='2rem 2rem'
              display='grid'
              gridTemplateColumns='repeat(12, 1fr)'
              gridAutoRows='160px'
              gap='12px'
              zIndex={2}
              sx={{
                '& > div': {
                  gridColumn: isNonMediumScreens ? undefined : 'span 12',
                },
              }}
            >
              {' '}
              <div
                id='map'
                className='MuiBox-root css-1nt5awt'
                ref={mapContainerRef}
                style={{ height: '300px', margin: 0, padding: 0 }}
              />
              <ApexGraph
                name='Heart Rate'
                data={heartRateData}
                timestamp={heartRateTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='Blood Pressure'
                data={BPSensorData}
                timestamp={BPSensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='BreathRateSensor'
                data={BreathRateSensorData}
                timestamp={BreathRateSensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='Oxygen Saturation'
                data={OxygenSaturationSensorData}
                timestamp={OxygenSaturationSensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='Temperature'
                data={TemperatureSensorData}
                timestamp={TemperatureSensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='Activity'
                data={ActivitySensorData}
                timestamp={ActivitySensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='Cadence'
                data={CadenceSensorData}
                timestamp={CadenceSensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='Tidal Volume'
                data={TidalVolumeSensorData}
                timestamp={TidalVolumeSensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />
              <ApexGraph
                name='VentilationSensor'
                data={VentilatonSensorData}
                timestamp={VentilatonSensorTimeStamp}
                max={90}
                zoomEnabled={false}
              />{' '}
            </Box>
          ) : (
            <>
              <form
                style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                  marginBottom: '1rem',
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
                  <MenuItem value='TidalVolumeSensor'>
                    TidalVolumeSensor
                  </MenuItem>
                  <MenuItem value='ActivitySensor'>ActivitySensor</MenuItem>
                  <MenuItem value='CadenceSensor'>CadenceSensor</MenuItem>
                </TextField>

                <CustomButton
                  onClick={handleSubmit}
                  variant='contained'
                  // color={theme.palette.secondary[700]}
                >
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
                      name={userData.data.initialUserData.name}
                      email={userData.data.initialUserData.email}
                      phone={userData.data.initialUserData.phone}
                      data={graphByDateData}
                      timestamp={graphByDateTimeStamp}
                      max={90}
                      zoomEnabled={true}
                      ref={componentRef}
                      startDate={startDate}
                      endDate={endDate}
                      sensorType={sensorType}
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '20px',
                        justifyContent: 'center',
                      }}
                    >
                      <button
                        onClick={handlePrint}
                        style={{
                          padding: '10px 20px',
                          fontSize: '1rem',
                          color: '#121318',
                          backgroundColor: '#7CD6AB',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        Print this out!
                      </button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </>
          )}

          {isNonMediumScreens && tabValue === 0 && (
            <Box>
              <BodyFigure
                sensorData={{
                  'heart rate': heartRateData[heartRateData.length - 1],
                  temperature:
                    VentilatonSensorData[VentilatonSensorData.length - 1],
                  medication: heartRateData[heartRateData.length - 1],
                  'breath rate':
                    BreathRateSensorData[BreathRateSensorTimeStamp.length - 1],
                  activity: heartRateData[heartRateData.length - 1],
                }}
              />

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
                    ? 'rgba(124, 214, 171, 0.1)'
                    : 'rgba(255, 36, 36, 0.1)',
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
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default DefaultPage;
