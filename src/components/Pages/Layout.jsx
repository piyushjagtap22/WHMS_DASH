import React, { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './Navbar'
import Sidebar from '../SideBar'
<<<<<<< Updated upstream
import Header from './Header'

=======
import Header from "./Header"
>>>>>>> Stashed changes

const Layout = () => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%"> 
    <Sidebar
    isNonMobile = {isNonMobile}
    drawerWidth="250px"
    isSideBarOpen={isSideBarOpen}
    setIsSideBarOpen={setIsSideBarOpen}
    />
      <Box>
        <Navbar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        />
<<<<<<< Updated upstream
        <Header/>
=======
        <Header />
>>>>>>> Stashed changes
        <Outlet/>
      </Box>
    </Box>
  )
}

export default Layout
