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
import Graph from "../Graph";

const DefaultPage = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");


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
        <Graph/>

        {/* ROW 2 */}
        
        <Graph/>

      {/* ROW 3 */}
      <Graph/>
        
      <Graph/>
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
    </Box>
  );
};

export default DefaultPage;
