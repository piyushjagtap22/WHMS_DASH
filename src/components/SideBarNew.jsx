import { memo } from 'react';
import { Avatar, Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SideBarNewHistoryTab from './SideBarNewHistoryTab';
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
  console.log('uuser', user);

  const [connected, setConnected] = useState(false);
  const data2 = useSelector((state) => state.device.sensorData);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  console.log('hhtt');
  console.log(MongoUser);

  console.log(
    data2?.heartRateObj?.[data2.heartRateObj.length - 1]?.timestamp.slice(
      0,
      19
    ) ?? '-'
  );

  useEffect(() => {
    const getCurrentUnixTime = () => Math.floor(new Date().getTime() / 1000);

    const convertISTDateTimeToUnix = (istDateTime) => {
      const [date, time] = istDateTime.split(' ');
      const [year, month, day] = date.split('-');
      const [hours, minutes, seconds] = time.split(':');

      const istDate = new Date(
        Date.UTC(year, month - 1, day, hours, minutes, seconds)
      );

      const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000);

      return Math.floor(utcDate.getTime() / 1000);
    };

    const getTimeDifference = (timestampStr) => {
      const currentUnixTime = getCurrentUnixTime();
      const deviceUnixTime = convertISTDateTimeToUnix(timestampStr);
      return currentUnixTime - deviceUnixTime;
    };

    const checkConnectionStatus = () => {
      const timestampStr =
        data2?.heartRateObj?.[data2.heartRateObj.length - 1]?.timestamp ?? '';

      if (timestampStr !== '') {
        const timeDifference = getTimeDifference(timestampStr);
        setConnected(timeDifference < 5 && timeDifference >= 0);
      } else {
        setConnected(false);
      }
    };

    const checkDisconnectionStatus = () => {
      const timestampStr =
        data2?.heartRateObj?.[data2.heartRateObj.length - 1]?.timestamp ?? '';

      if (timestampStr !== '') {
        const timeDifference = getTimeDifference(timestampStr);
        if (timeDifference >= 5) {
          setConnected(false);
        }
      }
    };

    // Check connection status immediately
    checkConnectionStatus();

    // Set up the timeout to check disconnection status once after 5 seconds
    const timeoutId = setTimeout(checkDisconnectionStatus, 5000);

    // Cleanup interval and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [data2]);

  function formatDate(dateString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Split the input date string into components
    const [year, month, day] = dateString.split('-');

    // Get the month name from the months array
    const monthName = months[parseInt(month, 10) - 1];

    // Return the formatted date string
    return `${parseInt(day, 10)} ${monthName}, ${year}`;
  }
  console.log('Sidebarnew is getting rerendered');

  const classes = useStyles();

  const AuthUser = useSelector((state) => state.auth.AuthUser);
  console.log('AU,', AuthUser);
  const CurrentUserId = useSelector(
    (state) => state.device.currentDeviceUserId
  );
  console.log(AuthUser);
  const [tabValueSidebar, setTabValueSidebar] = useState(0);
  const handleTabChange = (event, newValue) => {
    event.preventDefault();
    console.log('change in tab');

    console.log(CurrentUserId);
    console.log(AuthUser);
    if (CurrentUserId == '"' || CurrentUserId == null) {
      toast.error('No user and its history available for this device');
    } else {
      setTabValueSidebar(newValue);

      setTabValue(newValue);

      localStorage.setItem('tabhistory', newValue);
    }
  };

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
        {/* <UserProfile />  // TODO*/}
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
                {user?.data?.initialUserData?.name
                  ? `${user?.data?.initialUserData?.name}`
                  : '--'}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Phone number</Typography>
              <Typography className={classes.value}>
                {user?.data?.initialUserData?.phone
                  ? `${user?.data?.initialUserData?.phone}`
                  : '--'}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Email Id</Typography>
              <Typography className={classes.value}>
                {user?.data?.initialUserData?.email
                  ? `${user?.data?.initialUserData?.email}`
                  : '--'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider className={classes.divider} />

        <Box className={classes.section}>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Device ID</Typography>
              <Typography className={classes.value}>
                {user?.data?.deviceId}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Device status</Typography>
              <Typography className={`${classes.value} ${classes.greenText}`}>
                {/* TODO */}
                <span
                  style={{
                    color: connected
                      ? 'rgba(124, 214, 171, 0.9)'
                      : 'rgba(255, 36, 36, 0.9)',
                  }}
                >
                  {connected ? 'Active' : 'Disconnected'}
                </span>
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Device Admin</Typography>
              <Typography className={classes.value}>
                {AuthUser.displayName}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Organisation</Typography>
              <Typography className={classes.value}>
                {MongoUser?.orgName}
              </Typography>
            </Box>
            <Box className={classes.column}>
              <Typography className={classes.title}>Department</Typography>
              <Typography className={classes.value}>
                {MongoUser?.deptName}
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
                {user?.data?.profileData?.dob.substring(0, 11)
                  ? formatDate(user?.data?.profileData?.dob.substring(0, 11))
                  : '---'}
              </Typography>
            </Box>
            <Box className={classes.column}>
              <Typography className={classes.title}>Weight</Typography>
              <Typography className={classes.value}>
                {user?.data?.profileData?.weight
                  ? `${user.data.profileData.weight} Kgs`
                  : '--'}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.row}>
            <Box className={classes.column}>
              <Typography className={classes.title}>Height</Typography>
              <Typography className={classes.value}>
                {user?.data?.profileData?.height
                  ? `${user.data.profileData.height} cm`
                  : '--'}
              </Typography>
            </Box>
            <Box className={classes.column}>
              <Typography className={classes.title}>Gender</Typography>
              <Typography className={classes.value}>
                {user?.data?.profileData?.gender
                  ? `${user?.data?.profileData?.gender}`
                  : '--'}
              </Typography>
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
        <SideBarNewHistoryTab />
      </Box>
    </Box>
  );
};

export default memo(SidebarNew);
