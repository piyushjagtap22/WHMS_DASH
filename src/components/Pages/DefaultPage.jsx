import { useLayoutEffect } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import '../../css/DefaultPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDeviceIds, getLoc, getSensorDB } from '../../slices/adminApiSlice';

import { Box, Grid, MenuItem, TextField, useMediaQuery } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
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
  const loading = useSelector((state) => state.loading.loading);
  console.log(loading);
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);
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
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const tooltipClass = connectionStatus ? 'tooltip' : 'tooltip disconnected';
  const iconClass = connectionStatus ? 'icon' : 'icon disconnected';
  const spanClass = connectionStatus ? '' : 'disconnected';
  const mapRef = useRef(null); // Create a ref for the map object
  const MAPBOX_TOKEN =
    'pk.eyJ1IjoicGl5dXNoMjIiLCJhIjoiY2x1ZWM2cWtlMXFhZjJrcW40OHA0a2h0eiJ9.GtGi0PHDryu8IT04ueU7Pw';
  const GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  const DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox/cycling';

  const getDir = async (start, end) => {
    try {
      console.log(start, end);

      const req2 = `${DIRECTIONS_URL}/${start[1]},${start[0]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      console.log('REQ', req2);
      const loc2 = await axios.get(req2);
      return loc2;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  };

  const updateAddress = async (lat, lon, addressType) => {
    console.log(lat, lon);
    console.log('rev geocoding');
    const req = `${GEOCODING_URL}/${lon}%2C%20${lat}.json?access_token=${MAPBOX_TOKEN}`;
    try {
      console.log(req);
      const loc = await axios.get(req);
      const placeName = loc.data?.features[0]?.place_name;
      console.log(placeName);

      if (addressType === 'address1') {
        setAddress(placeName);
      } else if (addressType === 'address2') {
        setAddress2(placeName);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    const checkConnectionStatus = () => {
      if (heartRateTimeStampRef.current.length > 0) {
        const latestTimestamp =
          heartRateTimeStampRef.current[
            heartRateTimeStampRef.current.length - 1
          ];
        const latestTime = new Date(latestTimestamp);
        const currentTime = new Date();
        const timeDifference = (currentTime - latestTime) / 1000; // Difference in seconds

        setConnectionStatus(timeDifference <= 13);
      } else {
        setConnectionStatus(false);
      }
    };

    checkConnectionStatus();
    const intervalId = setInterval(checkConnectionStatus, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const mapContainerRef = useRef(null);

  const [initialTable, setinitialTable] = useState({});

  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  const { state: userData } = useLocation();
  // if (userData == null) {
  //   console.log('got to dashboard');
  //   dispatch(setAuthState('/dashboard'));
  //   navigate('/dashboard');
  // }

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
    const payload = {
      id: iid,
      sensorType: sensorType,
      startTimeStamp: startTimeStamp,
      endTimeStamp: endTimeStamp,
    };

    try {
      const response = await axios.post(url, payload, {
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
  const isNonMobile = useMediaQuery('(min-width: 600px)');

  const handleSubmit = async () => {
    try {
      const startUnix = convertDateToUnix(startDate);
      const endUnix = convertDateToUnix(endDate);

      const data = await getGraphData(
        userData.data.profileData._id,
        startUnix,
        endUnix
      );

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

  async function getRoute(map, start, end) {
    try {
    } catch (error) {
      console.error('Error fetching or processing route:', error);
    }
  }

  useEffect(() => {
    let updateSourceInterval = null;

    // Function to initialize Mapbox
    const initializeMap = () => {
      if (!mapContainerRef.current) return;

      mapboxgl.accessToken =
        'pk.eyJ1IjoicGl5dXNoMjIiLCJhIjoiY2x1ZWM2cWtlMXFhZjJrcW40OHA0a2h0eiJ9.GtGi0PHDryu8IT04ueU7Pw';

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 14.0,
      });

      map.on('load', async () => {
        try {
          const geojson = await getLocation(map);
          map.addSource('iss', { type: 'geojson', data: geojson });
          map.addLayer({
            id: 'iss',
            type: 'symbol',
            source: 'iss',
            layout: { 'icon-image': 'rocket' },
          });

          updateSourceInterval = setInterval(async () => {
            try {
              const geojson = await getLocation(map);
              map.getSource('iss').setData(geojson);
            } catch (err) {
              clearInterval(updateSourceInterval);
              console.error('Error updating map source:', err);
            }
          }, 5000);
        } catch (err) {
          console.error('Error initializing map:', err);
        }
      });
    };

    // Function to fetch and set device data
    const fetchDeviceData = async () => {
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          const response = await getDeviceIds(token, id);

          if (response.status === 200) {
            const device = response.data.deviceDocuments.find(
              (doc) => doc.currentUserId === id
            );

            if (device) {
              const { lat, lon } = device.location[0];
              setLatitude(lat);
              setLongitude(lon);
              latitudeRef.current = lat;
              longitudeRef.current = lon;
              updateAddress(lat, lon, 'address1');
            } else {
              throw new Error('No relevant device data found');
            }
          }
        }

        const mongodb2 = app.currentUser.mongoClient('mongodb-atlas');
        const collection2 = mongodb2.db('test').collection('devices');
        const changeStream2 = collection2.watch();

        console.log('Location update');
        for await (const change of changeStream2) {
          if (
            userData.data.currentUserId === change?.fullDocument?.currentUserId
          ) {
            console.log('Location update');
            const { lat, lon } = change.fullDocument.location[0];
            setLatitude(lat);
            setLongitude(lon);
            latitudeRef.current = lat;
            longitudeRef.current = lon;
            updateAddress(lat, lon, 'address1');
          } else {
            console.log('Data is Not Relevant');
          }
        }
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    // Function to get current location
    const getLocation = async (map) => {
      try {
        const dataloc = await getLoc(token, userData.data.currentUserId);
        const latitude = dataloc.data[0].lat;
        const longitude = dataloc.data[0].lon;

        setLatitude(latitude);
        setLongitude(longitude);
        latitudeRef.current = latitude;
        longitudeRef.current = longitude;

        // Fly the map to the location.
        if (
          latitudeRef.current != latitude ||
          longitudeRef.current != longitude
        ) {
          if (map.getLayer('route')) {
            map.removeLayer('route');
          }
          if (map.getSource('route')) {
            map.removeSource('route');
          }

          if (map.getLayer('end')) {
            map.removeLayer('end');
          }
          if (map.getSource('end')) {
            map.removeSource('end');
          }
        }
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
                coordinates: [longitude, latitude], // lon lat
              },
            },
          ],
        };
      } catch (err) {
        console.error('Error fetching location:', err);
        throw new Error(err);
      }
    };

    // Fetch initial device data and initialize Mapbox
    fetchDeviceData();
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

    // Cleanup function
    return () => {
      if (updateSourceInterval) clearInterval(updateSourceInterval);
      document.body.removeChild(mapboxScript);
      document.head.removeChild(mapboxLink);
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

  const getSensorName = (sensor) => {
    console.log(sensor);
    const sensorMapping = sensorDataMappings.find(
      (mapping) => mapping.sensor === sensor
    );
    return sensorMapping ? sensorMapping.name : 'Please select sensor';
  };

  useEffect(() => {
    const login = async () => {
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          const response = await getSensorDB(token, id);

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
  const handleButtonClick = () => {
    console.log(latitudeRef.current, longitudeRef.current);
    const url = `https://google.com/maps/search/${latitudeRef.current},${longitudeRef.current}`;
    window.open(url, '_blank');
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
                <>
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
                    style={{ marginBottom: '64px' }}
                  >
                    <div
                      className='MuiBox-root'
                      style={{
                        gridColumn: 'span 7',
                        gridRow: 'span 3',
                        height: '34rem',
                        backgroundColor: '#191C23',
                        padding: '0rem',
                        borderRadius: '1.55rem',
                        zIndex: 2,
                        width: '',
                      }}
                    >
                      <div
                        id='map'
                        style={{
                          borderTopLeftRadius: '1.55rem',
                          borderTopRightRadius: '1.55rem',
                          height: '23rem',
                        }}
                        // className='MuiBox-root css-1nt5awt'
                        ref={mapContainerRef}
                      />
                      <div
                        style={{
                          padding: '16px',
                        }}
                      >
                        <p
                          style={{
                            maxWidth: '754.5px',

                            padding: '8px',
                            border: '2px solid gray',
                            borderRadius: '0.73rem',
                          }}
                        >
                          Location: {address}
                        </p>

                        <CustomButton onClick={handleButtonClick}>
                          Open in Maps
                        </CustomButton>
                      </div>
                    </div>
                  </Box>
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
                </>
              ) : (
                <>
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
                      <MenuItem value='BloodPressureSensor'>
                        Blood Pressure
                      </MenuItem>
                      <MenuItem value='VentilatonSensor'>Ventilation</MenuItem>

                      <MenuItem value='BreathRateSensor'>Breath Rate</MenuItem>
                      <MenuItem value='TidalVolumeSensor'>
                        Tidal Volume
                      </MenuItem>
                      <MenuItem value='ActivitySensor'>Activity</MenuItem>
                      <MenuItem value='CadenceSensor'>Cadence</MenuItem>

                      <MenuItem value='OxygenSaturationSensor'>
                        Oxygen Saturation
                      </MenuItem>
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
                      'Heart Rate': heartRateData[heartRateData.length - 1],
                      'Min. Ventilation':
                        VentilatonSensorData[VentilatonSensorData.length - 1],
                      'Breathing Rate':
                        BreathRateSensorData[
                          BreathRateSensorTimeStamp.length - 1
                        ],
                      Activity:
                        ActivitySensorData[ActivitySensorData.length - 1],
                      'Tidal Volume':
                        TidalVolumeSensorData[TidalVolumeSensorData.length - 1],
                      SPO2: OxygenSaturationSensorData[
                        OxygenSaturationSensorData.length - 1
                      ],
                      Steps: ActivitySensorData[ActivitySensorData.length - 1],
                      Cadence: CadenceSensorData[CadenceSensorData.length - 1],

                      Temperature:
                        TemperatureSensorData[TemperatureSensorData.length - 1],
                      'Blood Pressure': BPSensorData[BPSensorData.length - 1],
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
                    </div>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default DefaultPage;
