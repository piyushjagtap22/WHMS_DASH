import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import {
  setCurrentDeviceUserId,
  setCurrentDeviceData,
} from '../slices/deviceSlice.js';
import { Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Realm from 'realm-web';
import { getDeviceIds } from '../../src/slices/adminApiSlice';
const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
import CustomButton from './Button.jsx';
import { setCurrentDevice } from '../slices/deviceSlice.js';
import { useDispatch } from 'react-redux';

const SensorPage = () => {
  const [loading, setLoading] = useState(true); // Add this line to manage loading state

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  const [buttonLoader, setButtonLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState();
  const [rowdata, setData] = useState([]);
  var devices = [];
  const [events, setEvents] = useState([]);
  const handleClose = () => setOpen(false);

  const handleRowClick = (data) => {
    setOpen(true);
    setData(data);
  };
  // Function to handle real-time updates
  const handleRealTimeUpdate = (updatedObject) => {
    setData((prevData) => {
      const updatedData = prevData.map((obj) => {
        if (obj._id === updatedObject._id) {
          return {
            ...obj,
            BreathRateSensor: {
              ...obj.BreathRateSensor,
              value: updatedObject.BreathRateSensor.value,
            },
            VentilatonSensor: {
              ...obj.VentilatonSensor,
              value: updatedObject.VentilatonSensor.value,
            },
          };
        }
        return obj;
      });

      return updatedData;
    });
  };

  const [initialTable, setinitialTable] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  //Table Searching
  const handleSearchChange = (eve) => {
    const searchTerm = eve.target.value;
    setSearchTerm(searchTerm);

    console.log('in sensor page');
    console.log(searchTerm);

    const filteredData = events.filter((row) => {
      const name = row?.initialUserData?.name?.toUpperCase() || '';
      const deviceId = row?.deviceId?.toUpperCase() || '';
      const searchText = searchTerm.toUpperCase();

      console.log(name);
      console.log(deviceId);

      return name.includes(searchText) || deviceId.includes(searchText);
    });

    console.log(filteredData);
    setEvents(filteredData);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      setSearchTerm('');
      setEvents(initialTable);
    }
  };

  const getCellStyle = (sensorType, stringValue) => {
    const value = parseInt(stringValue, 10) || 0;

    switch (sensorType) {
      case 'heartRate':
        if (value < 30 || value > 220) {
          return { color: '#FF5733' }; // red
        } else if (
          (value >= 30 && value < 45) ||
          (value > 160 && value <= 220)
        ) {
          return { color: '#FFA500' }; // orange
        } else if (
          (value >= 45 && value < 60) ||
          (value > 100 && value <= 160)
        ) {
          return { color: '#FFFF00' }; // yellow
        } else if (value >= 60 && value <= 100) {
          return { color: '#7CD6AB' }; // green
        }
        break;

      case 'bloodPressure':
        if (value < 60 || value > 260) {
          return { color: '#FF5733' }; // red
        } else if (
          (value >= 80 && value < 100) ||
          (value > 140 && value <= 180)
        ) {
          return { color: '#FFA500' }; // orange
        } else if (
          (value >= 100 && value < 110) ||
          (value > 130 && value <= 140)
        ) {
          return { color: '#FFFF00' }; // yellow
        } else if (value >= 110 && value <= 130) {
          return { color: '#7CD6AB' }; // green
        }
        break;

      case 'spo2':
        if (value < 50) {
          return { color: '#FF5733' }; // red
        } else if (value >= 50 && value < 75) {
          return { color: '#FFA500' }; // orange
        } else if (value >= 75 && value < 90) {
          return { color: '#FFFF00' }; // yellow
        } else if (value >= 90 && value <= 100) {
          return { color: '#7CD6AB' }; // green
        }
        break;

      default:
        return { color: 'inherit' };
    }
  };
  useEffect(() => {
    console.log('In sensor page');
    const login = async () => {
      try {
        setLoading(true); // Set loading to true when starting async process

        if (events.length <= 1) {
          // Use events.length instead of setEvents.length
          console.log('setevents 0');

          const response = await getDeviceIds(token);
          if (response.status === 200) {
            console.log(response.data.deviceDocuments);
            setEvents(response.data.deviceDocuments);
            setinitialTable(response.data.deviceDocuments);
            const deviceSet = new Set(response.data.devices.flat());
            const deviceList = [...deviceSet];
            devices = deviceList;
            setLoading(false); // Set loading to false after async process completes
          }
        }

        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);
        const mongodb = app.currentUser.mongoClient('mongodb-atlas');
        const collection = mongodb.db('test').collection('devices');

        const pipeline = [
          {
            $match: {
              $or: [
                { 'fullDocument.BreathRateSensor.value': 'bunn' },
                { 'fullDocument.VentilatonSensor.value': 'bunn' },
              ],
            },
          },
        ];

        events.forEach((update) => handleRealTimeUpdate(update));

        const changeStream = collection.watch(pipeline);
        for await (const change of changeStream) {
          console.log('Change detected:', change);

          if (devices.includes(change?.fullDocument?.deviceId)) {
            console.log('Device included, updating events');
            setEvents((prevEvents) => {
              const index = prevEvents.findIndex(
                (e) => e._id.toString() === change.documentKey._id.toString()
              );

              if (index !== -1) {
                const updatedEvents = [...prevEvents];
                updatedEvents[index].heartSensor =
                  change?.fullDocument.heartSensor;
                updatedEvents[index].OxygenSaturationSensor =
                  change?.fullDocument.OxygenSaturationSensor;
                updatedEvents[index].BloodPressureSensor =
                  change?.fullDocument.BloodPressureSensor;

                return updatedEvents;
              } else {
                return [...prevEvents, change.fullDocument];
              }
            });
          }
        }
        setLoading(false); // Set loading to false after async process completes
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false after async process completes
      }
    };

    login();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={24} />
        <span style={{ marginLeft: '10px' }}>Loading SensorPage...</span>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: '#7CD6AB',
          }}
        >
          <CircularProgress color='inherit' />
          {/* <span style={{ marginLeft: '10px' }}>Loading SensorPage...</span> */}
        </div>
      }
    >
      <div className='App'>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='dialog-title'
          aria-describedby='dialog-description'
          PaperProps={{ style: { borderRadius: 12, background: '#191c23' } }}
        >
          <DialogTitle
            id='dialog-title'
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Please Confirm
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <DialogContentText
              id='dialog-description'
              sx={{ textAlign: 'center' }}
            >
              Do you want to navigate to user details page
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              paddingBottom: '20px',
            }}
          >
            <CustomButton
              onClick={async () => {
                dispatch(setCurrentDevice(rowdata.deviceId));
                dispatch(setCurrentDeviceUserId(rowdata.currentUserId));
                await dispatch(setCurrentDeviceData(rowdata));
                console.log('rowdata', rowdata);
                if (rowdata?.ActivitySensor === '') {
                  toast.error('No Data found for the device');
                  handleClose();
                } else {
                  navigate(`/Default`, {
                    state: {
                      data: rowdata,
                    },
                  }); // Pass the row data as a prop
                }
              }}
              variant='contained'
              disabled={buttonLoader}
            >
              {buttonLoader ? (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress size={21} />
                </Box>
              ) : (
                'Yes'
              )}
            </CustomButton>
            <CustomButton onClick={handleClose} variant='outlined'>
              Cancel
            </CustomButton>
          </DialogActions>
        </Dialog>
        <Toaster toastOptions={{ duration: 4000 }} />
        {!!user && (
          <div className='App-header'>
            <div>
              <table
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.palette.secondary[300],
                  borderRadius: '16px',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: theme.palette.secondary[300],
                      borderRadius: '5px',
                      border: 'none',
                    }}
                  >
                    <td colSpan='5' style={{ borderRadius: '10px' }}>
                      <input
                        type='text'
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder='Search'
                        style={{
                          backgroundColor: theme.palette.secondary[400],
                          color: theme.palette.secondary.main,
                          border: '1px solid grey',
                          borderRadius: '10px',
                          padding: '0px 5px',
                          fontSize: '15px',
                          float: 'right',
                          lineHeight: '30px',
                          margin: '20px',
                        }}
                      />
                    </td>
                  </tr>
                  <tr
                    style={{
                      borderBottom: `1px solid ${theme.palette.secondary[400]}`,
                    }}
                  >
                    <td
                      style={{
                        color: 'grey',
                      }}
                    >
                      Device Id
                    </td>
                    <td
                      style={{
                        color: 'grey',
                      }}
                    >
                      User Name
                    </td>
                    <td
                      style={{
                        color: 'grey',
                      }}
                    >
                      Heart Rate
                    </td>
                    <td
                      style={{
                        color: 'grey',
                      }}
                    >
                      SP02
                    </td>
                    <td
                      style={{
                        color: 'grey',
                      }}
                    >
                      BP
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e, i) => (
                    <tr
                      style={{
                        cursor: 'pointer',
                        borderBottom: `1px solid ${theme.palette.secondary[300]}`,
                        color: theme.palette.secondary.main,
                      }}
                      key={i}
                      onClick={() => handleRowClick(e)}
                    >
                      <td
                        style={{
                          color: 'white',
                        }}
                      >
                        {e?.deviceId}
                      </td>
                      <td
                        style={{
                          color: 'white',
                        }}
                      >
                        {e?.initialUserData?.name || '---'}
                      </td>
                      <td
                        style={{ ...getCellStyle('heartRate', e?.heartSensor) }}
                      >
                        {e?.heartSensor || '---'} bpm
                      </td>
                      <td
                        style={{
                          ...getCellStyle('spo2', e?.OxygenSaturationSensor),
                        }}
                      >
                        {e?.OxygenSaturationSensor || '---'} %
                      </td>
                      <td
                        style={{
                          ...getCellStyle(
                            'bloodPressure',
                            e?.BloodPressureSensor
                          ),
                        }}
                      >
                        {e?.BloodPressureSensor || '---'} mmhg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default SensorPage;
