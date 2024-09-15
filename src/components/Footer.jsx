import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import useStyles from '../css/styles';


const Footer = () => {
  const date = new Date().getFullYear();
  const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }} className={classes.footerContainer}>
      {/* <Typography className={classes.footerText}>
        Provided by{' '}
        <Link href="https://appseed.us" target="_blank" underline="none">
          AppSeed
        </Link>
      </Typography> */}
      <Typography className={classes.footerDate}>© 2024 | Prayogik | All Rights Reserved.</Typography>
    </Box>
  );
};

export default Footer;