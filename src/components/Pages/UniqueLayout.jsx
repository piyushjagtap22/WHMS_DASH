import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Tabsnavigation from './Tabsnavigation';
import { useLocation } from 'react-router-dom';

const UniqueLayout = () => {
    // const { userData } = props;
    const isNonMobile = useMediaQuery('(min-width: 600px)');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const {state: userData} = useLocation()
    // const userId = useSelector((state) => state.global.userId);
    // const { data } = useGetUserQuery(userId);
    const data = useSelector((state) => state.auth.AuthUser);
    console.log(data);
    console.log("Unique Layout",userData)

  return (
    <Box display={isNonMobile ? 'flex' : 'block'} width='100%' height='100%'>
      <Tabsnavigation
        user={userData || {}}
        isNonMobile={isNonMobile}
        drawerWidth='250px'
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          user={data || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  )
}

export default UniqueLayout;