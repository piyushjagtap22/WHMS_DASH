import React from "react";
import FlexBetween from "../FlexBetween";
import Header from "../Header";
import { DownloadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme, 
  useMediaQuery,
  CardMedia,
} from "@mui/material";
import Body_Male from "../../assets/Body_Male.png";


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

const DefaultPage = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

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

  const labels = ["jan", "feb", "Mar", "Apr", "May", "Jun", "jul"];
  const data2 = {
    labels,
    datasets: [
      {
        label: "React",
        data: [0, 10, 20, 30, 20, 15, 10],
        backgroundColor: "green",
        borderColor: "green",
      },
    ],
    options: {
      scales: {
        y: {
          ticks: {
            callback: (value) => {
              if (value === 0) return value;
              return value + "M";
            },
          },
        },
      },
    },
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header subtitle="Today" />
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        zIndex={2}
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 7"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="2rem"
          pr="4rem"
          borderRadius="0.55rem"
          zIndex={2}
          position="relative" // Ensure relative positioning for absolute children
        >
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              width: "100%", // Make the container width 100%
            }}
          >
            {/* Text element with red dot icon */}
            <span
              style={{
                fontWeight: "bold",
                marginRight: "1.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              Total Users
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.primary[100],
              }}
            >
              Total Projects
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
            {/* Text element with green dot icon */}
            <span style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                style={{
                  color: "white",
                  marginRight: "0.2rem",
                  fontSize: "0.8rem",
                }}
              />
              Current Week
            </span>
          </div>
          <Line options={options} data={data2} />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 7"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          zIndex={2}
          position="relative"
        >
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Text element with red dot icon */}
            <span
              style={{
                fontWeight: "bold",
                marginRight: "1.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              Total Users
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.primary[100],
              }}
            >
              Total Projects
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
            {/* Text element with green dot icon */}
            <span style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                style={{
                  color: "white",
                  marginRight: "0.2rem",
                  fontSize: "0.8rem",
                }}
              />
              Current Week
            </span>
          </div>
          <Line options={options} data={data2} />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 7"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          zIndex={2}
          position="relative"
        >
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Text element with red dot icon */}
            <span
              style={{
                fontWeight: "bold",
                marginRight: "1.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              Total Users
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.primary[100],
              }}
            >
              Total Projects
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
            {/* Text element with green dot icon */}
            <span style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                style={{
                  color: "white",
                  marginRight: "0.2rem",
                  fontSize: "0.8rem",
                }}
              />
              Current Week
            </span>
          </div>
          <Line options={options} data={data2} />
        </Box>

        {/* ROW 4 */}
        {isNonMediumScreens && (
          <Box
          component="img"
          alt="body_male"
          src={Body_Male}
          gridColumn="span 1"
          gridRow="span 2"
          position="fixed"
          top="5rem"
          right={2}
          height="90vh"
          width="45%"
          zIndex={1}
        />
        )}
      </Box>
    </Box>
  );
};

export default DefaultPage;
