import React from 'react';
// import { delay } from '@reduxjs/toolkit/dist/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, Toaster } from 'react-hot-toast';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  Card,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../firebase.js';
import { setAuthState } from '../../slices/authSlice';
import { setLoading } from '../../slices/loadingSlice';
import {
  addDeviceID,
  approveDocById,
  disableAdmin,
  enableAdmin,
  getAllAdmin,
} from './../../slices/superAdminApiSlice';
import Navbar from './Navbar.jsx';

const SuperAdminScreen = () => {
  const delay = (milliseconds) =>
    new Promise((resolve) => {
      console.log('Delay called ', milliseconds);
      setTimeout(resolve, milliseconds);
    });
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState([]);
  const [currentlyExpandedUser, setCurrentlyExpandedUser] = useState(null);
  const dispatch = useDispatch();
  const [adminInfo, setAdminInfo] = useState();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const SUPERADMIN_URL = `${import.meta.env.VITE_REACT_API_URL}/api/superadmin`;

  const [buttonLoader, setButtonLoader] = useState(false);
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  // const token = '';
  const [document, setdocument] = useState(null);
  const { userInfo } = useSelector((state) => state.superAdmin);
  const [adminUsers, setAdminUsers] = useState([]); // State to store admin users
  const [button, setButton] = useState('false');
  const [open, setOpen] = React.useState(false);
  const [selectedAdmin, setselectedAdmin] = useState('');
  const [showUserIds, setShowUserIds] = useState({});
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [textFieldValue, setTextFieldValue] = useState('');
  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await delay(1000);
      await signOut(auth);

      // Listen for changes in authentication state
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          // User is successfully signed out, navigate to '/register'
          dispatch(setAuthState('/register'));
          dispatch(setAuthUser(null));
          dispatch(setMongoUser(null));
          // dispatch(setLoading(true));
          console.log('Navigating to /register');

          // Use navigate to trigger navigation
          navigate('/register');

          // Make sure this log is reached
          console.log('Navigation completed');

          unsubscribe(); // Unsubscribe to avoid further callbacks
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false)); // Hide loader when operation completes
    }
  };
  useEffect(() => {
    // Fetch user data when the component mountsout
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getAllAdmin(token);
        console.log('users data ', response.data.admins);
        if (response.status === 200) {
          setUsers(response.data.admins);
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        // Handle any network or API request errors
      }
    };
    fetchData();
  }, [dispatch, token, button, document]);

  const handleOpen = async (userId) => {
    setOpen(true);

    console.log('enable Admin');
    const apiUrl = `${SUPERADMIN_URL}/getDocById`;
    setselectedAdmin(userId);
    const authToken = `Bearer ${token}`;
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
      body: JSON.stringify({ _id: userId }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setdocument(imageUrl);
      })
      .catch((error) => console.error('Error fetching image:', error));

    // try {
    //   const response = await docById({ "_id": `${userId}`}, token);

    //   if (response) {
    //     console.log(response); // Assuming the user data is in the response data
    //     setButton(!button);
    //     console.log('response final',response)
    //     setdocument(response);
    //   } else {
    //     // Handle any errors or show a message
    //   }
    //   } catch(error) {
    //     console.log(error);
    //   }
  };
  const handleClose = () => setOpen(false);

  // const adminToggle = async (user) => {
  //   console.log();
  //   if (user.roles[0] === 'superadmin') {
  //     console.log('Already Superadmin');
  //   } else {
  //     let response;
  //     if (user.roles[0] === 'admin') {
  //       response = await removeAdmin({ _id: user._id }, token);
  //       if (response.status === 200) {
  //         console.log(response);
  //         // Update the user's role in the local state
  //         setUsers((prevUsers) =>
  //           prevUsers.map((prevUser) =>
  //             prevUser._id === user._id
  //               ? { ...prevUser, roles: ['unallocated'] }
  //               : prevUser
  //           )
  //         );
  //       }
  //     } else {
  //       response = await createAdmin({ _id: user._id }, token);
  //       if (response.status === 200) {
  //         console.log(response);
  //         // Update the user's role in the local state
  //         setUsers((prevUsers) =>
  //           prevUsers.map((prevUser) =>
  //             prevUser._id === user._id
  //               ? { ...prevUser, roles: ['admin'] }
  //               : prevUser
  //           )
  //         );
  //       }
  //     }
  //   }
  // };

  const approveDoc = async (userId) => {
    // alert('clicked on' + userId);
    try {
      setButtonLoader(true);
      console.log('alert continues');
      const response = await approveDocById({ adminID: `${userId}` }, token);

      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        return toast.success('Document Approved');
      } else {
        // Handle any errors or show a message
        toast.error('Something went wrong, Please try again later');
      }
    } catch (err) {
      return toast.error(err.message);
    } finally {
      setdocument(null);
      setOpen(false);
      setButtonLoader(false);
    }
  };

  const fetchAdminUsers = async (admin) => {
    console.log(admin);
  };

  const expandUser = (user) => {
    fetchAdminUsers(user);
    setAdminInfo('True');
    //if (expandedUsers.includes(user._id)) {
    if (currentlyExpandedUser === user._id) {
      setCurrentlyExpandedUser(null);
      setExpandedUsers((prevExpandedUsers) =>
        prevExpandedUsers.filter((userId) => userId !== user._id)
      );
    } else {
      setCurrentlyExpandedUser(user._id);
      setExpandedUsers((prevExpandedUsers) => [...prevExpandedUsers, user._id]);
    }
  };

  const enableAdminByID = async (userId) => {
    // Perform your query or action using the retrieved data
    const result = window.confirm(
      'Do you want to Navigate to User details Page'
    );

    if (result) {
      console.log(`Clicked user ID: ${userId}`);
      console.log('enable Admin');
      try {
        const response = await enableAdmin({ adminId: `${userId}` }, token);
        console.log(response);
        if (response.status === 200) {
          console.log(response); // Assuming the user data is in the response data
          setButton(!button);
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('User Denied to Change Status');
    }
  };

  const addDevice = async (data) => {
    console.log(textFieldValue);
    // console.log("check",data);
    try {
      alert('Are you sure you want to add device' + textFieldValue);

      const response = await addDeviceID(
        { adminId: `${data}`, deviceIds: [`${textFieldValue}`] },
        token
      );
      // const response = await addDeviceID({"adminId": "gL3g7f1sOSUGGyQmrB3mvOn68xm1","deviceIds": ["deviceId9"]}, token);
      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        setTextFieldValue('');
        setButton(!button);
      } else {
        // Handle any errors or show a message
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    // Update the state with the current value of the text field
    setTextFieldValue(event.target.value);
  };

  const disableAdminByID = async (userId) => {
    // Perform your query or action using the retrieved data

    const result = window.confirm(
      'Do you want to Navigate to User details Page'
    );

    if (result) {
      console.log(`Clicked user ID: ${userId}`);
      console.log('enable Admin');
      try {
        const response = await disableAdmin({ adminId: `${userId}` }, token);
        console.log(response);
        if (response.status === 200) {
          console.log(response); // Assuming the user data is in the response data
          setButton(!button);
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('User Denied to Change Status');
    }
  };

  const handleShowUserIds = (adminId) => {
    setShowUserIds((prevShowUserIds) => ({
      ...prevShowUserIds,
      [adminId]: !prevShowUserIds[adminId],
    }));
  };

  const documentByID = async (userId) => {
    alert(`clicked by ${userId}`);
    console.log('enable Admin');
    try {
      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        setButton(!button);
      } else {
        // Handle any errors or show a message
      }
    } catch (error) {
      console.log(error);
    }

    //   try {
    //     const response = await enableAdmin({ adminId: `${userId}`}, token);
    //     console.log(response);
    //     if (response.status === 200) {
    //       console.log(response); // Assuming the user data is in the response data
    //       setButton(!button);
    //     } else {
    //       // Handle any errors or show a message
    //     }
    // } catch(error) {
    //   console.log(error);
    // }
  };

  // const addUserToAdmin = async (userId, adminId) => {
  //   console.log('mapped');
  //   try {
  //     console.log('in fetchdata');
  //     const data = {
  //       adminId: adminId,
  //       userIds: [userId],
  //     };
  //     console.log(data);
  //     const response = await AddUsersToAdmin(data, token);
  //     console.log(response);
  //     if (response.status === 200) {
  //       console.log(response); // Assuming the user data is in the response data
  //       // setAdminUsers((prevUsers) => [
  //       //   ...prevUsers,
  //       //   users.find((user) => user._id === userId),
  //       // ]);
  //       // setUsers((prevUsers) => prevUsers.filter((user) => user._id !== _id));
  //     } else {
  //       // Handle any errors or show a message
  //     }
  //   } catch (error) {
  //     // Handle any network or API request errors
  //   }
  // };

  //const isExpanded = (user) => expandedUsers.includes(user._id);
  // const isExpanded = (user) => user._id === currentlyExpandedUser;

  function Row({ row }) {
    const [open, setOpen] = useState(false);
    console.log(row);
    return (
      <React.Fragment>
        <Toaster toastOptions={{ duration: 4000 }} />
        <TableRow>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.email}</TableCell>
          <TableCell>{row._id}</TableCell>
          <TableCell>
            {row?.roles[0] == 'admin' ? (
              <>
                <a
                  href='#'
                  onClick={(event) => handleOpen(row._id)}
                  className='link-button'
                  style={{ textDecoration: 'underline' }}
                >
                  See documents
                </a>
                <IconButton onClick={() => handleOpen(row._id)}>
                  <VisibilityIcon />
                </IconButton>
              </>
            ) : (
              <>
                <a
                  href='#'
                  style={{ textDecoration: 'underline' }}
                  className='link-button disabled'
                >
                  See documents
                </a>
                <IconButton onClick={() => handleOpen(row._id)}>
                  <VisibilityIcon />
                </IconButton>
              </>
            )}
          </TableCell>
          <TableCell
            sx={{
              width: '10%',
              color: row.roles[0] == 'admin' ? 'green' : 'red',
            }}
          >
            {row?.adminDetails[0]?.accountEnabled ? (
              <>
                <a
                  href='#'
                  style={{ color: '#7CD6AB' }}
                  onClick={() => disableAdminByID(row._id)}
                >
                  Enabled
                </a>
              </>
            ) : (
              <>
                <a
                  href='#'
                  style={{ color: '#FF553C' }}
                  onClick={() => enableAdminByID(row._id)}
                >
                  Disabled
                </a>
              </>
            )}
          </TableCell>
          <TableCell>
            Device List
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box
                margin={2}
                sx={{
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#191C23',
                }}
              >
                <Typography
                  variant='h6'
                  gutterBottom
                  component='div'
                  sx={{ fontWeight: 'bold' }}
                >
                  Devices
                </Typography>
                <Table size='small' aria-label='devices'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 'bold', backgroundColor: '#191C23' }}
                      >
                        Device ID
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ padding: '16px' }}>
                    {row?.adminDetails[0]?.deviceIds.map((deviceID) => (
                      <TableRow
                        sx={{ padding: '16px 32px 16px 32px' }}
                        key={deviceID}
                      >
                        <TableCell sx={{ padding: '16px 32px 16px 32px' }}>
                          {deviceID}
                        </TableCell>
                      </TableRow>
                    ))}

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        padding: '16px',
                      }}
                    >
                      <TextField
                        label='Add Device id'
                        variant='outlined'
                        size='small'
                        onChange={handleInputChange}
                        value={textFieldValue}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'grey', // Default border color
                            },
                            '&:hover fieldset': {
                              borderColor: '#7CD6AB', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#7CD6AB', // Border color when focused
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'grey', // Default label color
                          },
                          '&:hover .MuiInputLabel-root': {
                            color: '#7CD6AB', // Label color on hover
                          },
                          '& .Mui-focused .MuiInputLabel-root': {
                            color: '#7CD6AB', // Label color when focused
                          },
                        }}
                      />
                      <Button
                        sx={{
                          background: '#7CD6AB',
                          color: '#121318',
                          textTransform: 'none',
                        }}
                        onClick={() => addDevice(row._id)}
                      >
                        Add Device
                      </Button>
                    </Box>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  console.log('in superadmin');
  return (
    <>
      <Box flexGrow={1}>
        <Navbar user={data || {}} />
      </Box>
      <TableContainer
        sx={{ padding: '32px 32px 32px 32px', backgroundColor: '#121318' }}
        // component={Paper}
      >
        <Table
          sx={{ backgroundColor: '#121318', padding: '16px' }}
          aria-label='collapsible table'
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.palette.grey[400] }}>
                Name
              </TableCell>
              <TableCell sx={{ color: theme.palette.grey[400] }}>
                Email
              </TableCell>
              <TableCell sx={{ color: theme.palette.grey[400] }}>
                Admin ID
              </TableCell>
              <TableCell sx={{ color: theme.palette.grey[400] }}>
                Doc Status
              </TableCell>
              <TableCell sx={{ color: theme.palette.grey[400] }}>
                Admin Status
              </TableCell>
              <TableCell sx={{ color: theme.palette.grey[400] }}>
                Devices
              </TableCell>
            </TableRow>
          </TableHead>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='dialog-title'
            aria-describedby='dialog-description'
            PaperProps={{ style: { borderRadius: 12, background: '#121318' } }}
          >
            <DialogTitle
              id='dialog-title'
              sx={{ fontWeight: 'bold', textAlign: 'center' }}
            >
              List of Documents
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <DialogContentText
                id='dialog-description'
                sx={{ mb: 2, textAlign: 'center' }}
              >
                Review the documents for the selected admin.
              </DialogContentText>
              {document && (
                <img
                  src={document}
                  alt='Document'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '40rem',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '12px', // Adds rounded corners to the image
                  }}
                />
              )}
            </DialogContent>
            <DialogActions
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                paddingBottom: '20px',
              }}
            >
              <Button
                onClick={() => approveDoc(selectedAdmin)}
                color='primary'
                variant='contained'
                disabled={buttonLoader}
                sx={{ width: '175px' }}
              >
                {buttonLoader ? (
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress size={21} />
                  </Box>
                ) : (
                  'Approve Documents'
                )}
              </Button>
              <Button
                onClick={handleClose}
                variant='outlined'
                color='secondary'
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <TableBody>
            {users.map((row) => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div>
        <table
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: theme.palette.background.alt,
            borderRadius: "1px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${theme.palette.secondary[400]}`,
              }}
            >
              <th>Name</th>
              <th>Email</th>
              <th>Admin ID</th>
              <th>Doc Status</th>
              <th>Admin Status</th>
              <th>Devices</th>
            </tr>
          </thead>

          <tbody>
            {users.map((admin) => (
              <>
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin._id}</td>
                  <td>
                    {!admin?.doc_verified ? (
                      <>
                        <a
                          href="#"
                          onClick={(event) => handleOpen(admin._id)}
                          className="link-button"
                          style={{ textDecoration: "underline" }}
                        >
                          See documents
                        </a>
                        <IconButton onClick={() => handleOpen(admin._id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <a
                          href="#"
                          style={{ textDecoration: "underline" }}
                          className="link-button disabled"
                        >
                          See documents
                        </a>
                        <IconButton onClick={() => handleOpen(admin._id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </>
                    )}
                  </td>

              
                  <td>
                    {admin?.adminDetails[0]?.accountEnabled ? (
                      <>
                        <a
                          href="#"
                          style={{ color: "#7CD6AB" }}
                          onClick={() => disableAdminByID(admin._id)}
                        >
                          Enabled
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href="#"
                          style={{ color: "#FF553C" }}
                          onClick={() => enableAdminByID(admin._id)}
                        >
                          Disabled
                        </a>
                      </>
                    )}
                  </td>

                  <td>
                    <a href="#" onClick={() => handleShowUserIds(admin._id)}>
                      Device List
                      {showUserIds[admin._id] ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowUpIcon />
                      )}
                    </a>
                  </td>
                </tr>

                <tr>
                  {showUserIds[admin._id] && admin.adminDetails && (
                    <div className="">
                      <table className="newtableoutline">
                        <th className="newtableth">
                          <b>Device ID'S</b>
                        </th>
                        <tr></tr>
                        {admin?.adminDetails[0]?.deviceIds.map((userId) => (
                          <>
                            <th className="newtableth" key={userId}>
                              {userId}
                            </th>
                            <tr></tr>
                          </>
                        ))}

                        <tr
                          style={{
                            position: "absolute",
                            "border-bottom": "none",
                          }}
                        >
                          <TextField
                            style={{
                              "padding-left": "0.5em",
                              borderRadius: "30px",
                            }}
                            id="outlined-basic"
                            onChange={handleInputChange}
                            value={textFieldValue}
                            label="Add Device id"
                            variant="outlined"
                          />

                          <button
                            className="tableButton"
                            onClick={() => addDevice(admin._id)}
                          >
                            Add Device
                          </button>
                        </tr>
                        <tr style={{ "border-bottom": "none" }}>
                          <p> &nbsp; </p>
                          <br />
                        </tr>
                      </table>
                    </div>
                  )}
                </tr>
              </>
            ))}
          </tbody>
        </table>
        <Box m="1.5rem "></Box>
      </div> */}
    </>
  );
};

export default SuperAdminScreen;

// <tr>
// <td>{showUserIds[admin._id] && admin.adminDetails && (
//     <ul>
//       {admin.adminDetails[0].userIds.map((userId) => (
//         <li key={userId}>{userId}</li>
//       ))}
//     </ul>
// )}
// </td>
// </tr>
