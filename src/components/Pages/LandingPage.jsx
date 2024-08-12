import React from "react";
import profileImage from "../../assets/profile.png";
import horizontalPhoto from "../../assets/horizontal_photo.jpg";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  useTheme,
  Card,
  CardContent,
  Icon,
  Grid,
  Divider,
} from "@mui/material";
import FlexBetween from "../FlexBetween";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import FiberManualRecordTwoToneIcon from "@mui/icons-material/FiberManualRecordTwoTone";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/register");
  };
  const points = [
    "Single integrated wearable health monitoring system",
    "Bluetooth connectivity, family group sharing",
    "Real-time monitoring on mobile app",
    "Customizable as per industry requirements",
    "Washable, quick dry flexible fabric",
    "Routine body check-up to identify possible deviations from the normal health",
    "Breathable, lightweight, anti-odor, chlorine resistant, UV protection",
    "Data interpretation and analysis module storage capability",
    "Virtual Hospital, Telemedicine can be possible with W-HMS",
    "Works on flexible TEG utilizing body heat and no sweating",
  ];
  const application = [
    "Health care sector: Patients, medical staff, telemedicine",
    "Remote Locations: Mountains, Hilly ranges, Sea, etc.",
    "Defence sector: Soldiers, para staff, pilots, sailors, etc.",
    "Automobile: Driver Drowsiness & Co-Passenger",
    "Oil and gas sector: Employees, workers - Mining Industry",
    "Aerospace: Astronauts, trainee, etc.",
    "Sports Industry: Athletes, Cyclists, adventurers, sky divers, scuba divers, etc."
  ];
  return (
    <Box>
      <AppBar
        sx={{
          position: "static",
          background: "none",
          boxShadow: "none",
          borderBottom: `1px solid ${theme.palette.secondary[400]}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LEFT SIDE */}
          <FlexBetween>
            <FlexBetween borderRadius="9px" gap="2rem" p="0.1rem 1.5rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Typography href="#home" fontSize="14px" fontWeight="bold">
                W-HMS
              </Typography>
            </FlexBetween>
          </FlexBetween>

          <FlexBetween gap="6.5rem">
            <FlexBetween gap="2.5rem">
              <Typography
                component="a"
                href="#home"
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#75777B",
                    cursor: "pointer",
                  },
                }}
              >
                Home
              </Typography>
              <Typography
                component="a"
                href="#about"
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#75777B",
                    cursor: "pointer",
                  },
                }}
              >
                About
              </Typography>
              <Typography
                component="a"
                href="#contact"
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#75777B",
                    cursor: "pointer",
                  },
                }}
              >
                Contact
              </Typography>
              <Button
                onClick={handleClick}
                sx={{
                  backgroundColor: "#7CD6AB",
                  fontSize: "0.8rem",
                  color: "black",
                  fontWeight: "700",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textTransform: "none",
                  gap: "1rem",
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#75777B",
                  },
                }}
              >
                Go to Console
              </Button>
            </FlexBetween>
          </FlexBetween>
        </Toolbar>
      </AppBar>

      {/* Banner */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: "85rem", // Adjust height according to AppBar height
          backgroundColor: theme.palette.background.default,
          padding: "2rem",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "50%",
            backgroundColor: "#e0e0e0",
            borderRadius: "8px",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `url(${horizontalPhoto}) no-repeat center center/cover`,
            position: "relative",
          }}
        >
          <Button
            sx={{
              backgroundColor: "#7CD6AB",
              fontSize: "1rem",
              color: "black",
              fontWeight: "700",
              textTransform: "none",
              padding: "0.75rem 1.5rem",
              position: "absolute",
              bottom: "10px",
              left: "10px",
              "&:hover": {
                color: "white",
                backgroundColor: "#7CD6AB",
              },
            }}
          >
            Download
          </Button>
        </Box>

        <Grid
          container
          spacing={4}
          m="1rem 6rem 5rem 6rem"
          p="0rem 4rem"
          sx={{
            color: "white",
            borderTop: `1px solid ${theme.palette.secondary[400]}`,
          }}
        >
          <Grid item xs={2}>
            <Typography
              sx={{ fontSize: "2rem", fontWeight: "700", color: "#7CD6AB" }}
            >
              {" "}
              About Us{" "}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <Typography Wrap>
              Wearable Health Monitoring System Wearables in the healthcare
              domain often have embedded medical sensors, which collect and send
              health data to their users or care providers. These devices
              usually have a convenient design, are non-invasive, and are meant
              to be integrated into everyday life. Health monitoring devices can
              also be lifesaving for patients at risk of experiencing rapidly
              deteriorating conditions, such as dropping blood sugar, or those
              needing medication reminders. It is beneficial for healthcare
              specialists to monitor patients’ medical status, identify any
              changes and respond rapidly by applying appropriate treatment. A
              wearable all-in-one Health Monitoring system with real time
              monitoring and user interface to monitor and communicate body’s
              vital information like ECG, Body Temperature, SPO2, Blood
              Pressure, etc. which is critically needed to analyse the body
              situation working in a harsh and rugged environment like Oil & Gas
              Industry, Aerospace, Security and Defence, Health and Safety.
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={4}
          m="0rem 6rem"
          p="0rem 4rem"
          sx={{
            color: "white",
            borderTop: `1px solid ${theme.palette.secondary[400]}`,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#7CD6AB",
            }}
          >
            Features
          </Grid>
          {points.map((_, index) => (
            <Grid item xs={4} key={index} sx={{ height: "5rem" }}>
              <Typography>
                <FiberManualRecordTwoToneIcon /> {points[index]}{" "}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          spacing={4}
          m="0rem 6rem"
          p="0rem 4rem"
          sx={{
            color: "white",
            borderTop: `1px solid ${theme.palette.secondary[400]}`,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#7CD6AB",
            }}
          >
            Applications
          </Grid>
          {application.map((_, index) => (
            <Grid item xs={4} key={index} sx={{ height: "5rem" }}>
              <Typography>
                <FiberManualRecordTwoToneIcon /> {application[index]}{" "}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.secondary[400]}`,
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <Typography>Footer content here.</Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
