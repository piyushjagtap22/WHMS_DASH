import React from 'react';
import { useState } from 'react';
import ApexGraph from './ApexGraph';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSensorDB } from '../slices/adminApiSlice';
import { Box, useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import * as Realm from 'realm-web';

const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
import { setSensorData } from '../slices/deviceSlice';

const GraphsComp = () => {
  const dispatch = useDispatch();
  const { state: userData } = useLocation();
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  const mapSensorData = (data, mappings) => {
    dispatch(setSensorData(data));
    mappings.forEach(({ sensor, setData, setTimeStamp }) => {
      if (data[sensor]) {
        const sensorValues = data[sensor].map((item) => item.value).slice(-20);
        const sensorTimestamps = data[sensor]
          .map((item) => item.timestamp)
          .slice(-20); // Slice Code TODO

        setData(sensorValues);
        setTimeStamp(sensorTimestamps);
      }
      if (sensor === 'heartSensor') {
      }
    });
  };
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
  const stateMapping = {
    heartRateData,
    heartRateTimeStamp,
    BreathRateSensorData,
    BreathRateSensorTimeStamp,
    VentilatonSensorData,
    VentilatonSensorTimeStamp,
    ActivitySensorData,
    ActivitySensorTimeStamp,
    BPSensorData,
    BPSensorTimeStamp,
    CadenceSensorData,
    CadenceSensorTimeStamp,
    OxygenSaturationSensorData,
    OxygenSaturationSensorTimeStamp,
    TemperatureSensorData,
    TemperatureSensorTimeStamp,
    TidalVolumeSensorData,
    TidalVolumeSensorTimeStamp,
  };
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

  const [events, setEvents] = useState([]);
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
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

        const mongodb = app.currentUser.mongoClient('mongodb-atlas');

        const collection = mongodb.db('test').collection('sensordbs');

        const changeStream = collection.watch();

        for await (const change of changeStream) {
          if (userData.data.currentUserId == change?.fullDocument?._id) {
            mapSensorData(change.fullDocument, sensorDataMappings);
          } else {
          }
        }
        return () => {
          changeStream.close();
        };
      } catch (error) {
        console.error('Error:', error);
      }
    };

    login();
  }, []);

  return (
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
        {sensorDataMappings.map(
          ({ sensor, setData, setTimeStamp, name, data }) => (
            <ApexGraph
              key={sensor}
              name={name}
              data={stateMapping[data]}
              timestamp={stateMapping[data.replace('Data', 'TimeStamp')]}
              max={90}
              zoomEnabled={false}
            />
          )
        )}
      </Box>
    </>
  );
};

export default GraphsComp;
