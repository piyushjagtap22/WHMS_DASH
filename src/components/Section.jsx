import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import BluetoothSearchingIcon from '@mui/icons-material/BluetoothSearching';
import useStyles from '../css/styles';
import WaterIcon from '@mui/icons-material/Water';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FactoryIcon from '@mui/icons-material/Factory';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

const Section = () => {
  const classes = useStyles();
  // Integrated Wearable Health Monitoring:

  // Comfortable & Durable Fabric: .

  // Telemedicine-Ready: .

  // Customizable for Industries: .

  // Routine Health Monitoring: .

  // Sustainable Power: .
  const sectionItems = [
    {
      id: 1,
      icon: <BluetoothSearchingIcon sx={{ fontSize: 100 }} color='primary' />,
      sentence:
        'Real-time health tracking via a mobile app with Bluetooth connectivity and family group sharing.',
    },
    {
      id: 2,
      icon: <WaterIcon sx={{ fontSize: 100 }} color='primary' />,
      sentence:
        'Washable, quick-dry, breathable, lightweight, anti-odor, chlorine-resistant, and UV-protected material',
    },
    {
      id: 3,
      icon: <LocalHospitalIcon sx={{ fontSize: 100 }} color='primary' />,
      sentence:
        'Supports virtual hospitals and telemedicine services through continuous monitoring with the W-HMS system',
    },
    {
      id: 4,
      icon: <FactoryIcon sx={{ fontSize: 100 }} color='primary' />,
      sentence:
        'Adaptable to various industries with specific health monitoring needs',
    },
    {
      id: 5,
      icon: <MedicalInformationIcon sx={{ fontSize: 100 }} color='primary' />,
      sentence:
        'Regular body check-ups to detect health deviations, with data storage and analysis capabilities',
    },
    {
      id: 6,
      icon: <DeviceThermostatIcon sx={{ fontSize: 100 }} color='primary' />,
      sentence:
        'Powered by flexible TEG technology that uses body heat, ensuring no sweating and uninterrupted operation',
    },
  ];
  return (
    <Box sx={{ flexGrow: 1, minHeight: '400px' }}>
      <Grid container className={classes.sectionGridContainer}>
        {sectionItems.map((item) => (
          <Grid
            item
            xs={12}
            md={3.5}
            minHeight={200}
            key={item.id}
            className={classes.sectionGridItem}
          >
            {item.icon}
            <Typography>{item.sentence}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Section;
