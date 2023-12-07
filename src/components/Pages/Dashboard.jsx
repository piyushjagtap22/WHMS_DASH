import React, { useEffect, useState } from "react";
import FlexBetween from "../FlexBetween";
import Header from "../Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import BreakdownChart from "../BreakdownChart";
import OverviewChart from "../OverviewChart";
// import { useGetUserQuery } from "state/api";
import {
  createAdmin,
  getAllUsers,
  removeAdmin,
} from './../../slices/superAdminApiSlice';
import { useDispatch, useSelector } from "react-redux";
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

const Dashboard = () => {
  const [data, setUsers] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { userInfo } = useSelector((state) => state.superAdmin);
  const token = useSelector(
    (state) => state.auth.AuthUser.stsTokenManager.accessToken
  );
  // const {data } = useGetUserQuery();
  console.log(userInfo + "userInfo");
  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getAllUsers(token);
        console.log(response + "R ");
        if (response.status === 200) {
          setUsers(response.data);
          console.log(response.data);
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        // Handle any network or API request errors
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch, token]);  const columns = [
    {
      field: "_id",
      headerName: "Device ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "User",
      flex: 0.4,
    },
    {
      field: "email",
      headerName: "email",
      flex: 0.4,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.4,
    },
    {
      field: "profile_exist",
      headerName: "Profile exist",
      flex: 0.4,
    },
    {
      field: "roles",
      headerName: "Role",
      flex: 0.3,
    },
    {
      field: "role",
      headerName: "BP",
      flex: 0.3,
    },
  ];

  const labels = ["jan", "feb", "Mar", "Apr", "May", "Jun", "jul"];

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

 const data2 = {
  labels,
  datasets: [
    {
      label: "React",
      data: [32, 42, 51, 37, 51, 65, 40],
      backgroundColor: "green",
      borderColor: "green",
    },
    {
      label: "Angular",
      data: [37, 42, 41, 50, 31, 44, 40],
      backgroundColor: "#F44236",
      borderColor: "#F44236",
    },
  ],
};

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        {/* <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}


        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {/* <OverviewChart view="sales" isDashboard={true} /> */}
          {/* <div style={{ width: 600, height: 300 }}> */}
          
      <Line options={options} data={data2} />
    {/* </div> */}
        </Box>



        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            // loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data) || []}
            columns={columns}
          />
        </Box>

      </Box>
      {/* <LineChart width={600} height={300} data={data1}>
      <Line type="monotone" dataKey="react" stroke="#2196F3" strokeWidth={4} />

      <Line type="monotone" dataKey="vue" stroke="#FFCA29" strokeWidth={4} />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis dataKey="" />
      <Tooltip />
      <Legend />
    </LineChart> */}
    </Box>
  );
};

export default Dashboard;
