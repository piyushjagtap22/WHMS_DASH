import React, { useEffect, useState } from "react";
import FlexBetween from "../FlexBetween";
import Header from "../Header";
import { DownloadOutlined  } from "@mui/icons-material";
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  CardMedia,
} from "@mui/material";
import Body_Male from "../../assets/Body_Male.png";
import Graph from "../Graph";
import { getHeartRateData, getMongoUserByEmail } from "../../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';

const ENDPOINT = "http://localhost:3000";
var socket;
const DefaultPage = () => {
  const theme = useTheme();
  const {state: adminData} = useLocation();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const dispatch = useDispatch();
  const [heartRateData, setHeartRateData] = useState([]);
  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);
  const [xSensorData, setxSensorData] = useState([]);
  const [xSensorTimeStamp, setxSensorTimeStamp] = useState([]);
  const [ySensorData, setySensorData] = useState([]);
  const [ySensorTimeStamp, setySensorTimeStamp] = useState([]);
  const MonogoUser = useSelector((state) => state.auth.MongoUser);
  const [socketConnected, setSocketConnected] = useState(false);
  const [anchor, setAnchor] = React.useState(null);
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "white",
      color: 'black',
      fontSize: 15,
    },
  }));

  useEffect(() => {
    console.log("harsh admin data",adminData)
    const id = "8snb36T61DWQRd4PtSzvRphDeiT2";
    socket = io(ENDPOINT);
    socket.emit("setup", id);
    socket.on("initialData", (data) => {
      console.log("Initial data received:", data);
      if (data && Array.isArray(data.message.heartSensor)) {
        // Extracting only the "value" field from each object in the array
        const heartsensor = data.message.heartSensor.map((item) => item.value);
        const timestamp = data.message.heartSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const xSensor = data.message.xSensor.map((item) => item.value);
        const xtimestamp = data.message.xSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const ySensor = data.message.ySensor.map((item) => item.value);
        const ytimestamp = data.message.ySensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        setHeartRateData(heartsensor);
        setheartRateTimeStamp(timestamp);
        setxSensorData(xSensor);
        setxSensorTimeStamp(xtimestamp);
        setySensorData(ySensor);
        setySensorTimeStamp(ytimestamp);
      } else {
        console.error("Invalid data format from the API");
      }
    });

    socket.on("dataChange", (data) => {
      // console.log("Real-time data change detected:", data.data);
      if (data && Array.isArray(data.data.heartSensor)) {
        // Extracting only the "value" field from each object in the array
        const heartsensor = data.data.heartSensor.map((item) => item.value);
        const timestamp = data.data.heartSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const xSensor = data.data.xSensor.map((item) => item.value);
        const xtimestamp = data.data.xSensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        const ySensor = data.data.ySensor.map((item) => item.value);
        const ytimestamp = data.data.ySensor.map((item) =>
          item.timestamp.slice(11, 19)
        );
        setHeartRateData(heartsensor);
        setheartRateTimeStamp(timestamp);
        setxSensorData(xSensor);
        setxSensorTimeStamp(xtimestamp);
        setySensorData(ySensor);
        setySensorTimeStamp(ytimestamp);
      } else {
        console.error("Invalid data format from the API");
      }
      // Update state with the new data
    });
  }, []); 


  return (
    <>
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
        <Graph
          name={"HeartRate"}
          data={heartRateData}
          timestamp={heartRateTimeStamp}
          max = {200}
        />

        {/* ROW 2 */}

        <Graph
          name={"XSensor"}
          data={xSensorData}
          timestamp={xSensorTimeStamp}
          max = {180}
        />

        {/* ROW 3 */}
        <Graph
          name={"YSensor"}
          data={ySensorData}
          timestamp={ySensorTimeStamp}
          max = {300}
        />
       

        {/* <Graph data={heartRateData}/> */}
        {/* ROW 4 */}
        {isNonMediumScreens && (
           <Box position="relative">
           <img
             alt="body_male"
             src={Body_Male}
             style={{
               gridColumn: 'span 1',
               gridRow: 'span 2',
               position: 'fixed',
               top: '5rem',
               right: 2,
               height: '90vh',
               width: '38%',
               zIndex: 2,
             }}
           />
           <Tooltip
             title={`Heart rate : ${heartRateData[39]}`}
             arrow
             placement="right-end"
             style={{
              fontSize: "15",
               position: 'fixed',
               top: '13rem',
               right: 240,
               zIndex: 3,
             }}
           >
             <IconButton>
               <FavoriteRoundedIcon />
             </IconButton>
           </Tooltip>
         </Box>
        )}
      </Box>
    </Box>
    </>
  );
};

export default DefaultPage;
