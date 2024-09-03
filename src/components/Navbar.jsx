import {
  ArrowDropDownOutlined,
  DarkModeOutlined,
  LightModeOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import profileImage from '../assets/profile.png';
import {
  setAuthState,
  setAuthUser,
  setMongoUser,
} from '../slices/authSlice.js';
import { setLoading } from '../slices/loadingSlice.js';
import { setMode } from '../slices/modeSlice.js';
import FlexBetween from './FlexBetween.jsx';

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.js';

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [name, setName] = useState('');
  const token = useSelector((state) => state.auth.token);
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const navigate = useNavigate();
  const location = useLocation();
  const deviceID = useSelector((state) => state.device.currentDevice);

  const delay = useCallback(
    (milliseconds) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds)),
    []
  );

  const handleLogout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await delay(1000);
      await signOut(auth);
      console.log('in');

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          dispatch(setAuthState('/register'));
          dispatch(setAuthUser(null));
          dispatch(setMongoUser(null));
          console.log('here');
          navigate('/register');
          console.log('Navigation completed');
          unsubscribe();
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, delay, navigate]);

  useEffect(() => {
    if (AuthUser && AuthUser.displayName) {
      setName(AuthUser.displayName);
    }
    console.log(MongoUser);
  }, [AuthUser, MongoUser]);

  const navbarTitle = useMemo(() => {
    return location.pathname === '/Default' ? (
      <>
        <Link
          to='/dashboard'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Dashboard
        </Link>
        {` /${deviceID}`}
      </>
    ) : (
      location.pathname.substring(1).toUpperCase()
    );
  }, [location.pathname, deviceID]);

  return (
    <AppBar
      sx={{
        position: 'static',
        background: 'none',
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.secondary[400]}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          {location.pathname !== '/superadmin' && (
            <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {/* <MenuIcon /> */}
            </IconButton>
          )}
          <FlexBetween borderRadius='9px' gap='4rem' p='0.1rem 1.5rem'>
            <Typography fontSize='14px' fontWeight='bold'>
              {navbarTitle}
            </Typography>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap='1.5rem'>
          {/* <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <LightModeOutlined sx={{ fontSize: '25px' }} />
            ) : (
              <DarkModeOutlined sx={{ fontSize: '25px' }} />
            )}
          </IconButton> */}

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'none',
                gap: '1rem',
              }}
            >
              {/* <Box
                component='img'
                alt='profile'
                src={profileImage}
                height='32px'
                width='32px'
                borderRadius='50%'
                sx={{ objectFit: 'cover' }}
              /> */}
              <Box textAlign='left'>
                <Typography
                  fontWeight='bold'
                  fontSize='0.85rem'
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  Hello {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography
                  fontSize='0.75rem'
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {/* {user.occupation} */}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[800], fontSize: '25px' }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              color={theme.palette.secondary[800]}
            >
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);
