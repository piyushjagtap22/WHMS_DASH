import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Suspense } from 'react';
import {
  setCurrentDeviceData,
  setCurrentDeviceUserId,
} from '../slices/deviceSlice.js';

import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Realm from 'realm-web';
import { getDeviceIds } from '../../src/slices/adminApiSlice';
import { setCurrentDevice } from '../slices/deviceSlice.js';
import CustomButton from './Button.jsx';
const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });

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

  // const handleRowClick = (data) => {
  //   setOpen(true);
  //   setData(data);
  // };

  const willSetData = (data) => {
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

    const filteredData = initialTable.filter((row) => {
      const name = row?.initialUserData?.name?.toUpperCase() || '';
      const deviceId = row?.deviceId?.toUpperCase() || '';
      const searchText = searchTerm.toUpperCase();

      return name.includes(searchText) || deviceId.includes(searchText);
    });

    setEvents(filteredData);
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
          color: '#7CD6AB',
        }}
      >
        <CircularProgress color='inherit' />
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
        </div>
      }
    >
      <div className='App'>
        {/* <Dialog
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
        </Dialog> */}
        <Toaster toastOptions={{ duration: 4000 }} />
        {!!user && (
          <div className='App-header'>
            <div>
              <table
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: "#121318",
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
                        height: '40px', // Adjusted height
                      }}
                    >
                      <td colSpan="5" style={{ borderRadius: '10px' }}>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          placeholder=" Search"
                          style={{
                            backgroundColor: "#1c1c1c",
                            color: theme.palette.secondary.main,
                            border: '1px solid grey',
                            borderRadius: '10px',
                            padding: searchTerm ? '0px 5px' : '0px 5px 0px 30px',
                            fontSize: '14px',
                            float: 'right',
                            lineHeight: '28px', // Adjusted line height
                            margin: '10px', // Adjusted margin
                            backgroundImage: searchTerm
                              ? 'none'
                              : `url('data:image/svg+xml,%3Csvg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M13.3496 13.3559C13.2563 13.4478 13.1306 13.4994 12.9996 13.4996C12.8668 13.499 12.7393 13.4476 12.6434 13.3559L9.94336 10.6496C8.80622 11.6047 7.34425 12.084 5.86236 11.9874C4.38046 11.8908 2.99306 11.2259 1.98951 10.1313C0.985965 9.03661 0.443754 7.59681 0.475967 6.11212C0.508179 4.62743 1.11233 3.21249 2.16241 2.16241C3.21249 1.11233 4.62743 0.508179 6.11212 0.475967C7.59681 0.443754 9.03661 0.985965 10.1313 1.98951C11.2259 2.99306 11.8908 4.38046 11.9874 5.86236C12.084 7.34426 11.6047 8.80623 10.6496 9.94336L13.3496 12.6434C13.3969 12.6899 13.4344 12.7453 13.46 12.8065C13.4856 12.8677 13.4988 12.9333 13.4988 12.9996C13.4988 13.0659 13.4856 13.1316 13.46 13.1927C13.4344 13.2539 13.3969 13.3093 13.3496 13.3559ZM6.24961 10.9996C7.18907 10.9996 8.10743 10.721 8.88857 10.1991C9.6697 9.67715 10.2785 8.9353 10.638 8.06736C10.9976 7.19941 11.0916 6.24434 10.9083 5.32293C10.7251 4.40152 10.2727 3.55515 9.60837 2.89085C8.94407 2.22655 8.0977 1.77416 7.17629 1.59088C6.25488 1.4076 5.29981 1.50166 4.43186 1.86118C3.56391 2.2207 2.82206 2.82952 2.30013 3.61065C1.77819 4.39178 1.49961 5.31015 1.49961 6.24961C1.50126 7.50888 2.00224 8.7161 2.89268 9.60654C3.78312 10.497 4.99034 10.998 6.24961 10.9996Z" fill="white" fill-opacity="0.2"/%3E%3C/svg%3E')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: '10px center',
                            backgroundSize: '16px 16px',
                            '::placeholder': {
                              color: 'rgba(255, 255, 255, 0.2)', // White color with 20% opacity
                            },
                          }}
                        />
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: `1px solid ${theme.palette.secondary[400]}`,
                      }}
                    >
                      <td style={{ color: 'grey' }}>Device Id</td>
                      <td
                        style={{
                          color: 'grey',
                          borderRight: `1px solid ${theme.palette.secondary[300]}`, // Add vertical line after this column
                        }}
                      >
                        User Name
                      </td>
                      <td style={{ color: 'grey' }}>Heart Rate</td>
                      <td style={{ color: 'grey' }}>SP02</td>
                      <td style={{ color: 'grey' }}>BP</td>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length > 0 ? (
                      events.map((e, i) => (
                        <tr
                          style={{
                            cursor: 'pointer',
                            borderBottom: `1px solid ${theme.palette.secondary[300]}`,
                            color: theme.palette.secondary.main,
                          }}
                          key={i}
                          onClick={async () => {
                            console.log('trying hard');
                            willSetData(e);
                            dispatch(setCurrentDevice(e?.deviceId));
                            dispatch(setCurrentDeviceUserId(e?.currentUserId));
                            await dispatch(setCurrentDeviceData(e));
                            console.log('rowdata', e);
                            if (e?.ActivitySensor === '') {
                              toast.error('No Data found for the device');
                              handleClose();
                            } else {
                              navigate(`/Default`, {
                                state: {
                                  data: e,
                                },
                              });
                            }
                          }}
                        >
                          <td style={{ color: 'white' }}>{e?.deviceId}</td>
                          <td
                            style={{
                              color: 'white',
                              borderRight: `1px solid ${theme.palette.secondary[300]}`, // Apply vertical line to body
                            }}
                          >
                            {e?.initialUserData?.name || '---'}
                          </td>
                          <td style={{ ...getCellStyle('heartRate', e?.heartSensor) }}>
                            {e?.heartSensor || '---'} bpm
                          </td>
                          <td style={{ ...getCellStyle('spo2', e?.OxygenSaturationSensor) }}>
                            {e?.OxygenSaturationSensor || '---'} %
                          </td>
                          <td
                            style={{
                              ...getCellStyle('bloodPressure', e?.BloodPressureSensor),
                            }}
                          >
                            {e?.BloodPressureSensor || '---'} mmhg
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'white' }}>
                          No Devices found
                        </td>
                      </tr>
                    )}
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
