import React, { useEffect, useState } from 'react';
import FlexBetween from '../FlexBetween';
import Header from '../Header';
import * as Realm from 'realm-web';
import {
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { useGetUserQuery } from "state/api";
import {
  getAllUsers,
} from './../../slices/superAdminApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const app = new Realm.App({ id: 'sensor_realtimedb-ujgdc' });

const Dashboard = () => {
  const [data, setUsers] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const { userInfo } = useSelector((state) => state.superAdmin);
  const token = useSelector(
    (state) => state.auth.AuthUser.stsTokenManager.accessToken
  );
  const [user, setUser] = useState();
  const [events, setEvents] = useState([]);
  const [realTimeData, setRealTimeData] = useState([]);
  const [newRealTimeData, setNewRealTimeData] = useState([]);

  // const {data } = useGetUserQuery();
  console.log(userInfo + 'userInfo');

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getAllUsers(token);
        // console.log(response + 'R ');
        if (response.status === 200) {
          // Add a unique id property to each row
          const rowsWithId = response.data.map((row) => ({
            ...row,
            id: row._id, // Assuming _id is a unique identifier
          }));
          setUsers(rowsWithId);
          setRealTimeData(rowsWithId);
          // console.log(response.data);
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        // Handle any network or API request errors
        console.log(error);
      }
    };
    fetchData();
    const login = async () => {
      try {
        const mongodb = app.currentUser.mongoClient('mongodb-atlas');
        const collection = mongodb.db('test').collection('realtimesensordocs');
        const changeStream = collection.watch();
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);

        // Set up a change stream with a filter on the sensor_id field
        // const pipeline = [
        //   {
        //     $match: {
        //       'fullDocument.sensor_id': '233', // Change 'sensor_id' to the actual field name
        //     },
        //   },
        // ];

        // const changeStream = collection.watch();
        // console.log(changeStream);
        for await (const change of changeStream) {
          console.log(change);
          setNewRealTimeData((prevData) => {
            const index = prevData.findIndex(
              (item) => item._id === change.documentKey._id.toString()
            );

            const realTimeUpdate = {
              _id: change.documentKey._id.toString(),
              heartSensor: change.fullDocument.heartSensor.value,
              timeStamp: change.fullDocument.heartSensor.timeStamp,
            };

            setRealTimeData((prevData) => {
              const index = prevData.findIndex(
                (item) => item._id === realTimeUpdate._id
              );

              if (index !== -1) {
                const updatedData = [...prevData];
                updatedData[index] = realTimeUpdate;
                return updatedData;
              } else {
                // If the data for this item doesn't exist in the previous state, add it
                return [...prevData, realTimeUpdate];
              }
            });

            // Return the updated events array
            return prevData; // Corrected from prevEvents to prevData
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    login();
  }, [dispatch, token, realTimeData]); // Add changeStream and realTimeData to the dependency array

  const columns = [
    {
      field: '_id',
      headerName: 'Device ID',
      flex: 0.5,
    },
    {
      field: 'name',
      headerName: 'User',
      flex: 0.4,
    },
    {
      field: 'heartSensor',
      headerName: 'Heart Sensor',
      flex: 0.4,
      valueGetter: (params) => {
        // Get the real-time value from the state based on _id
        const realTimeValue = realTimeData.find(
          (item) => item._id === params.row._id
        );

        // Display the real-time value if available, else display the default value
        return realTimeValue
          ? realTimeValue.heartSensor
          : params.row.heartSensor.value;
      },
    },
    // {
    //   field: 'timeStamp',
    //   headerName: 'Time Stamp',
    //   flex: 0.4,
    //   valueGetter: (params) => {
    //     // Get the real-time value from the state based on _id
    //     const realTimeValue = realTimeData.find(
    //       (item) => item._id === params.row._id
    //     );

    //     // Display the real-time value if available, else display the default value
    //     return realTimeValue
    //       ? realTimeValue.timeStamp
    //       : params.row.heartSensor.timeStamp;
    //   },
    // },
    {
      field: 'email',
      headerName: 'email',
      flex: 0.4,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 0.4,
    },
    {
      field: 'profile_exist',
      headerName: 'Profile exist',
      flex: 0.4,
    },
    {
      field: 'roles',
      headerName: 'Role',
      flex: 0.3,
    },
    {
      field: 'role',
      headerName: 'BP',
      flex: 0.3,
    },
  ];

  const labels = ['jan', 'feb', 'Mar', 'Apr', 'May', 'Jun', 'jul'];

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: theme.palette.primary[600],
        },
        ticks: {
          callback: (value) => {
            if (value === 0) return value;
            return value + 'M';
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
  };

  const data2 = {
    labels,
    datasets: [
      {
        label: 'React',
        data: [32, 42, 51, 37, 51, 65, 40],
        backgroundColor: 'green',
        borderColor: 'green',
      },
      {
        label: 'Angular',
        data: [37, 42, 41, 50, 31, 44, 40],
        backgroundColor: '#F44236',
        borderColor: '#F44236',
      },
    ],
  };

  return (
    <>
      <Box m='1.5rem 2.5rem'>
        <FlexBetween>
          <Header title='DASHBOARD' subtitle='Welcome to your dashboard' />

          {/* <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
        </FlexBetween>

        <Box
          mt='20px'
          display='grid'
          gridTemplateColumns='repeat(12, 1fr)'
          gridAutoRows='160px'
          gap='20px'
          sx={{
            '& > div': {
              gridColumn: isNonMediumScreens ? undefined : 'span 12',
            },
          }}
        >
          {/* ROW 1 */}

          

          {/* ROW 2 */}
          <Box
            gridColumn='span 12'
            gridRow='span 4'
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
                borderRadius: '5rem',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderBottom: 'none',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: theme.palette.background.alt,
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderTop: 'none',
              },
              '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                color: `${theme.palette.secondary[200]} !important`,
              },
            }}
          >
            <DataGrid rows={data || []} columns={columns} />
          </Box>
        </Box>
        {/* <LineChart width={600} height={300} data={data1}>
      <Line type="monotone" dataKey="react" stroke="#2196F3" strokeWidth={4} />

      <Line type="monotone" dataKey="vue" stroke="#FFCA29" strokeWidth={4} />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis dataKey="" />
      <Tooltip />
      <Legend />
    </LineChart> */}
      </Box>
      <div className='App'>
        Sensor Data
        {!!user && (
          <div className='App-header'>
            <h1>Connected as user {user.id}</h1>
            <div>
              <p>Latest events:</p>
              <table>
                <thead>
                  <tr>
                    <td>Operation</td>
                    <td>Document Key</td>
                    <td>Full Document</td>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e, i) => (
                    <tr key={i}>
                      <td>{e.operationType}</td>
                      <td>{e.documentKey._id.toString()}</td>
                      <td>{JSON.stringify(e.fullDocument)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
