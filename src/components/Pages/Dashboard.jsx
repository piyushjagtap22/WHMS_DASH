import React, { useEffect, useState, lazy, Suspense } from 'react';
import FlexBetween from '../FlexBetween';
import * as Realm from 'realm-web';
import { Box } from '@mui/material';
import Loader from '../Loader';
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
import { Toaster, toast } from 'react-hot-toast';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { useLayoutEffect } from 'react';

const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
import { useDispatch, useSelector } from 'react-redux';

const SensorPage = lazy(() => import('../sensorPage'));
const Dashboard = () => {
  useLayoutEffect(() => {
    toast.dismiss(); // Dismiss any previous toasts
  }, []);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.superAdmin);
  const [realTimeData, setRealTimeData] = useState([]);
  const [newRealTimeData, setNewRealTimeData] = useState([]);

  console.log(userInfo + 'userInfo');
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );

  useEffect(() => {
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
      <Toaster toastOptions={{ duration: 4000 }} />
      <Box m='1.5rem 2.5rem'>
        <Suspense fallback={<Loader />}>
          <FlexBetween />
          <SensorPage />
        </Suspense>
      </Box>
    </>
  );
};

export default Dashboard;
