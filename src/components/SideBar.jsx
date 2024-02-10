import React from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';


import {
  Box,
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
import FlexBetween from './FlexBetween';
import profileImage from '../assets/profile.jpeg';

const navItems = [
  {
    text: 'Dashboard',
    icon: <HomeOutlined />,
  },
  {
    text: 'Default',
    icon: <ShoppingCartOutlined />,
  },
  {
    text: 'superadmin',
    icon: <Groups2Outlined />,
  },
  {
    text: 'Privacy & Security',
    icon: <ReceiptLongOutlined />,
  },
];


const Sidebar = ({
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
const location = useLocation();
const [value, setValue] = React.useState('1');
console.log("location" ,location.pathname);



  useEffect(() => {
    setActive(pathname.substring(1));

  }, [pathname]);

  return (<>
    {location.pathname === "/dashboard" ? <><Box component='nav'>
    {isSidebarOpen && (
      <Drawer 
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant='persistent'
        anchor='left'
        overflowY = 'hidden'
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            color: theme.palette.secondary[200],
            backgroundColor: theme.palette.background.alt,
            borderRight : `solid ${theme.palette.secondary[400]}`,
            boxSixing: 'border-box',
            borderWidth: isNonMobile ? '1px' : '2px',
            width: drawerWidth,
            overflowX: 'hidden', // Hide horizontal scrollbar
            overflowY: 'auto',   // Show vertical scrollbar when needed
          },
        }}
      >
        <Box width='100%'>
          <Box m='1rem 2rem 2rem 3rem'>
            <FlexBetween color={theme.palette.secondary.main}>
              {/* <Box display="flex" alignItems="center" gap="0.5rem">
                <Typography variant="h4" fontWeight="bold">
                  WHMS
                </Typography>
              </Box> */}
              <Box>
                <FlexBetween
                  textTransform='none'
                  gap='1rem'
                  m='1.5rem 2rem 0 0rem'
                >
                  <Box
                    component='img'
                    alt='profile'
                    src={profileImage}
                    height='40px'
                    width='40px'
                    borderRadius='50%'
                    sx={{ objectFit: 'cover' }}
                  />

                  <Typography variant='h4'>
                    WHMS
                  </Typography>
                </FlexBetween>
              </Box>
              {!isNonMobile && (
                <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <ChevronLeft />
                </IconButton>
              )}
            </FlexBetween>
          </Box>
          <List>
            {navItems.map(({ text, icon }) => {
              if (!icon) {
                return (
                  <Typography key={text} sx={{ m: '2.25rem 0 1rem 3rem' }}>
                    {text}
                  </Typography>
                );
              }
              const lcText = text.toLowerCase();

              return (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(`/${lcText}`);
                      setActive(lcText);
                    }}
                    sx={{
                      backgroundColor:
                        active === lcText
                          ? theme.palette.secondary[400]
                          : 'transparent',
                      color:
                        active === lcText
                          ? theme.palette.primary[100]
                          : theme.palette.secondary[500],
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        ml: '2rem',
                        color:
                          active === lcText
                            ? theme.palette.grey[100]
                            : theme.palette.secondary[500],
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                    {active === lcText && (
                      <ChevronRightOutlined sx={{ ml: 'auto' }} />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    )}
  </Box></> : <><Box component='nav'>
        {isSidebarOpen && (
          <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant='persistent'
          anchor='left'
          overflowX='hidden'
          overflowY='auto'
          
          sx={{
              width: drawerWidth,
              '& .MuiDrawer-paper': {
                  color: theme.palette.secondary[200],
                  backgroundColor: theme.palette.secondary[300],
                  boxSizing: 'border-box',
                  borderWidth: isNonMobile ? 0 : '2px',
                  borderRadius : '30px',
                  margin : '1px 15px',
                  width: drawerWidth,
                  overflowX: 'hidden', // Hide horizontal scrollbar
                  overflowY: 'auto',   // Show vertical scrollbar when needed
                  scrollbarWidth: 'none', // Firefox
                  '-ms-overflow-style': 'none', // Internet Explorer and Edge
                  '&::-webkit-scrollbar': {
                      display: 'none' // Webkit browsers
                  },
              },
          }}
      >

           <Box width='100%' sx={{
            boxSixing: 'border-box',
           }}>
              <Box m='1rem'>
                <FlexBetween sx={{ color : theme.palette.secondary.main}}>

                    <Box sx={{ width: '100%', typography: 'body1'}}>
                          <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: theme.palette.secondary[400] }}>
                              <TabList  aria-label="lab API tabs example">
                                <Tab style = {{ color : theme.palette.secondary.main}} label="User Profile" value="1" />
                                <Tab label="History" value="2" />
                                
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
                    <Box sx={{width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Name <br></br> 
                    <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.initialUserData?.name}</span>
                    </p>

                    </Box>
                    
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Device ID <br></br> 
                    <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.deviceId}</span>
                    </p>

                    </Box>


                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Phone number <br></br> 
                    <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.initialUserData?.phone}</span>
                    </p>

                    </Box>

                    <div style={{width: "100%", height: "100%", border: `1px solid ${theme.palette.secondary[300]}`}}></div>
                   

                  <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '100%'}}>
                      <p className='firstnames'>Environment <br></br> 
                      <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.environmentData?.name}</span>
                    </p>
                    </Box>

                    
                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                          Age
                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.profileData?.dob.substring(2,11)}</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '50%',float: 'right'}}>
                      <p className='firstnames'>
                          Weight
                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.profileData?.weight}</span>
                      </p>
                    </Box>
                      
                    </Box>


                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                          Height
                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.profileData?.height} cm</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '49%',float: 'right'}}>
                      <p className='firstnames'>
                          Gender
                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>{user?.data?.profileData?.gender}</span>
                      </p>
                    </Box>
                    </Box>

                  </Box>

 
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Device Status <br></br> 
                    <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>----</span>
                    </p>

                    </Box>
                    
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Admin <br></br> 
                    <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>----</span>
                    </p>

                    </Box>


                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Department <br></br> 
                    <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>---</span>
                    </p>

                    </Box>
                   
                    <div style={{width: "100%", height: "100%", border: `1px solid ${theme.palette.secondary[300]}`}}></div>


                    
                    <Box style={{ color: theme.palette.secondary[700],  width: '100%'}}>
                    <Box sx={{ width: '100%',marginBottom: '1rem'}}>
                    <p className='firstnames'>Problems<br></br> 
                    <span style={{ color: theme.palette.secondary[700]}} className='sidebarvalues'>Hypertention, High blood Pressure</span>
                    </p>

                    </Box>

                    
                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                        Allergies

                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>Dust</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '50%',float: 'right'}}>
                      <p className='firstnames'>
                          Insured
                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>Yes</span>
                      </p>
                    </Box>
                      
                    </Box>


                    <Box sx={{ width: '100%'}}>
                    <Box sx={{ width: '50%',float: 'left'}}>
                      <p className='firstnames'>
                      Max heart rate
                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>150 BPM</span>
                      </p>
                    </Box>

                    <Box sx={{ width: '49%',float: 'right'}}>
                      <p className='firstnames'>
                      Min heart rate
                        <br></br> 
                        <span style={{ color : theme.palette.secondary[700]}} className='sidebarvalues'>60 BPM</span>
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
      </Box></>}
    </>
  );
};

export default Sidebar;
