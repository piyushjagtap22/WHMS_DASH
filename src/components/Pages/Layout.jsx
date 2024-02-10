import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from '../SideBar';
// import header from './oldHeader'; // Old Header file
// import { useGetUserQuery } from "state/api";

const Layout = () => {
  console.log('in layout');
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {state: userData} = useLocation()
  console.log("sidebar", userData);
  // const userId = useSelector((state) => state.global.userId);
  // const { data } = useGetUserQuery(userId);
  const data = useSelector((state) => state.auth.AuthUser);
  console.log("sidebar1", data);

  return (
    <Box display={isNonMobile ? 'flex' : 'block'} width='100%' height='100%'>
      <Sidebar
        user={userData   || {}}
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
        <Outlet/>
      </Box>
    </Box>
  );
};

export default Layout;
