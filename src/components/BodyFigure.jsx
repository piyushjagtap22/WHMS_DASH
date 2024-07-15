import React, { useMemo } from 'react';
import { Tooltip } from '@mui/material';
import {
  Air as AirIcon,
  DirectionsRun as DirectionsRunIcon,
  Favorite as FavoriteIcon,
  Medication as MedicationIcon,
  Thermostat as ThermostatIcon,
} from '@mui/icons-material';
import Body_Male from '../assets/Body_Male.png'; // Adjust the path as necessary
import '../css/BodyFigure.css';

const BodyFigure = React.memo(({ sensorData }) => {
  const sensors = useMemo(
    () => [
      {
        id: 1,
        type: 'Heart Rate',
        icon: <FavoriteIcon fontSize='small' />,
        position: { top: '25%', left: '55%' },
      },
      {
        id: 2,
        type: 'Temperature',
        icon: <ThermostatIcon fontSize='small' />,
        position: { top: '25%', left: '40%' },
      },
      {
        id: 3,
        type: 'Medication',
        icon: <MedicationIcon fontSize='small' />,
        position: { top: '30%', left: '35%' },
      },
      {
        id: 4,
        type: 'Breath Rate',
        icon: <AirIcon fontSize='small' />,
        position: { top: '30%', left: '48%' },
      },
      {
        id: 5,
        type: 'Activity',
        icon: <DirectionsRunIcon fontSize='small' />,
        position: { top: '55%', left: '60%' },
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
          title={`${sensor.type}: ${
            sensorData[sensor.type.toLowerCase()] || '-'
          }`}
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
