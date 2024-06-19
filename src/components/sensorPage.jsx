import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import { useNavigate } from 'react-router-dom';
import {
  getDeviceIds,
  // docById
} from '../../src/slices/adminApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
const app = new Realm.App({ id: 'application-0-vdlpx' });

const SensorPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  const [user, setUser] = useState();
  const [rowdata, setData] = useState([]);
  var devices = [];
  // setDeviceList((prevDeviceList) => [...prevDeviceList, newDevice]);
  const [events, setEvents] = useState([]);
  const handleRowClick = (data) => {
    console.log(data);
    toast('Hello World', {
      duration: 4000,
      position: 'top-center',

      // Styling
      style: {
        left: '0px',
        right: '0px',
        display: 'flex',
        position: 'absolute',
        transition: 'all 230ms cubic-bezier(0.21, 1.02, 0.73, 1) 0s',
        transform: 'translateY(34.179px)',
        top: '0px',
        justifyContent: 'center',
        zIndex: '9999',
      },
      className: '',

      // Custom Icon
      icon: '👏',

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: '#000',
        secondary: '#fff',
      },

      // Aria
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });
    toast.success('Hey There', { duration: 4000 });
    toast.custom(
      <div>
        Do you want to Navigate to User details Page
        <button
          onClick={() => {
            navigate(`/Default`, {
              state: {
                data: data,
              },
            }); // Pass the row data as a prop
          }}
        >
          OK
        </button>
        <button>Cancel</button>
      </div>
    );
    const result = window.confirm(
      'Do you want to Navigate to User details Page'
    );

    if (result) {
      navigate(`/Default`, {
        state: {
          data: data,
        },
      }); // Pass the row data as a prop
    } else {
    }
  };
  // Function to handle real-time updates
  const handleRealTimeUpdate = (updatedObject) => {
    setData((prevData) => {
      const updatedData = prevData.map((obj) => {
        console.log('updatedObject', updatedObject);
        if (obj._id === updatedObject._id) {
          // If the _id matches, update BreathRateSensor and VentilatonSensor values

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
  // const [user, setUser] = useState();

  //Table Searching
  const handleSearchChange = (eve) => {
    setSearchTerm(eve.target.value);

    console.log('THIS IS SEARCH', searchTerm);

    if (searchTerm.length >= 2) {
      console.log('search runinnh');
      const filteredData = events.filter((row) => {
        return row?.initialUserData?.name
          ?.toUpperCase()
          .includes(searchTerm.toUpperCase());
      });
      // const filteredData = row?.name?.toUpperCase().includes(searchTerm.toUpperCase()) || row?.email?.toUpperCase().includes(searchTerm.toUpperCase())
      // setUsers(filteredData);
      setEvents(filteredData);
      console.log('filtered data', filteredData);
    } else {
      // Reset to original data when empty search term
      // console.log('arijit da', initialTable);
      setEvents(initialTable);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      console.log('keydown working');
      setSearchTerm('');
      // setUsers(initialTable);
      setEvents(initialTable);
    }
  };

  const getCellStyle = (stringValue) => {
    const value = parseInt(stringValue, 10) || 0;
    if (value > 80) {
      return { color: 'red' };
    } else if (value > 70) {
      return { color: 'orange' };
    } else {
      return { color: 'green' };
    }
  };

  useEffect(() => {
    const login = async () => {
      try {
        console.log(setEvents.length);
        if (setEvents.length <= 1) {
          // const token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjdjZjdmODcyNzA5MWU0Yzc3YWE5OTVkYjYwNzQzYjdkZDJiYjcwYjUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQURNSU4iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd2htcy1hdXRoLTdlZDRiIiwiYXVkIjoid2htcy1hdXRoLTdlZDRiIiwiYXV0aF90aW1lIjoxNzA1NDI5ODQ2LCJ1c2VyX2lkIjoicUFDbFFEVU9ZdE15MjZ5VHRzMHlncXFBQzZvMSIsInN1YiI6InFBQ2xRRFVPWXRNeTI2eVR0czB5Z3FxQUM2bzEiLCJpYXQiOjE3MDU0Mjk4NDYsImV4cCI6MTcwNTQzMzQ0NiwiZW1haWwiOiJhd2FzdGhpLmFyeWEwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfbnVtYmVyIjoiKzkxOTcxMzM3NjYxNiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXdhc3RoaS5hcnlhMDRAZ21haWwuY29tIl0sInBob25lIjpbIis5MTk3MTMzNzY2MTYiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Ou2WVNCjpgw36LYKOGKlf9VGpvlXaoxSfLQlXalsCKAzRG-uIn5xDzYaiNUKR3dZy9S66ZNEdGm36BQnRqm67wZjxbJukD-t-2fchPQPfttshEqO5_kxvKcq8NTYJzamEBysbGZca2cr2ajce_4e__EhVCv_Fn5JSUWUQf8YrfLsnYp41qkFBVD5oCf5SlVdgA0R8UCGzUokYTZSBRkleWrS4UysEjQhcIMaAEA8iaGaFdwTVO1nPVIoKy74r9ZBoaualbEn3eKfOhXLTK86BzdsGzX4krMSsTEfk5EjN47XFKov2fVhpceUTt0xnnMxYPemBQEJ1ggDtyw6wRADTg"

          const response = await getDeviceIds(token);
          if (response.status === 200) {
            console.log('Chalao');
            console.log('Device id data response', response.data);
            setEvents(response.data.deviceDocuments);
            setinitialTable(response.data.deviceDocuments);
            const bunnySet = new Set(response.data.devices.flat());
            const bunnyList = [...bunnySet];
            // Now, bunnyList contains unique values from the nested arrays
            devices = bunnyList;
          }
        }
        // setEvents(response.data.deviceDocuments)
        console.log('list of devices--> Outside', devices);
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);
        const mongodb = app.currentUser.mongoClient('mongodb-atlas');
        // const collection = mongodb.db('test').collection('someCollection');
        // const collection = mongodb.db('test').collection('devic/es');
        const collection = mongodb.db('test').collection('devices');

        const pipeline = [
          {
            $match: {
              $or: [
                { 'fullDocument.BreathRateSensor.value': 'bunn' },
                { 'fullDocument.VentilatonSensor.value': 'bunn' },
                // Add more conditions as needed
              ],
            },
          },
        ];
        events.forEach((update) => handleRealTimeUpdate(update));

        const changeStream = collection.watch(pipeline);
        console.log(changeStream);
        for await (const change of changeStream) {
          console.log('this is change', change);

          console.log('list of devices--> --> Inside', devices);

          if (devices.includes(change?.fullDocument?.deviceId)) {
            console.log('has this value proccing to other things');
            setEvents((prevEvents) => {
              // Find the index of the changed document in the events array
              console.log('this is change', change?.fullDocument?.deviceId);
              console.log('this is previous', change?.fullDocument?.deviceId);

              const index = prevEvents.findIndex(
                (e) => e._id.toString() === change.documentKey._id.toString()
              );

              // If the document is found, update the specific cell content
              if (index !== -1) {
                const updatedEvents = [...prevEvents];
                console.log('first', updatedEvents[index]);
                updatedEvents[index].heartSensor =
                  change?.fullDocument.heartSensor;
                updatedEvents[index].BreathRateSensor =
                  change?.fullDocument.BreathRateSensor;
                updatedEvents[index].VentilatonSensor =
                  change?.fullDocument.VentilatonSensor;
                // updatedEvents[index] = change.fullDocument;
                console.log('format kharab ni hone diya', updatedEvents[index]);

                return updatedEvents;
              } else {
                return [...prevEvents, change.fullDocument];
              }
            });
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
    <div className='App'>
      <Toaster toastOptions={{ duration: 4000 }} />
      {!!user && (
        <div className='App-header'>
          <div>
            <table
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: theme.palette.background.alt,
                borderRadius: '1px',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: theme.palette.secondary[300],
                    borderRadius: '5px',
                    border: 'none',
                    marginBottom: '5px',
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
                        margin: '8px',
                      }}
                    />
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: `1px solid ${theme.palette.secondary[400]}`,
                  }}
                >
                  <td>Device</td>
                  <td
                    style={{
                      borderRight: `1px solid ${theme.palette.secondary[400]}`,
                    }}
                  >
                    Admin Id
                  </td>
                  <td>Heart Rate</td>
                  <td>ECG Sensor</td>
                  <td>BP Sensor</td>
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
                    <td style={{}}>{e?.deviceId}</td>
                    <td
                      style={{
                        borderRight: `1px solid ${theme.palette.secondary[400]}`,
                      }}
                    >
                      {e?.initialUserData?.name || '---'}
                    </td>
                    <td style={{ ...getCellStyle(e?.heartSensor) }}>
                      {e?.heartSensor || '---'} bpm
                    </td>
                    <td style={{ ...getCellStyle(e?.BreathRateSensor) }}>
                      {e?.BreathRateSensor || '---'} bpm
                    </td>
                    <td style={{ ...getCellStyle(e?.VentilatonSensor) }}>
                      {e?.VentilatonSensor || '---'} mmhg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorPage;
