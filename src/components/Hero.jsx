import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import myteam from '../assets/myteam.jpg';
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

          <CustomButton variant='contained' width='200px'>
            Download Mobile App
          </CustomButton>
        </Grid>
        <Grid item xs={12} md={5}>
          <img src={myteam} alt='My Team' className={classes.largeImage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
