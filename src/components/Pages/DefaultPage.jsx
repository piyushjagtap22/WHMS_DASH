import { useLayoutEffect } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import '../../css/DefaultPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDeviceIds, getLoc, getSensorDB } from '../../slices/adminApiSlice';
import MapboxMap from '../MapboxMap';
import { Box, Grid, MenuItem, TextField, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import * as Realm from 'realm-web';
import IconButton from '@mui/material/IconButton';
import { Toaster, toast } from 'react-hot-toast';
import PowerIcon from '@mui/icons-material/Power';
import { setAuthState } from '../../slices/authSlice';
import { setLocation } from '../../slices/deviceSlice';
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

import { useCallback } from 'react';
const DefaultPage = (data) => {
  console.log('Default page is rerendering');
  const loading = useSelector((state) => state.loading.loading);
  const [latitude, setLatitude] = useState(23); // Initial latitude
  const [longitude, setLongitude] = useState(77); // Initial longitude
  const latitudeRef = useRef(latitude);
  const longitudeRef = useRef(longitude);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [heartRateData, setHeartRateData] = useState([]);
  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);

  const [connectionStatus, setConnectionStatus] = useState(false);

  const [startDate, setStartDate] = useState(null); // Use null instead of undefined
  const [endDate, setEndDate] = useState(null); // Use null instead of undefined

  const [sensorType, setSensorType] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const memoizedSetTabValue = useCallback((value) => {
    setTabValue(value);
  }, []);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const heartRateTimeStampRef = useRef(heartRateTimeStamp);
  const [latLonData, setLatLonData] = useState([]);
  useEffect(() => {
    heartRateTimeStampRef.current = heartRateTimeStamp;
  }, [heartRateTimeStamp]);

  const tooltipClass = connectionStatus ? 'tooltip' : 'tooltip disconnected';
  const iconClass = connectionStatus ? 'icon' : 'icon disconnected';
  const spanClass = connectionStatus ? '' : 'disconnected';

  // useEffect(() => {
  //   const checkConnectionStatus = () => {
  //     console.log('Check connection status function running');
  //     if (heartRateTimeStampRef.current.length > 0) {
  //       const latestTimestamp =
  //         heartRateTimeStampRef.current[
  //           heartRateTimeStampRef.current.length - 1
  //         ];
  //       const latestTime = new Date(latestTimestamp);
  //       const currentTime = new Date();
  //       const timeDifference = (currentTime - latestTime) / 1000; // Difference in seconds

  //       setConnectionStatus(timeDifference <= 13);
  //     } else {
  //       setConnectionStatus(false);
  //     }
  //   //  TODO make this to update itself as per heartRateTimeStamp reading or something
  //   };

  //   checkConnectionStatus();
  //   const intervalId = setInterval(checkConnectionStatus, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');

  const { state: userData } = useLocation();

  const [graphByDateData, setGraphByDateData] = useState([]);
  const [graphByDateTimeStamp, setGraphByDateTimeStamp] = useState([]);

  const [BreathRateSensorData, setBreathRateSensorData] = useState([]);

  const [BreathRateSensorTimeStamp, setBreathRateSensorTimeStamp] = useState(
    []
  );
  const memoizedUserData = useMemo(() => userData, [userData]);

  const [VentilatonSensorData, setVentilatonSensorData] = useState([]);
  const [VentilatonSensorTimeStamp, setVentilatonSensorTimeStamp] = useState(
    []
  );
  const url = import.meta.env.VITE_REACT_API_URL;
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
  // useEffect(() => {
  //   const fetchLatLonData = async () => {
  //     console.log('inside this token userdata');
  //     if (token && userData?.data?.currentUserId) {
  //       try {
  //         const latLonD = await getLoc(token, userData?.data?.currentUserId);
  //         setLatLonData([latLonD.data[0].lat, latLonD.data[0].lon]);
  //         latitudeRef.lat = latLonD.data[0].lat;
  //         longitudeRef.lon = latLonD.data[0].lon;
  //         console.log('get loc ', [latLonD.data[0].lat, latLonD.data[0].lon]);
  //       } catch (error) {
  //         console.error('Error fetching location data:', error);
  //       }
  //     }
  //   };

  //   fetchLatLonData();
  // }, [token, userData]);

  const uid = useSelector((state) => state.auth.AuthUser?.uid);
  const [events, setEvents] = useState([]);

  async function getGraphData(iid, startTimeStamp, endTimeStamp) {
    const getGraphUrl = `${url}/api/admin/getGraphData`;
    const payload = {
      id: iid,
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
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const sensorDataMappings = [
    {
      sensor: 'heartSensor',
      setData: setHeartRateData,
      setTimeStamp: setheartRateTimeStamp,
      name: 'Heart Rate',
      data: 'heartRateData',
      unit: 'bpm',
    },
    {
      sensor: 'BreathRateSensor',
      setData: setBreathRateSensorData,
      setTimeStamp: setBreathRateSensorTimeStamp,
      name: 'Breath Rate',
      data: 'BreathRateSensorData',
      unit: 'resp/min',
    },
    {
      sensor: 'VentilatonSensor',
      setData: setVentilatonSensorData,
      setTimeStamp: setVentilatonSensorTimeStamp,
      name: 'Ventilaton',
      data: 'VentilatonSensorData',
      unit: 'L/min',
    },
    {
      sensor: 'ActivitySensor',
      setData: setActivitySensorData,
      setTimeStamp: setActivitySensorTimeStamp,
      name: 'Activity',
      data: 'ActivitySensorData',
      unit: 'g',
    },
    {
      sensor: 'BloodPressureSensor',
      setData: setBPSensorData,
      setTimeStamp: setBPSensorTimeStamp,
      name: 'Blood Pressure',
      data: 'BPSensorData',
      unit: 'mmHg',
    },
    {
      sensor: 'CadenceSensor',
      setData: setCadenceSensorData,
      setTimeStamp: setCadenceSensorTimeStamp,
      name: 'Cadence',
      data: 'CadenceSensorData',
      unit: 'step/min ',
    },
    {
      sensor: 'OxygenSaturationSensor',
      setData: setOxygenSaturationSensorData,
      setTimeStamp: setOxygenSaturationSensorTimeStamp,
      name: 'Oxygen Saturation',
      data: 'OxygenSaturationSensorData',
      unit: '%',
    },
    {
      sensor: 'TemperatureSensor',
      setData: setTemperatureSensorData,
      setTimeStamp: setTemperatureSensorTimeStamp,
      name: 'Temperature',
      data: 'TemperatureSensorData',
      unit: '°C',
    },
    {
      sensor: 'TidalVolumeSensor',
      setData: setTidalVolumeSensorData,
      setTimeStamp: setTidalVolumeSensorTimeStamp,
      name: 'Tidal Volume',
      data: 'TidalVolumeSensorData',
      unit: 'L',
    },
  ];
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

  useEffect(() => {
    console.log('Location update wala useEffect is running');
    // Function to fetch and set device data

    const fetchDeviceData = async () => {
      console.log('fetch device data am running ', userData.data.currentUserId);
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
              dispatch(setLocation({ lat, lon }));
              latitudeRef.current = lat;
              longitudeRef.current = lon;
            } else {
              throw new Error('No relevant device data found');
            }
          }
        }

        const mongodb2 = app.currentUser.mongoClient('mongodb-atlas');
        const collection2 = mongodb2.db('test').collection('devices');
        const changeStream2 = collection2.watch();

        for await (const change of changeStream2) {
          if (
            userData.data.currentUserId === change?.fullDocument?.currentUserId
          ) {
            const { lat, lon } = change.fullDocument.location[0];
            if (lat !== latitudeRef.current || lon !== longitudeRef.current) {
              console.log('setting lat lon');
              setLatitude(lat);
              setLongitude(lon);
              dispatch(setLocation({ lat, lon }));
              latitudeRef.current = lat;
              longitudeRef.current = lon;
            }
          } else {
            console.log('Data is Not Relevant');
          }
        }
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    fetchDeviceData();
  }, [token, userData]); // Empty dependency array: Execute only once on component mount

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
        const sensorValues = data[sensor].map((item) => item.value).slice(-20);
        const sensorTimestamps = data[sensor]
          .map((item) => item.timestamp)
          .slice(-20);

        setData(sensorValues);
        setTimeStamp(sensorTimestamps);
      }
    });
  };
  const memoizedUserId = useMemo(
    () => userData.data.currentUserId,
    [userData.data.currentUserId]
  );

  const mapboxMapMemo = useMemo(() => {
    return (
      <MapboxMap
        lat={latitude}
        lon={longitude}
        currentUserId={memoizedUserId}
      />
    );
  }, [latitude, longitude, memoizedUserId]);

  const getSensorName = (sensor) => {
    console.log('get Sonsor name running');
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
              user={memoizedUserData || {}}
              isNonMobile={isNonMobile}
              drawerWidth='250px'
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              setTabValue={memoizedSetTabValue}
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
                    {mapboxMapMemo}
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
                    style={{ marginBottom: '64px' }}
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
