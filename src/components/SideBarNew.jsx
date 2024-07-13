import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: drawerWidth,
    marginBottom: theme.spacing(2),
    backgroundColor: '#191C23',
    color: '#FFFFFF',
    padding: theme.spacing(0),
    margin: '24px 0 0 24px',
    borderRadius: '16px',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  avatar: {
    width: '80px', // Adjust size as needed
    height: '80px', // Adjust size as needed
    margin: theme.spacing(3, 2), // Add spacing above and below each section
  },
  tab: {
    minWidth: '50%',
    textTransform: 'capitalize',
  },
  section: {
    margin: theme.spacing(3, 10, 0, 3), // Add spacing above and below each section
  },
  title: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: theme.spacing(0.2),
    color: '#75777B',
  },
  value: {
    fontSize: '14px',
    marginBottom: theme.spacing(0.5),
    color: '#FFFFFF',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  greenText: {
    color: '#7CD6AB',
  },

  divider: {
    backgroundColor: '#47494F', // Divider color
    margin: 0, // Ensure the divider spans the full width
    padding: 0,
  },
}));

const SidebarNew = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
  HandleTabChange,
  setTabValue,
}) => {
  const classes = useStyles();

  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const [tabValueSidebar, setTabValueSidebar] = useState(0);
  const handleTabChange = (event, newValue) => {
    console.log('change');
    console.log(newValue);
    setTabValueSidebar(newValue);
    setTabValue(newValue);

    localStorage.setItem('tabhistory', newValue);
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const [sensorData, setSensorData] = useState({
    heartSensor: '',
    BreathRateSensor: '',
    VentilatonSensor: '',
    TidalVolumeSensor: '',
    ActivitySensor: '',
    CadenceSensor: '',
    TemperatureSensor: '',
    OxygenSaturationSensor: '',
    BloodPressureSensor: '',
  });

  const { state: bunnySensorData } = useLocation();

  useEffect(() => {
    if (bunnySensorData) {
      console.log('Sensor data received:', bunnySensorData.data);
      const {
        heartSensor,
        BreathRateSensor,
        VentilatonSensor,
        TidalVolumeSensor,
        ActivitySensor,
        CadenceSensor,
        TemperatureSensor,
        OxygenSaturationSensor,
        BloodPressureSensor,
      } = bunnySensorData.data;

      // Update state with the sensor data
      setSensorData({
        heartSensor,
        BreathRateSensor,
        VentilatonSensor,
        TidalVolumeSensor,
        ActivitySensor,
        CadenceSensor,
        TemperatureSensor,
        OxygenSaturationSensor,
        BloodPressureSensor,
      });
    } else {
      console.log('No data');
    }
  }, [bunnySensorData]);

  return !isSidebarOpen ? (
    <Box></Box>
  ) : (
    <Box className={classes.sidebar}>
      <Tabs
        value={tabValueSidebar}
        sx={{
          borderBottom: '1px solid grey',
          '& .MuiTabs-indicator': {
            backgroundColor: '#7CD6AB',
          },
        }}
        onChange={handleTabChange}
        // indicatorColor="secondary"

        textColor='inherit'
        variant='fullWidth'
        className='tabs'
      >
        <Tab label='User Profile' className={classes.tab} />
        <Tab label='History' className={classes.tab} />
      </Tabs>
      <Divider className={classes.divider} />
      <Box sx={{ padding: '0px' }} hidden={tabValueSidebar !== 0} p={2}>
        <Box className={classes.row}>
          <Box className={classes.column}>
            <Avatar
              sx={{ height: '80px', width: '80px' }}
              className={classes.avatar}
              src='https://s3-alpha-sig.figma.com/img/d2d2/ed85/56ba434e0b18800a9c3c5fd3f621b778?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ewUfYy82O8-mLg0sUT6uFhkoWaDzY9Ek0JK2wOpq5KnmnNUfMbwgi47NPMWOb-PsPaZfchk3kpI9S16pg~C~Eau9xl~Ht7Zjb98E1LXA826kjiOeXvFl8GCLGNCW2zr0nTXHzjLnhONeBbBYC8gwCy0xo5Iac4X0LGl6afy9lgzBm96p5sg5qUaD7XPLQlDMqWMKqdeyalyFBkAkFbqejLHdlr4nH4QdWWqX3xM7euka5if4AZ87XT5~NVuhxX1Zr4N43E1C~d0hxm85E~AOuWiHz3Zc9tNAXhd4J-WjZpGQEKBjOAkeCNZCVjwUDI0fzBdUuITd2qEEq94FizxV9A__'
            />
          </Box>
        </Box>
        <Box className={classes.section}>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Name</Typography>
              <Typography className={classes.value}>
                {user?.data?.initialUserData?.name}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Device ID</Typography>
              <Typography className={classes.value}>
                W-HMS-X {user?.data?.deviceId}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Phone number</Typography>
              <Typography className={classes.value}>
                {user?.data?.initialUserData?.phone}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider className={classes.divider} />
        <Box className={classes.section}>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Environment</Typography>
              <Typography className={classes.value}>
                {user?.data?.environmentData?.name}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>DOB</Typography>
              <Typography className={classes.value}>
                {' '}
                {user?.data?.profileData?.dob.substring(2, 11)}
              </Typography>
            </Box>
            <Box className={classes.column}>
              <Typography className={classes.title}>Weight</Typography>
              <Typography className={classes.value}>
                {user?.data?.profileData?.weight} Kgs
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Height</Typography>
              <Typography className={classes.value}>
                {user?.data?.profileData?.height} cm
              </Typography>
            </Box>
            <Box className={classes.column}>
              <Typography className={classes.title}>Gender</Typography>
              <Typography className={classes.value}>
                {user?.data?.profileData?.gender}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider className={classes.divider} />
        <Box className={classes.section}>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Device status</Typography>
              <Typography className={`${classes.value} ${classes.greenText}`}>
                Active
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Admin</Typography>
              <Typography className={classes.value}>
                {AuthUser.displayName}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Department</Typography>
              <Typography className={classes.value}>Transmission</Typography>
            </Box>
          </Box>
        </Box>
        <Divider className={classes.divider} />
        <Box className={classes.section}>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Problems</Typography>
              <Typography className={classes.value}>
                Hypertension, High blood Pressure
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Allergies</Typography>
              <Typography className={classes.value}>Dust</Typography>
            </Box>
            <Box className={classes.column}>
              <Typography className={classes.title}>Insured</Typography>
              <Typography className={classes.value}>Yes</Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Max heart rate</Typography>
              <Typography className={classes.value}>150 BPM</Typography>
            </Box>
            <Box className={classes.column}>
              <Typography className={classes.title}>Min heart rate</Typography>
              <Typography className={classes.value}>60 BPM</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box hidden={tabValueSidebar !== 1} p={2}>
        {/* History content goes here */}
        {Object.keys(sensorData).map((key, index) => (
          <>
            <Box sx={{}} key={index}>
              {sensorData[key] ? (
                <Paper
                  sx={{
                    p: 2,
                    color: '#fff',
                    background: '#191C23',
                  }}
                >
                  <Typography
                    sx={{
                      marginBottom: '2px',
                      fontSize: '0.9rem',
                      letterSpacing: '0.4px',
                      fontWeight: 'bold',
                    }}
                  >
                    {capitalizeFirstLetter(key)}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: '#888888',
                      marginBottom: '0px',
                    }}
                  >
                    3:22 pm UTC, Today
                  </Typography>
                  {/* Example sensor data, replace with actual data */}
                  <Typography
                    variant='body2'
                    sx={{
                      color: '#888888',
                      marginBottom: '12px',
                    }}
                  >
                    {/* {sensorData[key]} */}
                  </Typography>
                  <Grid container alignItems='center' spacing={1}>
                    <Grid item>
                      <FavoriteIcon
                        style={{ color: '#7CD6AB', fontSize: '1rem' }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography
                        variant='body2'
                        sx={{
                          fontSize: '0.9rem',
                          color: '#fff',
                        }}
                      >
                        {sensorData[key]}
                      </Typography>
                    </Grid>
                    {/* <Grid item sx={{ ml: 2 }}>
                  <DirectionsRunIcon style={{ color: '#7CD6AB', fontSize: '1rem' }} />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      color: '#fff'
                    }}
                  >
                    20.1 resp/min
                  </Typography>
                </Grid> */}
                  </Grid>
                </Paper>
              ) : (
                <h1 key={`nodata-${index}`}>No data for {key}</h1>
              )}
            </Box>
            <Divider className={classes.divider}></Divider>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default SidebarNew;
