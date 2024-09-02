import React, { useState, lazy, Suspense } from 'react';
import '../../css/DefaultPage.css';
import { useLocation } from 'react-router-dom';

import { Box, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import { Toaster, toast } from 'react-hot-toast';
import SidebarNew from '../SideBarNew';
import Navbar from '../Navbar';
const BodyFigure = lazy(() => import('../BodyFigure'));
const MapboxMap = lazy(() => import('../MapboxMap'));

import { useCallback } from 'react';
const GraphsComp = lazy(() => import('../GraphsComp'));

const HistoryTab = lazy(() => import('../HistoryTab'));
import { useLayoutEffect } from 'react';
const DefaultPage = (data) => {
  useLayoutEffect(() => {
    toast.dismiss(); // Dismiss any previous toasts
  }, []);
  console.log('Default page is rerendering');
  const loading = useSelector((state) => state.loading.loading);

  const [tabValue, setTabValue] = useState(0);
  const memoizedSetTabValue = useCallback((value) => {
    'History clicked';
    setTabValue(value);
  }, []);

  const { state: userData } = useLocation();
  const memoizedUserData = useMemo(() => userData, [userData]);
  const isNonMobile = useMediaQuery('(min-width: 600px)');
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
                  <Suspense fallback={<Loader />}>
                    <MapboxMap />
                  </Suspense>
                  <Suspense fallback={<Loader />}>
                    <GraphsComp />
                  </Suspense>

                  <Suspense fallback={<Loader />}>
                    <BodyFigure />
                  </Suspense>
                </>
              ) : (
                <Suspense fallback={<Loader />}>
                  <HistoryTab />
                </Suspense>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default DefaultPage;
