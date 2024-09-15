import {
  AppBar,
  Typography,
  Link,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Drawer,
  Button,
} from '@mui/material';
import React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import useStyles from '../css/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import profileImage from '../assets/PrayogikLogo.png';
import CustomButton from './Button';

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Header = (props) => {
  const classes = useStyles();
  const links = [
    {
      id: 1,
      route: 'Home',
      url: 'https://blog.appseed.us/mui-react-coding-landing-page/',
    },
    { id: 2, route: 'Go to Console', url: 'https://appseed.us/apps/react' },
  ];

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ marginBottom: '70px' }}>
      <ElevationScroll {...props}>
        <AppBar sx={{ borderBottom: '1px solid #75777B' }}>
          <Toolbar className={classes.toolBar}>
            <Link href='#' underline='none'>
              <Box display='flex' alignItems='center'>
                <Box
                  component='img'
                  alt='profile'
                  src={profileImage}
                  height='40px'
                  width='40px'
                  borderRadius='50%'
                  sx={{ objectFit: 'cover', marginRight: '10px' }}
                />
                <Typography variant='h5' className={classes.logo}>
                  W-HMS
                </Typography>
              </Box>
            </Link>

            {matches ? (
              <Box>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='menu'
                  onClick={toggleDrawer('right', true)}
                >
                  <MenuIcon className={classes.menuIcon} fontSize='' />
                </IconButton>

                <Drawer
                  anchor='right'
                  open={state['right']}
                  onClose={toggleDrawer('right', false)}
                >
                  <Box
                    sx={{
                      width: 250,
                      height: '100%',
                      padding: '20px 20px',
                      backgroundColor: '#121318',
                      textAlign: 'center',
                    }}
                  >
                    <List>
                      <Link href='#' target='_blank' underline='none'>
                        <Typography className={classes.menuItem}>
                          Home
                        </Typography>
                      </Link>
                      <Link href='#' target='_blank' underline='none'>
                        <Typography className={classes.menuItem}>
                          About Us
                        </Typography>
                      </Link>
                      <Link href='/register' target='_blank' underline='none'>
                        <CustomButton
                          variant='contained'
                          width='180px'
                          sx={{ margin: '15px 0 ' }}
                        >
                          Go to Console
                        </CustomButton>
                      </Link>
                    </List>
                  </Box>
                </Drawer>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexGrow: '0.1',
                }}
              >
                <Link href='#' target='_blank' underline='none'>
                  <Typography sx={{ color: 'white' }}>Home</Typography>
                </Link>
                <Link href='#' target='_blank' underline='none'>
                  <Typography sx={{ color: 'white' }}>About Us</Typography>
                </Link>
                <Link href='/register' target='_blank' underline='none'>
                  <CustomButton variant='contained'>Go to Console</CustomButton>
                </Link>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </Box>
  );
};

export default Header;
