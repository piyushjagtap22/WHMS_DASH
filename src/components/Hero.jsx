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
          <Typography variant="h3" fontWeight={700} className={classes.title}>
            Let's scale your business
          </Typography>
          <Typography variant="h6" className={classes.subtitle}>
            Hire professionals who will help your business make 10X your
            previous income. With over 5years experience in Marketing & Business
            strategy, we are your best client.
          </Typography>
          
          <CustomButton variant='contained' width='200px'>
          Download
        </CustomButton>
        </Grid>
        <Grid item xs={12} md={5}>
          <img src={myteam} alt="My Team" className={classes.largeImage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;