import React, { useEffect, useState } from "react";
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
import Graph from "../Graph";
import { getHeartRateData, getMongoUserByEmail } from "../../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
var socket;
const DefaultPage = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const dispatch = useDispatch();
  const [heartRateData, setHeartRateData] = useState([]);
  const MonogoUser = useSelector((state) => state.auth.MongoUser);
  const [socketConnected, setSocketConnected] = useState(false);

  const fetchHeartRateData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/sensor/getheartrate/qL0scom2VvbsoId8uLYSNIEWxnU2');
      
      if (!response.ok) {
        // Handle non-OK responses here if needed
        console.error('Failed to fetch data');
        return;
      }

      const data = await response.json();

      // Log the received data for debugging
      console.log('Received data:', data);

      // Ensure that the data is an object with a heartrate array
      // if (data && Array.isArray(data.heartrate)) {
      //   // Extracting only the "value" field from each object in the array
      //   const values = data.heartrate.map(item => item.value);
      //   setHeartRateData(values);
      // } else {
      //   console.error('Invalid data format from the API');
      // }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };


  useEffect(() => {
    const id = "8snb36T61DWQRd4PtSzvRphDeiT2";
    socket = io(ENDPOINT);
    socket.emit("setup",id);
    socket.on("initialData", (data) => {
      console.log("Initial data received:", data);
      if (data && Array.isArray(data.message)) {
        // Extracting only the "value" field from each object in the array
        const values = data.message.map(item => item.value);
        setHeartRateData(values);
      } else {
        console.error('Invalid data format from the API');
      }
    });

    socket.on("dataChange", (data) => {
      console.log("Real-time data change detected:", data.data.heartSensor);
      if (data && Array.isArray(data.data.heartSensor)) {
        // Extracting only the "value" field from each object in the array
        const values = data.data.heartSensor.map(item => item.value);
        setHeartRateData(values);
      } else {
        console.error('Invalid data format from the API');
      }
      // Update state with the new data
    });
    // Function to fetch heart rate data from the API
    
    // Call the fetch function
    fetchHeartRateData();
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  // Log the state for debugging
  console.log('heartRateData state:', heartRateData);

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
        <Graph data={heartRateData}/>

        {/* ROW 2 */}
        
        <Graph data={heartRateData}/>

      {/* ROW 3 */}
      <Graph data={heartRateData}/>
        
      <Graph data={heartRateData}/>
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
          width="38%"
          zIndex={1}
        />
        )}
      </Box>
      <div>
      {/* Render your component using heartRateData */}
      {heartRateData.map((item, index) => (
        <div key={index}>
          Heart Rate: {item}
        </div>
      ))}
    </div>
    </Box>
  );
};

export default DefaultPage;
