import axios from "axios";

import React, { useEffect, useState, useRef } from "react";

import FlexBetween from "../FlexBetween";

import Header from "../Header";

import { useLocation, useNavigate } from "react-router-dom";

import { getDeviceIds, getSensorDB, getLoc } from "../../slices/adminApiSlice";

import { Box, MenuItem, TextField, useMediaQuery } from "@mui/material";

import Body_Male from "../../assets/Body_Male.png";

import Graph from "../Graph";

import { useDispatch, useSelector } from "react-redux";

import * as Realm from "realm-web";

import IconButton from "@mui/material/IconButton";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import PowerIcon from "@mui/icons-material/Power";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { getGraphDataByDate } from "../../slices/usersApiSlice";
import { Button } from "react-bootstrap";
import ApexGraph from "./ApexGraph";
import { useTheme } from "@emotion/react";

const app = new Realm.App({ id: "application-0-vdlpx" });

const ENDPOINT = "http://localhost:3000";

var socket;

const DefaultPage = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const [heartRateTimeStamp, setheartRateTimeStamp] = useState([]);

  const [latitude, setLatitude] = useState(23); // Initial latitude

  const [longitude, setLongitude] = useState(77); // Initial longitude

  const [connectionStatus, setConnectionStatus] = useState(false);

  const [startDate, setStartDate] = useState();

  const [endDate, setEndDate] = useState();

  const [sensorType, setSensorType] = useState("");

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());

      // Logic to check time difference and set connectionStatus

      const latestTimestamp = heartRateTimeStamp[heartRateTimeStamp.length - 1];

      let connectionStatus = true; // Default to true

      // console.log(heartRateTimeStamp);

      // console.log(latestTimestamp);

      if (latestTimestamp) {
        const latestTimeParts = latestTimestamp.split(":");

        const latestTime = new Date();

        latestTime.setHours(
          parseInt(latestTimeParts[0]),

          parseInt(latestTimeParts[1]),

          parseInt(latestTimeParts[2])
        );

        const currentTime = new Date();

        const timeDifference = (currentTime - latestTime) / 1000; // Difference in seconds

        if (timeDifference > 5) {
          connectionStatus = false;
        }
      } else {
        // heartRateTimeStamp is empty

        connectionStatus = false;
      }

      // Assuming you have a state variable named connectionStatus

      setConnectionStatus(connectionStatus);
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [heartRateTimeStamp]);

  const mapContainerRef = useRef(null);

  const [initialTable, setinitialTable] = useState({});

  const { state: userData } = useLocation();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const dispatch = useDispatch();

  var devices = [];

  const [user, setUser] = useState();

  const [heartRateData, setHeartRateData] = useState([]);

  const [BreathRateSensorData, setBreathRateSensorData] = useState([]);

  const [BreathRateSensorTimeStamp, setBreathRateSensorTimeStamp] = useState(
    []
  );

  const [VentilatonSensorData, setVentilatonSensorData] = useState([]);

  const [GraphDataByDate, setGraphDataByDate] = useState([]);

  const [GraphDataByDateTimestamp, setGraphDataByDateTimestamp] = useState([]);

  const [VentilatonSensorTimeStamp, setVentilatonSensorTimeStamp] = useState(
    []
  );

  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );

  const [events, setEvents] = useState([]);

  async function getGraphData() {
    const url = "http://localhost:3000/api/admin/getGraphData";

    const body = JSON.stringify({
      id: "31vBWopGfQfudlsSHkKS0Prgkg42",

      sensorType: sensorType,

      startTimeStamp: convertDateToUnix(startDate),

      endTimeStamp: convertDateToUnix(endDate),
    });

    console.log(
      "dates",
      convertDateToUnix(startDate) + "  " + convertDateToUnix(endDate)
    );

    try {
      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: body,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);

      throw error;
    }
  }

  const handleSubmit = () => {
    console.log("startdate", startDate);
    console.log("enddate", endDate);
    console.log("sendor", sensorType);

    console.log("startdate", convertDateToUnix(startDate));

    getGraphData()
      .then((data) => {
        if (data && data.length > 0) {
          // Extracting values from data
          const values = data.map((item) => item.value);

          const timestamp = data.map((item) => item.timestamp.slice(11, 19));
          navigate(`/GraphByDate`, {state : {
            data1 : values,
            data2 : timestamp,
            startDate : startDate,
            endDate : endDate,
            sensorType: sensorType,
          }});
          

          setGraphDataByDate(values);

          setGraphDataByDateTimestamp(timestamp);

          console.log("shiv", GraphDataByDate);

          console.log("shiv", GraphDataByDateTimestamp);
        }
        else{
          window.confirm("invalid dates");
          console.log("Invalid dates");
        }
      })

      .catch((error) => {
        // Handle errors here
      });
  };

  useEffect(() => {
    const devicesdb = async () => {
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          // console.log(id);

          const response = await getDeviceIds(token, id);

          console.log("req made ");

          if (response.status === 200) {
            // console.log('in 200');

            // console.log(response.data.deviceDocuments);

            for (var r in response.data.deviceDocuments) {
              if (
                response.data.deviceDocuments[r].currentUserId ==
                userData.data.currentUserId
              )
                // console.log(response.data.deviceDocuments[r].location[0].lat);

                // console.log(response.data.deviceDocuments[r].location[0].lon);

                setLatitude(response.data.deviceDocuments[r].location[0].lat);

              setLongitude(response.data.deviceDocuments[r].location[0].lon);
            }
          }
        }

        const user2 = await app.logIn(Realm.Credentials.anonymous());

        setUser(user2);

        const mongodb2 = app.currentUser.mongoClient("mongodb-atlas");

        const collection2 = mongodb2.db("test").collection("devices");

        // console.log('device db watch stream');

        const changeStream2 = collection2.watch();

        for await (const change of changeStream2) {
          // console.log('device db watch stream changes');

          if (
            userData.data.currentUserId == change?.fullDocument?.currentUserId
          ) {
            // console.log('Here in device changes');

            // console.log(change.fullDocument.location[0].lat);

            // console.log(

            //   change.fullDocument.location[0].lat,

            //   change.fullDocument.location[0].lon

            // );

            const lat = change.fullDocument.location[0].lat;

            const lon = change.fullDocument.location[0].lon;

            setLatitude(lat);

            setLongitude(lon);
          } else {
            console.log("Data is Not Relevant");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // getGraphData()

    // .then(data => {

    //   if (data && data.length > 0) {

    //     // Extracting values from data

    //     const values = data.map(item => item.value);

    //     const timestamp = data.map(item => item.timestamp.slice(11, 19));

    //     // Assuming setGraphDataByDate is a function to set state in React

    //     setGraphDataByDate(values);

    //     setGraphDataByDateTimestamp(timestamp);

    //     console.log("shiv", GraphDataByDate);

    //     console.log("shiv", GraphDataByDateTimestamp);

    //   }

    //   })

    // .catch(error => {

    //     // Handle errors here

    // });

    devicesdb();

    // console.log('mapbox setting up');

    // Load Mapbox script dynamically

    const mapboxScript = document.createElement("script");

    mapboxScript.src =
      "https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js";

    mapboxScript.onload = initializeMap;

    document.body.appendChild(mapboxScript);

    // Load Mapbox stylesheet

    const mapboxLink = document.createElement("link");

    mapboxLink.href =
      "https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css";

    mapboxLink.rel = "stylesheet";

    document.head.appendChild(mapboxLink);

    function initializeMap() {
      if (mapContainerRef.current) {
        mapboxgl.accessToken =
          "pk.eyJ1IjoicGl5dXNoMjIiLCJhIjoiY2x1ZWM2cWtlMXFhZjJrcW40OHA0a2h0eiJ9.GtGi0PHDryu8IT04ueU7Pw";

        const map = new mapboxgl.Map({
          container: "map",

          // Choose from Mapbox's core styles, or make your own style with Mapbox Studio

          style: "mapbox://styles/mapbox/streets-v12",

          zoom: 14.0,
        });

        map.on("load", async () => {
          // Get the initial location of the International Space Station (ISS).

          const geojson = await getLocation();

          // Add the ISS location as a source.

          map.addSource("iss", {
            type: "geojson",

            data: geojson,
          });

          // Add the rocket symbol layer to the map.

          map.addLayer({
            id: "iss",

            type: "symbol",

            source: "iss",

            layout: {
              // This icon is a part of the Mapbox Streets style.

              // To view all images available in a Mapbox style, open

              // the style in Mapbox Studio and click the "Images" tab.

              // To add a new image to the style at runtime see

              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/

              "icon-image": "rocket",
            },
          });

          // Update the source from the API every 2 seconds.

          const updateSource = setInterval(async () => {
            // const geojson = await getLocation(updateSource);

            map.getSource("iss").setData(geojson);
          }, 5000);

          async function getLocation(updateSource) {
            // Make a GET request to the API and return the location of the ISS.

            try {
              // const myHeaders = new Headers();

              // myHeaders.append(

              //   'apiKey',

              //   '3eIHUiQwLwgF9VQoiPbfcgMMo5NcmPcK4i6h4QuxBrXWnDUcctRFhw8SU9ZwVmlX'

              // );

              // myHeaders.append('Content-Type', 'application/json');

              // const raw = JSON.stringify({

              //   dataSource: 'whmstestdb',

              //   database: 'test',

              //   collection: 'devices',

              //   filter: {

              //     currentUserId: 'gk7mhNS7MxNBDLwVQOT08xn5M4W2',

              //   },

              // });

              // const requestOptions = {

              //   method: 'POST',

              //   headers: myHeaders,

              //   body: raw,

              //   redirect: 'follow',

              //   mode: 'no-cors',

              // };

              // const response = await fetch(

              //   'https://data.mongodb-api.com/app/data-atyht/endpoint/data/v1/action/find',

              //   requestOptions

              // );

              // const loc = await response.json();

              // console.log(loc);

              // let data = JSON.stringify({

              //   dataSource: 'whmstestdb',

              //   database: 'test',

              //   collection: 'devices',

              //   filter: {

              //     currentUserId: 'gk7mhNS7MxNBDLwVQOT08xn5M4W2',

              //   },

              // });

              // let config = {

              //   method: 'post',

              //   maxBodyLength: Infinity,

              //   url: 'https://cors-anywhere.herokuapp.com/https://data.mongodb-api.com/app/data-atyht/endpoint/data/v1/action/find',

              //   headers: {

              //     apiKey:

              //       '3eIHUiQwLwgF9VQoiPbfcgMMo5NcmPcK4i6h4QuxBrXWnDUcctRFhw8SU9ZwVmlX',

              //     'Content-Type': 'application/json',

              //   },

              //   data: data,

              // };

              // console.log('In here ', userData.data.currentUserId);

              // const response = await getLocation(

              //   token,

              //   userData.data.currentUserId

              // ).then((response) => {

              //   console.log(JSON.stringify(response.data));

              // });

              // const response = await fetch(

              //   'https://api.wheretheiss.at/v1/satellites/25544',

              //   { method: 'GET' }

              // );

              const dataloc = await getLoc(token, userData.data.currentUserId);

              const latitude = dataloc.data[0].lat;

              const longitude = dataloc.data[0].lon;

              // Fly the map to the location.

              map.flyTo({
                center: [longitude, latitude],

                speed: 4.5,
              });

              // Return the location of the ISS as GeoJSON.

              return {
                type: "FeatureCollection",

                features: [
                  {
                    type: "Feature",

                    geometry: {
                      type: "Point",

                      coordinates: [longitude, latitude], //lon lat
                    },
                  },
                ],
              };
            } catch (err) {
              // If the updateSource interval is defined, clear the interval to stop updating the source.

              if (updateSource) clearInterval(updateSource);

              throw new Error(err);
            }
          }
        });
      }
    }

    return () => {
      // Clean up Mapbox instance if needed
    };
  }, []); // Empty dependency array: Execute only once on component mount

  const convertDateToUnix = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const unixTimestamp = dateObject.getTime();
      return unixTimestamp;
    }
  };

  useEffect(() => {
    const login = async () => {
      try {
        const id = userData.data.currentUserId;

        if (setEvents.length <= 1) {
          // console.log(id);

          const response = await getSensorDB(token, id);

          if (response.status === 200) {
            console.log("shivanshu", response.data);

            setHeartRateData(
              response.data.heartSensor.map((item) => item.value)
            );

            setheartRateTimeStamp(
              response.data.heartSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setBreathRateSensorData(
              response.data.BreathRateSensor.map((item) => item.value)
            );

            setBreathRateSensorTimeStamp(
              response.data.BreathRateSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setVentilatonSensorData(
              response.data.VentilatonSensor.map((item) => item.value)
            );

            setVentilatonSensorTimeStamp(
              response.data.VentilatonSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setEvents(response.data.deviceDocuments);

            setinitialTable(response.data.deviceDocuments);
          }
        }

        const user = await app.logIn(Realm.Credentials.anonymous());

        setUser(user);

        const mongodb = app.currentUser.mongoClient("mongodb-atlas");

        const collection = mongodb.db("test").collection("sensordbs");

        // console.log('sensor db watch stream');

        const changeStream = collection.watch();

        for await (const change of changeStream) {
          // console.log('sensor db watch stream changes');

          if (userData.data.currentUserId == change?.fullDocument?._id) {
            setHeartRateData(
              change.fullDocument.heartSensor.map((item) => item.value)
            );

            setheartRateTimeStamp(
              change.fullDocument.heartSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setBreathRateSensorData(
              change.fullDocument.BreathRateSensor.map((item) => item.value)
            );

            setBreathRateSensorTimeStamp(
              change.fullDocument.BreathRateSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );

            setVentilatonSensorData(
              change.fullDocument.VentilatonSensor.map((item) => item.value)
            );

            setVentilatonSensorTimeStamp(
              change.fullDocument.VentilatonSensor.map((item) =>
                item.timestamp.slice(11, 19)
              )
            );
          } else {
            console.log("Data is Not Relevant");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    login();
  }, []);

  return (
    <>
      {/* <UniqueLayout data={userData} />x */}

      <Box m="1.5rem 2.5rem">
        <FlexBetween></FlexBetween>

        <form
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            marginBottom: "2rem",
            marginLeft: "2rem",
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            style={{ width: "125px" }}
            select
            label="Sensor Type"
            value={sensorType}
            onChange={(e) => setSensorType(e.target.value)}
          >
            <MenuItem value="heartSensor">Heart Rate</MenuItem>
            <MenuItem value="BloodPressureSensor">Breath Rate</MenuItem>
            <MenuItem value="VentilatonSensor">VentilatonSensor</MenuItem>
            <MenuItem value="TidalVolumeSensor">TidalVolumeSensor</MenuItem>
            <MenuItem value="ActivitySensor">ActivitySensor</MenuItem>
            <MenuItem value="CadenceSensor">CadenceSensor</MenuItem>
          </TextField>

          <Button
            onClick={handleSubmit}
            variant="contained"
            color={theme.palette.secondary[700]}
          >
            Submit
          </Button>
        </form>

        <Box
          margin="20px"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="160px"
          gap="20px"
          zIndex={2}
          sx={{
            "& > div": {
              gridColumn: isNonMediumScreens ? undefined : "span 12",
            },
          }}
        >
          {/* <ApexGraph
            name={sensorType}
            data={GraphDataByDate}
            timestamp={GraphDataByDateTimestamp}
            max={90}
            zoomEnabled={true}
          /> */}

          <div
            id="map"
            className="MuiBox-root css-1nt5awt"
            ref={mapContainerRef}
            style={{ height: "300px" }}
          />

          {/* ROW 1 */}

          <ApexGraph
            name={"HeartRate"}
            data={heartRateData}
            timestamp={heartRateTimeStamp}
            max={90}
            zoomEnabled={false}
          />

          {/* ROW 2 */}

          <ApexGraph
            name={"BreathRateSensor"}
            data={BreathRateSensorData}
            timestamp={BreathRateSensorTimeStamp}
            max={90}
            zoomEnabled={false}
          />

<ApexGraph
            name={"VentilationSensor"}
            data={VentilatonSensorData}
            timestamp={VentilatonSensorTimeStamp}
            max={90}
            zoomEnabled={false}
          />

          {/* ROW 3 */}

          {/* <Graph

            name={'Testing'}

            data={VentilatonSensorData}

            timestamp={VentilatonSensorTimeStamp}

            max={90}

          /> */}

          {/* <Graph data={heartRateData}/> */}

          {/* ROW 4 */}

          {isNonMediumScreens && (
            <Box position="relative">
              <img
                alt="body_male"
                src={Body_Male}
                style={{
                  gridColumn: "span 1",

                  gridRow: "span 2",

                  position: "fixed",

                  top: "5rem",

                  right: 2,

                  height: "90vh",

                  width: "38%",

                  zIndex: 2,
                }}
              />

              <Tooltip
                title={`Heart rate : ${heartRateData[39]}`}
                arrow
                placement="right-end"
                style={{
                  fontSize: "15",

                  position: "fixed",

                  top: "13rem",

                  right: 240,

                  zIndex: 3,
                }}
              >
                <IconButton>
                  <FavoriteRoundedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={`Connection Status :  ${currentTime} and ${
                  heartRateTimeStamp[heartRateTimeStamp.length - 1]
                }`}
                arrow
                placement="right-end"
                style={{
                  fontSize: "15",

                  position: "fixed",

                  top: "14rem",

                  right: 250,

                  zIndex: 3,

                  color: `${connectionStatus ? "green" : "red"}`,
                }}
              >
                <IconButton>
                  <PowerIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* <div>

        {heartRateData.map((item, index) => (

          <div key={index}>Heart Rate: {item}</div>

        ))}

      </div> */}
      </Box>
    </>
  );
};

export default DefaultPage;
