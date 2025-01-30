import React from 'react';
import { Grid, Typography, Button, Box, Link } from '@mui/material';
import bestTeams from '../assets/bestTeams.jpg';
import useStyles from '../css/styles';
import CustomButton from './Button';

const AboutUs = () => {
  const classes = useStyles();

  return (
    <Box className={classes.aboutUsContainer}>
      <Grid container spacing={6} className={classes.gridContainer}>
        <Grid item xs={12} md={5}>
          <img src={bestTeams} alt='My Team' className={classes.largeImage} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='h3' fontWeight={700} className={classes.title}>
            About Us
          </Typography>
          <Typography className={classes.aboutUsSubtitle}>
            {/* Wearable Health Monitoring System Wearables in the healthcare domain
            often have embedded medical sensors, which collect and send health
            data to their users or care providers. These devices usually have a
            convenient design, are non-invasive, and are meant to be integrated
            into everyday life. Health monitoring devices can also be lifesaving
            for patients at risk of experiencing rapidly deteriorating
            conditions, such as dropping blood sugar, or those needing
            medication reminders. It is beneficial for healthcare specialists to
            monitor patients’ medical status, identify any changes and respond
            rapidly by applying appropriate treatment. A wearable all-in-one
            Health Monitoring system with real time monitoring and user
            interface to monitor and communicate body’s vital information like
            ECG, Body Temperature, SPO2, Blood Pressure, etc. which is
            critically needed to analyse the body situation working in a harsh
            and rugged environment like Oil & Gas Industry, Aerospace, Security
            and Defence, Health and Safety. */}
            A wearable all-in-one Health Monitoring system with real time
            monitoring and user interface to monitor and communicate body’s
            vital information like ECG, Body Temperature, SPO2, Blood Pressure,
            etc. which is critically needed to analyse the body situation
            working in a harsh and rugged environment like Oil & Gas Industry,
            Aerospace, Security and Defence, Health and Safety.
          </Typography>
          <Link href='https://prayogik.in/wearable-health-monitoring-system' target='_blank' underline='none'>
            <CustomButton
              variant='contained'
              width='180px'
              sx={{ margin: '15px 0 ' }}
            >
              Know More
            </CustomButton>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
