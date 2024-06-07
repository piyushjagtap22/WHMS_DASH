import React from 'react'
import {
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = (props) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  function calculateAverage(lastValues) {
    var sum = lastValues.reduce(function (acc, value) {
      return acc + value;
    }, 0);
  
    return sum / lastValues.length;
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: theme.palette.primary[600],
        },
        ticks: {
            maxTicksLimit: 7,
          callback: (value) => {
            if (value === 0) return value;
            return value + "M";
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
  };

  // Ensure props.data and props.timestamp are arrays
  const labels = Array.isArray(props.timestamp) ? props.timestamp : [];
  const data = Array.isArray(props.data) ? props.data : [];

  const data2 = {
    labels,
    datasets: [
      {
        label: props.name,
        data: data,
        backgroundColor: calculateAverage(data.slice(-10)) > props.max ? "red" : "green",
        borderColor:  calculateAverage(data.slice(-10)) > props.max ? "red" : "green",
      },
    ],
  };

  return (
    <Box
      gridColumn="span 7"
      gridRow="span 2"
      height="20rem"
      backgroundColor={theme.palette.secondary[300]}
      p="1.5rem"
      borderRadius="1.55rem"
      zIndex={2}
    >
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            marginRight: "1.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.name}
        </span>
        <span
          style={{
            marginLeft: "5rem",
            marginRight: "1rem",
            color: theme.palette.primary[100],
          }}
        >
          |
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FiberManualRecordIcon
            style={{
              color: theme.palette.secondary[700],
              marginRight: "0.2rem",
              fontSize: "0.8rem",
            }}
          />
          Current Week
        </span>
      </div>
      <Box height="85%" width="100%">
        <Line
          box-sizing="border-box"
          display="block"
          height="230px"
          width="850px"
          options={options}
          data={data2}
        />
      </Box>
    </Box>
  );
};

export default Graph;
