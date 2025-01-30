import React from 'react';
import { Grid, Typography, Box, Button, Link } from '@mui/material';
import QRcode from '../assets/QR_code.jpg';
import useStyles from '../css/styles';
import CustomButton from './Button';

const Hero = () => {
  const classes = useStyles();

  return (
    <Box className={classes.heroBox}>
      <Grid container spacing={6} className={classes.gridContainer}>
        <Grid item xs={12} md={7}>
          <Typography variant='h3' fontWeight={700} className={classes.title}>
            <p>
              W-HMS-FTM<sup>&reg;</sup>
            </p>
          </Typography>
          <Typography variant='h6' className={classes.subtitle}>
            Wearable Health monitoring System Based on Flexible Thermoelectric
            Module
            <br />
            <br />
            Remotely Real time physiological parameters tracking system
          </Typography>
          <Link href='https://drive.google.com/file/d/1EThESfp-muX5FM_tbPllFZ9xe0pYZSnF/view?usp=drivesdk' target='_blank' underline='none'>
          <CustomButton variant='contained' width='200px'>
            Download Mobile App
          </CustomButton>
          </Link>
        </Grid>
        <Grid item xs={12} md={5}>
          <img src={QRcode} alt='My Team' className={classes.largeImage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
