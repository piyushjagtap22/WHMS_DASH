import React, { useEffect, useRef, useState } from 'react';
import '../../css/DefaultPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

import { getDeviceIds, getLoc, getSensorDB } from '../../slices/adminApiSlice';

import { Box, Grid, MenuItem, TextField, useMediaQuery } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import * as Realm from 'realm-web';
import IconButton from '@mui/material/IconButton';

import { Toaster, toast } from 'react-hot-toast';
import PowerIcon from '@mui/icons-material/Power';
import { setAuthState } from '../../slices/authSlice';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Tooltip from '@mui/material/Tooltip';
import { useReactToPrint } from 'react-to-print';
import BodyFigure from '../BodyFigure';
import CustomButton from '../Button';
import SidebarNew from '../SideBarNew';
import ApexGraph from './ApexGraph';
import Navbar from './Navbar';
import ApexGraphPrint from './ApexGraphPrint';

const app = new Realm.App({ id: 'application-0-vdlpx' });

const DefaultPage = (data) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [heartRateData, setHeartRateData] = useState([]);
  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);

  const [latitude, setLatitude] = useState(23); // Initial latitude

  const [longitude, setLongitude] = useState(77); // Initial longitude
  const [connectionStatus, setConnectionStatus] = useState(false);

  const [startDate, setStartDate] = useState(null); // Use null instead of undefined
  const [endDate, setEndDate] = useState(null); // Use null instead of undefined

  const [sensorType, setSensorType] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const heartRateTimeStampRef = useRef(heartRateTimeStamp);

  useEffect(() => {
    heartRateTimeStampRef.current = heartRateTimeStamp;
  }, [heartRateTimeStamp]);

  const tooltipClass = connectionStatus ? 'tooltip' : 'tooltip disconnected';
  const iconClass = connectionStatus ? 'icon' : 'icon disconnected';
  const spanClass = connectionStatus ? '' : 'disconnected';

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (heartRateTimeStampRef.current.length > 0) {
        const latestTimestamp =
          heartRateTimeStampRef.current[
            heartRateTimeStampRef.current.length - 1
          ];
        const latestTime = new Date(latestTimestamp);
        const currentTime = new Date();
        const timeDifference = (currentTime - latestTime) / 1000; // Difference in seconds

        if (timeDifference <= 13) {
          setConnectionStatus((prevStatus) => {
            console.log('up');
            console.log('Updated connectionStatus:', true);
            return true;
          });
        } else {
          setConnectionStatus((prevStatus) => {
            console.log('Updated connectionStatus:', false);
            return false;
          });
        }

        console.log(latestTimestamp);
        console.log(currentTime);
        console.log(timeDifference);
      } else {
        setConnectionStatus((prevStatus) => {
          console.log('Updated connectionStatus:', false);
          return false;
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    console.log('Connection status changed:', connectionStatus);
  }, [connectionStatus]);

  const mapContainerRef = useRef(null);

  const [initialTable, setinitialTable] = useState({});
  const { state: userData } = useLocation();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  if (userData == null) {
    dispatch(setAuthState('/dashboard'));
    navigate('/dashboard');
  }

  const [graphByDateData, setGraphByDateData] = useState([]);
  const [graphByDateTimeStamp, setGraphByDateTimeStamp] = useState([]);

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

  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );

  const uid = useSelector((state) => state.auth.AuthUser?.uid);
  const [events, setEvents] = useState([]);
  async function getGraphData(iid, startTimeStamp, endTimeStamp) {
    const url = 'http://localhost:3000/api/admin/getGraphData';
    const body = JSON.stringify({
      id: iid,
      sensorType: sensorType,
      startTimeStamp: startTimeStamp,
      endTimeStamp: endTimeStamp,
    });

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
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);

      toast.error('Error Fetching data, please check dates');
      throw error;
    }
  }
  const isNonMobile = useMediaQuery('(min-width: 600px)');

  const handleSubmit = () => {
    console.log('sub');
    console.log(userData);
    const startUnix = convertDateToUnix(startDate);
    const endUnix = convertDateToUnix(endDate);

    console.log('Start Unix:', startUnix);
    console.log('End Unix:', endUnix);

    getGraphData(userData.data.profileData._id, startUnix, endUnix)
      .then((data) => {
        if (data && data.length > 0) {
          // Extracting values from data
          const values = data.map((item) => item.value);
          const timestamp = data.map((item) => item.timestamp.slice(11, 19));
          setGraphByDateData(values);
          setGraphByDateTimeStamp(timestamp);
          setGraphDataByDate(values);
          setGraphDataByDateTimestamp(timestamp);
        } else {
          toast.error('No data points found');
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
        // Handle errors here
      });
  };

  useEffect(() => {
    const devicesdb = async () => {
      console.log('useeffect trigerred');
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          const response = await getDeviceIds(token, id);

          if (response.status === 200) {
            for (var r in response.data.deviceDocuments) {
              if (
                response.data.deviceDocuments[r].currentUserId ==
                userData.data.currentUserId
              )
                setLatitude(response.data.deviceDocuments[r].location[0].lat);

              setLongitude(response.data.deviceDocuments[r].location[0].lon);
            }
          }
        }

        const mongodb2 = app.currentUser.mongoClient('mongodb-atlas');

        const collection2 = mongodb2.db('test').collection('devices');

        const changeStream2 = collection2.watch();

        for await (const change of changeStream2) {
          if (
            userData.data.currentUserId == change?.fullDocument?.currentUserId
          ) {
            const lat = change.fullDocument.location[0].lat;

            const lon = change.fullDocument.location[0].lon;

            setLatitude(lat);

            setLongitude(lon);
          } else {
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    devicesdb();

    const mapboxScript = document.createElement('script');

    mapboxScript.src =
      'https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js';

    mapboxScript.onload = initializeMap;

    document.body.appendChild(mapboxScript);

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

          style: 'mapbox://styles/mapbox/streets-v12',

          zoom: 14.0,
        });

        map.on('load', async () => {
          const geojson = await getLocation();

          // Add the ISS location as a source.

          map.addSource('iss', {
            type: 'geojson',

            data: geojson,
          });

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

  // Example usage
  const dateString = 'Thu Jul 11 2024 01:15:00 GMT+0530 (India Standard Time)';
  const unixTime = convertDateToUnix(dateString);
  const mapSensorData = (data, mappings) => {
    mappings.forEach(({ sensor, setData, setTimeStamp }) => {
      if (data[sensor]) {
        setData(data[sensor].map((item) => item.value));
        setTimeStamp(data[sensor].map((item) => item.timestamp));
      }
    });
  };

  const sensorDataMappings = [
    {
      sensor: 'heartSensor',
      setData: setHeartRateData,
      setTimeStamp: setheartRateTimeStamp,
      name: 'Heart Rate',
      data: 'heartRateData',
    },
    {
      sensor: 'BreathRateSensor',
      setData: setBreathRateSensorData,
      setTimeStamp: setBreathRateSensorTimeStamp,
      name: 'Breath Rate',
      data: 'BreathRateSensorData',
    },
    {
      sensor: 'VentilatonSensor',
      setData: setVentilatonSensorData,
      setTimeStamp: setVentilatonSensorTimeStamp,
      name: 'Ventilaton',
      data: 'VentilatonSensorData',
    },
    {
      sensor: 'ActivitySensor',
      setData: setActivitySensorData,
      setTimeStamp: setActivitySensorTimeStamp,
      name: 'Activity',
      data: 'ActivitySensorData',
    },
    {
      sensor: 'BloodPressureSensor',
      setData: setBPSensorData,
      setTimeStamp: setBPSensorTimeStamp,
      name: 'Blood Pressure',
      data: 'BPSensorData',
    },
    {
      sensor: 'CadenceSensor',
      setData: setCadenceSensorData,
      setTimeStamp: setCadenceSensorTimeStamp,
      name: 'Cadence',
      data: 'CadenceSensorData',
    },
    {
      sensor: 'OxygenSaturationSensor',
      setData: setOxygenSaturationSensorData,
      setTimeStamp: setOxygenSaturationSensorTimeStamp,
      name: 'Oxygen Saturation',
      data: 'OxygenSaturationSensorData',
    },
    {
      sensor: 'TemperatureSensor',
      setData: setTemperatureSensorData,
      setTimeStamp: setTemperatureSensorTimeStamp,
      name: 'Temperature',
      data: 'TemperatureSensorData',
    },
    {
      sensor: 'TidalVolumeSensor',
      setData: setTidalVolumeSensorData,
      setTimeStamp: setTidalVolumeSensorTimeStamp,
      name: 'Tidal Volume',
      data: 'TidalVolumeSensorData',
    },
  ];
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
            mapSensorData(response.data, sensorDataMappings);
            setEvents(response.data.deviceDocuments);
          }
        }

        const user = await app.logIn(Realm.Credentials.anonymous());

        const mongodb = app.currentUser.mongoClient('mongodb-atlas');

        const collection = mongodb.db('test').collection('sensordbs');

        const changeStream = collection.watch();

        for await (const change of changeStream) {
          if (userData.data.currentUserId == change?.fullDocument?._id) {
            mapSensorData(change.fullDocument, sensorDataMappings);
          } else {
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    login();
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Navbar />

      <Toaster toastOptions={{ duration: 4000 }} />
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
              <div
                id='map'
                className='MuiBox-root css-1nt5awt'
                ref={mapContainerRef}
              />
              {sensorDataMappings.map(
                ({ sensor, setData, setTimeStamp, name, data }) => (
                  <ApexGraph
                    key={sensor}
                    name={name}
                    data={eval(data)}
                    timestamp={eval(data.replace('Data', 'TimeStamp'))}
                    max={90}
                    zoomEnabled={false}
                  />
                )
              )}
            </Box>
          ) : (
            <>
              <form className='dpForm'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label='Start Date'
                    value={startDate}
                    onChange={(e) => {
                      console.log(e);
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
                      console.log(e);
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
                  <MenuItem value='BloodPressureSensor'>Breath Rate</MenuItem>
                  <MenuItem value='VentilatonSensor'>VentilatonSensor</MenuItem>
                  <MenuItem value='TidalVolumeSensor'>
                    TidalVolumeSensor
                  </MenuItem>
                  <MenuItem value='ActivitySensor'>ActivitySensor</MenuItem>
                  <MenuItem value='CadenceSensor'>CadenceSensor</MenuItem>
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
                      <CustomButton onClick={handlePrint}>
                        Print this out!
                      </CustomButton>
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
                className={tooltipClass}
              >
                <div>
                  <IconButton>
                    <PowerIcon className={iconClass} />
                  </IconButton>
                  <span className={spanClass}>
                    {connectionStatus ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default DefaultPage;
