import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FlexBetween from '../FlexBetween';
import "../Pages/Tabnavigation.css"
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const Tabsnavigation = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  


  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

 
  
 

  return (
      <Box component='nav'>
        {isSidebarOpen && (
          <Drawer
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            variant='persistent'
            anchor='left'
            sx={{
              width: drawerWidth,
              '& .MuiDrawer-paper': {
                color: theme.palette.secondary[200],
                backgroundColor:  theme.palette.background.alt,
                boxSixing: 'border-box',
                borderWidth: isNonMobile ? 0 : '2px',
                width: drawerWidth,
                
              },
            }}>

           <Box width='100%' sx={{
            backgroundColor: '#191C23',
            boxSixing: 'border-box',
            borderRadius: '10%'
           }}>
              <Box m='1rem'>
                <FlexBetween color={theme.palette.secondary.main}>

                    <Box sx={{ width: '100%', typography: 'body1'}}>
                          <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                              <TabList onChange={handleChange} aria-label="lab API tabs example" sx={{ padding: '5px !important' }}>
                                <Tab label="Item One" value="1" />
                                <Tab label="Item Two" value="2" />
                                
                              </TabList>
                            </Box>
                            <TabPanel value="1">

                            <FlexBetween
                                textTransform='none'
                              >
                                <Box
                                  component='img'
                                  alt='profile'
                                  src={"https://qph.cf2.quoracdn.net/main-qimg-a9dacf4f48286b8dd6d9f4e3f2e42f35"}
                                  height='70px'
                                  width='60px'
                                
                                  borderRadius='50%'
                                  sx={{ objectFit: 'cover' }}
                    />
                    
                    
                    </FlexBetween>
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Name <br></br> 
                    <span className='sidebarvalues'>Amitabh Bacchan</span>
                    </p>

                    </Box>
                    
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Device ID <br></br> 
                    <span className='sidebarvalues'>WHMS-XX-203988</span>
                    </p>

                    </Box>


                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Phone number <br></br> 
                    <span className='sidebarvalues'>9406928294</span>
                    </p>

                    </Box>

                    <div style={{width: "100%", height: "100%", border: "1px #47494F solid"}}></div>
                   

                  <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '100%'}}>
                      <p className='firstnames'>Environment <br></br> 
                      <span className='sidebarvalues'>Space</span>
                    </p>

                    </Box>

                    
                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                          Age
                        <br></br> 
                        <span className='sidebarvalues'>45</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '50%',float: 'right'}}>
                      <p className='firstnames'>
                          Weight
                        <br></br> 
                        <span className='sidebarvalues'>72</span>
                      </p>
                    </Box>
                      
                    </Box>


                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                          Height
                        <br></br> 
                        <span className='sidebarvalues'>169 cm</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '49%',float: 'right'}}>
                      <p className='firstnames'>
                          Gender
                        <br></br> 
                        <span className='sidebarvalues'>Male</span>
                      </p>
                    </Box>
                    </Box>

                  </Box>

 
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Device Status <br></br> 
                    <span className='sidebarvalues'>ACtive</span>
                    </p>

                    </Box>
                    
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Admin <br></br> 
                    <span className='sidebarvalues'>Harsh Bunny</span>
                    </p>

                    </Box>


                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Department <br></br> 
                    <span className='sidebarvalues'>ISRO SPACE</span>
                    </p>

                    </Box>
                   
                    <div style={{width: "100%", height: "100%", border: "1px #47494F solid"}}></div>


                    
                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Problems<br></br> 
                    <span className='sidebarvalues'>Hypertention, High blood Pressure</span>
                    </p>

                    </Box>

                    
                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                        Allergies

                        <br></br> 
                        <span className='sidebarvalues'>Dust</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '50%',float: 'right'}}>
                      <p className='firstnames'>
                          Insured
                        <br></br> 
                        <span className='sidebarvalues'>Yes</span>
                      </p>
                    </Box>
                      
                    </Box>


                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                      Max heart rate
                        <br></br> 
                        <span className='sidebarvalues'>150 BPM</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '49%',float: 'right'}}>
                      <p className='firstnames'>
                      Min heart rate
                        <br></br> 
                        <span className='sidebarvalues'>60 BPM</span>
                      </p>
                    </Box>
                    </Box>

                  </Box>
                   



                  </TabPanel>

                          <TabPanel value="2">Item Two</TabPanel>
                          
                            {/* <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href="/">
                              MUI
                            </Link>
                            <Link
                              underline="hover"
                              color="inherit"
                              href="/material-ui/getting-started/installation/"
                            >
                              Core
                            </Link>
                            <Typography color="text.primary">Breadcrumbs</Typography>
                          </Breadcrumbs> */}

                          </TabContext>
                        </Box>


                  

                  {!isNonMobile && (
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                      <ChevronLeft />
                    </IconButton>
                  )}
                </FlexBetween>
              </Box>
              <List>

              </List>
            </Box>
    
        
           
          </Drawer>
        )}
      </Box>
  );
};

export default Tabsnavigation;


