import React, { useMemo } from 'react';
import { Tooltip } from '@mui/material';
import {
  Air as AirIcon,
  DirectionsRun as DirectionsRunIcon,
  Favorite as FavoriteIcon,
  Height,
  Medication as MedicationIcon,
  Thermostat as ThermostatIcon,
} from '@mui/icons-material';
import Body_Male from '../assets/Body_Male.png'; // Adjust the path as necessary
import '../css/BodyFigure.css';

import ActivityIcon from '../../src/assets/SensorIcons/Activity.svg';
import BloodPressureIcon from '../../src/assets/SensorIcons/BloodPressure.svg';
import BreathingRateIcon from '../../src/assets/SensorIcons/BreathingRate.svg';
import HeartRateIcon from '../../src/assets/SensorIcons/HeartRate.svg';
import MinVentilationIcon from '../../src/assets/SensorIcons/Min.Ventilation.svg';
import SPO2Icon from '../../src/assets/SensorIcons/SPO2.svg';
import StepsIcon from '../../src/assets/SensorIcons/Steps.svg';
import TemperatureIcon from '../../src/assets/SensorIcons/Temperature.svg';
import TidalVolumeIcon from '../../src/assets/SensorIcons/TidalVolume.svg';
import CadenceIcon from '../../src/assets/SensorIcons/Cadence.svg';

const BodyFigure = React.memo(({ sensorData }) => {
  const sensors = useMemo(
    () => [
      {
        id: 1,
        type: 'Heart Rate',
        icon: <HeartRateIcon fontSize='small' style={{ height: '1.75rem' }} />,
        position: { top: '25%', left: '55%' },
      },
      {
        id: 2,
        type: 'Activity',
        icon: <ActivityIcon fontSize='small' />,
        position: { top: '63%', left: '39%' },
      },
      {
        id: 3,
        type: 'Blood Pressure',
        icon: <BloodPressureIcon fontSize='small' />,
        position: { top: '45%', left: '74%' },
      },
      {
        id: 4,
        type: 'Breathing Rate',
        icon: (
          <BreathingRateIcon
            style={{ widht: '24px', height: '24px' }}
            fontSize='small'
          />
        ),
        position: { top: '25%', left: '43%' },
      },
      {
        id: 5,
        type: 'Min. Ventilation',
        icon: (
          <MinVentilationIcon fontSize='small' style={{ height: '1.5rem' }} />
        ),
        position: { top: '39%', left: '43%' },
      },
      {
        id: 6,
        type: 'Temperature',
        icon: <TemperatureIcon fontSize='small' />,
        position: { top: '14%', left: '43%' },
      },
      {
        id: 7,
        type: 'SPO2',
        icon: <SPO2Icon fontSize='small' />,
        position: { top: '32%', left: '55%' },
      },
      {
        id: 8,
        type: 'Steps',
        icon: <StepsIcon fontSize='small' />,
        position: { top: '90%', left: '32%' },
      },
      {
        id: 9,
        type: 'Tidal Volume',
        icon: <TidalVolumeIcon fontSize='small' style={{ height: '1.5rem' }} />,
        position: { top: '32%', left: '43%' },
      },
      {
        id: 10,
        type: 'Cadence',
        icon: <CadenceIcon fontSize='small' style={{ height: '1.5rem' }} />,
        position: { top: '90%', left: '68%' },
      },
    ],
    []
  );

  return (
    <div className='body-figure-container'>
      <img src={Body_Male} alt='Body Figure' className='body-image' />
      {sensors.map((sensor) => (
        <Tooltip
          key={sensor.id}
          title={`${sensor.type}: ${sensorData[sensor.type] || '-'}`}
          arrow
          placement='top'
        >
          <div
            className='sensor-icon'
            style={{ top: sensor.position.top, left: sensor.position.left }}
          >
            <div className='outer-circle'>
              <div className='inner-circle'>
                <div className='icon'>{sensor.icon}</div>
              </div>
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
});

export default BodyFigure;
