import AirIcon from '@mui/icons-material/Air';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicationIcon from '@mui/icons-material/Medication';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { Tooltip } from '@mui/material';

import React from 'react';
import Body_Male from '../assets/Body_Male.png'; // adjust the path as necessary
import '../css/BodyFigure.css';


 

  


    const BodyFigure = ({ sensorData }) => {

        const sensors = [
          { id: 1, type: 'Heart Rate', icon: <FavoriteIcon fontSize="small" />, position: { top: '25%', left: '55%' } },
          { id: 2, type: 'Temperature', icon: <ThermostatIcon fontSize="small" />, position: { top: '25%', left: '40%' } },
          { id: 3, type: 'Medication', icon: <MedicationIcon fontSize="small" />, position: { top: '30%', left: '35%' } },
          { id: 4, type: 'Breath Rate', icon: <AirIcon fontSize="small" />, position: { top: '30%', left: '48%' } },
          { id: 5, type: 'Activity', icon: <DirectionsRunIcon fontSize="small" />, position: { top: '55%', left: '60%' } },
        ];


    return (
        <div className="body-figure-container">
      <img
        src={Body_Male}
        alt="Body Figure"
        className="body-image"
      />
      {sensors.map(sensor => (
        <Tooltip
          key={sensor.id}
          title={`${sensor.type}: ${sensorData[sensor.type.toLowerCase()] || '-'}`}
          arrow
          placement="top"
        >
          <div
            className="sensor-icon"
            style={{ top: sensor.position.top, left: sensor.position.left }}
          >
            <div className="outer-circle">
              <div className="inner-circle">
                <div className="icon">
                  {sensor.icon}
                </div>
              </div>
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
    );
  };
  
  export default BodyFigure;