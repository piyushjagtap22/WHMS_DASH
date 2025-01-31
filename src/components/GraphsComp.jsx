import { Box, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import {
  disconnectAbly,
  initializeAbly
} from '../slices/webSocketSlice';
const SENSOR_CONFIG = [
  {
    name: 'Heart Rate',
    unit: 'bpm',
    ranges: {
      green: [60, 100],
      yellow: [[45, 60], [100, 160]],
      orange: [[30, 45], [160, 220]],
      red: [[0, 30], [220, Infinity]]
    }
  },
  {
    name: 'Breath Rate',
    unit: 'br/min',
    ranges: {
      green: [12, 16],
      yellow: [[6, 12], [16, 60]],
      orange: [[3, 6], [60, 90]],
      red: [[0, 3], [90, Infinity]]
    }
  },
  {
    name: 'Ventilation',
    unit: 'L/min',
    ranges: {
      green: [5, 8],
      yellow: [[4, 5], [8, 40]],
      orange: [[3, 4], [40, 90]],
      red: [[0, 3], [90, Infinity]]
    }
  },
  {
    name: 'Activity',
    unit: 'steps/min',
    ranges: {
      green: [60, 100],
      yellow: [[45, 60], [100, 160]],
      orange: [[30, 45], [160, 220]],
      red: [[0, 30], [220, Infinity]]
    }
  },
  {
    name: 'Blood Pressure',
    unit: 'mmHg',
    ranges: {
      green: [110, 130],
      yellow: [[100, 110], [130, 140]],
      orange: [[80, 100], [140, 180]],
      red: [[0, 80], [180, Infinity]]
    }
  },
  {
    name: 'Cadence',
    unit: 'spm',
    ranges: {
      green: [70, 100],
      yellow: [[45, 70], [100, 200]],
      orange: [[30, 45], [200, 240]],
      red: [[0, 30], [240, Infinity]]
    }
  },
  {
    name: 'Oxygen Saturation',
    unit: '%',
    ranges: {
      green: [90, 100],
      yellow: [75, 90],
      orange: [50, 75],
      red: [0, 50]
    }
  },
  {
    name: 'Temperature',
    unit: '°C',
    ranges: {
      green: [35, 37],
      yellow: [34, 35],
      orange: [37, 38],
      red: [[0, 34], [38, Infinity]]
    }
  },
  {
    name: 'Tidal Volume',
    unit: 'L',
    ranges: {
      green: [0.5, 0.7],
      yellow: [[0.3, 0.5], [0.7, 0.8]],
      orange: [[0.1, 0.3], [0.8, 0.9]],
      red: [[0, 0.1], [0.9, Infinity]]
    }
  }
];

// Helper function to calculate moving average and determine color
const getColorFromValue = (value, ranges) => {
  const checkRange = (range, val) => {
    if (Array.isArray(range[0])) {
      return range.some(([min, max]) => val >= min && val <= max);
    }
    return val >= range[0] && val <= range[1];
  };

  if (checkRange(ranges.green, value)) return '#7CD6AB';
  if (checkRange(ranges.yellow, value)) return '#FFC300';
  if (checkRange(ranges.orange, value)) return '#FF851B';
  if (checkRange(ranges.red, value)) return '#FF5733';
  return '#7CD6AB'; // default color
};

const GraphsComp = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { 
    connectionStatus, 
    sensorData, 
    isLoading, 
    error 
  } = useSelector((state) => state.websocket);

  // Initialize series state for all sensors
  const [series, setSeries] = useState(
    SENSOR_CONFIG.map(sensor => ({
      name: sensor.name,
      data: []
    }))
  );

  // Calculate moving averages and update series
  useEffect(() => {
    if (sensorData.length > 0) {
      const latestData = sensorData[sensorData.length - 1];
      const timestamp = new Date(latestData.timestamp).getTime();

      setSeries(prevSeries => 
        prevSeries.map((sensor, index) => {
          const newData = [
            ...sensor.data,
            { x: timestamp, y: latestData.sensor_data[index] }
          ].slice(-50);

          // Calculate moving average
          const movingAverage = newData.reduce((sum, point) => sum + point.y, 0) / newData.length;

          return {
            ...sensor,
            data: newData,
            color: getColorFromValue(movingAverage, SENSOR_CONFIG[index].ranges)
          };
        })
      );
    }
  }, [sensorData]);

  // Initialize Ably connection
  useEffect(() => {
    const userId = ''; // Get from your auth system
    dispatch(initializeAbly(userId));

    return () => {
      dispatch(disconnectAbly());
    };
  }, [dispatch]);






  const getChartOptions = (sensorConfig, seriesColor) => ({
    chart: {
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
      },
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    colors: [seriesColor],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (value) {
          return new Date(value).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        },
        style: {
          colors: '#ffffff'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        }
      },
      title: {
        text: sensorConfig.unit,
        style: {
          color: '#ffffff'
        }
      }
    },

    grid: {
      borderColor: '#ffffff33'
    },
    theme: {
      mode: 'dark'
    },
    // annotations: {
    //   yaxis: [
    //     {
    //       y: sensorConfig.ranges.green[1],
    //       borderColor: '#7CD6AB',
    //       label: {
    //         text: 'High Normal',
    //         style: { color: '#ffffff' }
    //       }
    //     },
    //     {
    //       y: sensorConfig.ranges.green[0],
    //       borderColor: '#7CD6AB',
    //       label: {
    //         text: 'Low Normal',
    //         style: { color: '#ffffff' }
    //       }
    //     }
    //   ]
    // }
  });

  if (isLoading) return <div>Connecting...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
   
    >
      {/* <div
        style={{
          padding: '10px',
          color: connectionStatus.includes('connected') ? 'green' : 'red',
          marginBottom: '20px'
        }}
      >
        Status: {connectionStatus}
      </div> */}
     
        {series.map((sensorSeries, index) => (
          <Box
      
        >
          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <span
          style={{
            fontWeight: 'bold',
            marginRight: '1.5rem',
            display: 'flex',
            alignItems: 'center',
          }}
        > <span
        style={{
          marginLeft: '5rem',
          marginRight: '1rem',
          color: theme.palette.primary[100],
        }}
      ></span>
              {sensorSeries.name} </span> </div>
              <Box 
              height='100%' 
              width='60%'
              padding={2}
              marginLeft={2}
              borderRadius='1.55rem'
              backgroundColor={theme.palette.secondary[300]}
              >
            <Chart
        
              options={getChartOptions(SENSOR_CONFIG[index], sensorSeries.color)}
              series={[sensorSeries]}
              type="area"
              height={350}
              
            />
            </Box>
         
        </Box>
        ))}
     
    </div>
  );
};

export default GraphsComp;