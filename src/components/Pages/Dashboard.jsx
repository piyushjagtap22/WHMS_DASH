import React, { useEffect, useState } from 'react';
import FlexBetween from '../FlexBetween';
import Header from '../Header';
import * as Realm from 'realm-web';
// import MapComponent from '../MapComponent';
import { ToastContainer, toast } from 'react-toastify';

import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from '@mui/icons-material';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { useGetUserQuery } from "state/api";
import { getAllUsers } from './../../slices/superAdminApiSlice';
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
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';

const Dashboard = () => {
  const [data, setUsers] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const { userInfo } = useSelector((state) => state.superAdmin);
  // const token = useSelector(
  //   (state) => state.auth.AuthUser.stsTokenManager.accessToken
  // );
  const [user, setUser] = useState();
  const [events, setEvents] = useState([]);
  const [realTimeData, setRealTimeData] = useState([]);
  const [newRealTimeData, setNewRealTimeData] = useState([]);

  // const {data } = useGetUserQuery();
  console.log(userInfo + 'userInfo');
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );

  const [initialTable, setinitialTable] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    console.log('THIS IS SEARCH', searchTerm);

    if (searchTerm.length >= 2) {
      const filteredData = data.filter((row) => {
        return (
          row?.name?.toUpperCase().includes(searchTerm.toUpperCase()) ||
          row?.email?.toUpperCase().includes(searchTerm.toUpperCase())
        );
      });
      // const filteredData = row?.name?.toUpperCase().includes(searchTerm.toUpperCase()) || row?.email?.toUpperCase().includes(searchTerm.toUpperCase())
      setUsers(filteredData);
      console.log('filtered data', filteredData);
    } else {
      console.log('reset horha h ');
      setUsers(initialTable); // Reset to original data when empty search term
      console.log('arijit da', initialTable);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      console.log('keydown working');
      setSearchTerm('');
      setUsers(initialTable);
    }
  };

  // // const {data } = useGetUserQuery();
  // console.log(userInfo + "userInfo");
  // console.log("bunny",searchTerm)
  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getAllUsers(token);
        console.log(response + 'R ');
        if (response.status === 200) {
          setUsers(response.data);
          setinitialTable(response.data);
          console.log('bunny', response.data);
          console.log('bunny crazy', typeof response.data);
        } else {
          // Handle any errors or show a message
          console.log('Something Went Wrong');
        }
      } catch (error) {
        // Handle any network or API request errors
        console.log(error);
      }
    };
    fetchData();
    const login = async () => {
      try {
        // Log in anonymously
        const user = await app.logIn(Realm.Credentials.anonymous());

        if (user) {
          // Successfully logged in, proceed with MongoDB client setup
          const mongodb = user.mongoClient('mongodb-atlas');
          const collection = mongodb.db('test').collection('devices');

          // Set up change stream and handle real-time updates
          const changeStream = collection.watch();
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
            console.log('Change Stream Event:', change);

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
                  return [...prevData, realTimeUpdate];
                }
              });

              // Return the updated events array
              return [...prevData, realTimeUpdate];
            });
          }
        } else {
          console.log('User not logged in');
          // Handle the case when the user is not logged in
        }
      } catch (error) {
        console.log('Error during login:', error);
        // Handle login errors
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
        return realTimeValue && realTimeValue.heartSensor
          ? realTimeValue.heartSensor.value
          : params.row.heartSensor?.value || '';
      },
    },
    {
      field: 'timeStamp',
      headerName: 'Time Stamp',
      flex: 0.4,
      valueGetter: (params) => {
        // Get the real-time value from the state based on _id
        const realTimeValue = realTimeData.find(
          (item) => item._id === params.row._id
        );

        // Display the real-time value if available, else display the default value
        return realTimeValue
          ? realTimeValue.timeStamp
          : params.row.heartSensor.timeStamp;
      },
    },
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
            <DataGrid
              rows={data || []}
              columns={columns}
              getRowId={(row) => row._id}
            />
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
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder='Search...'
        />
        {/* <DataGrid
          rows={data || []}
          columns={columns}
          checkboxSelection
          getRowId={(row) => row._id} // Provide a function to generate unique IDs
          filter={{
            global: searchTerm,
          }}
          initialState={{
            pinnedColumns: {
              left: ['_id'],
            },
          }}
        /> */}

        {/* <DataGrid
                columns={columns}
                rows={data}
                filter={{
                  global: searchTerm,
                }}
              /> */}
      </Box>
    </>
  );
};

export default Dashboard;
