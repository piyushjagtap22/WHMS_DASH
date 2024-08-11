import React, { useEffect, useRef, useState } from 'react';
import '../../css/DefaultPage.css';
import { useLocation } from 'react-router-dom';
import { getDeviceIds } from '../../slices/adminApiSlice';
import MapboxMap from '../MapboxMap';
import { Box, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import * as Realm from 'realm-web';
import { Toaster } from 'react-hot-toast';
import { setLocation } from '../../slices/deviceSlice';
import SidebarNew from '../SideBarNew';
import Navbar from './Navbar';

const app = new Realm.App({ id: 'application-0-vdlpx' });

import { useCallback } from 'react';
import GraphsComp from '../GraphsComp';
import HistoryTab from '../HistoryTab';
import BodyFigure from '../BodyFigure';

const DefaultPage = (data) => {
  console.log('Default page is rerendering');
  const loading = useSelector((state) => state.loading.loading);
  const [latitude, setLatitude] = useState(23); // Initial latitude
  const [longitude, setLongitude] = useState(77); // Initial longitude
  const latitudeRef = useRef(latitude);
  const longitudeRef = useRef(longitude);
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState(0);
  const memoizedSetTabValue = useCallback((value) => {
    setTabValue(value);
  }, []);

  const { state: userData } = useLocation();

  const memoizedUserData = useMemo(() => userData, [userData]);

  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );

  // const [events, setEvents] = useState([]);

  const isNonMobile = useMediaQuery('(min-width: 600px)');

  // const memoizedUserId = useMemo(
  //   () => userData.currentUserId,
  //   [userData.data.currentUserId]
  // );

  // const mapboxMapMemo = useMemo(() => {
  //   return <MapboxMap />;
  // }, []);

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
                  <MapboxMap />
                  <GraphsComp />
                  <BodyFigure />
                </>
              ) : (
                <HistoryTab />
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default DefaultPage;
