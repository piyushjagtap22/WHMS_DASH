import React, { useMemo } from 'react';
// import { delay } from '@reduxjs/toolkit/dist/utils';
import { useEffect, useState } from 'react';
import FlexBetween from '../FlexBetween';
import Header from '../Header';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, useMediaQuery } from '@mui/material';
import { Card, CardMedia } from '@mui/material';
import { setLoading } from '../../slices/loadingSlice';
import {
  createAdmin,
  getAllUsers,
  removeAdmin,
  enableAdmin,
  getAllAdmin,
  disableAdmin,
  approveDocById,
  addDeviceID,
  // docById
} from './../../slices/superAdminApiSlice';
import { auth } from '../../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { setAuthState } from '../../slices/authSlice';
import {
  getUnallocatedUsers,
  AddUsersToAdmin,
  getAdminUsers,
  RemoveUsersFromAdmin,
} from '../../slices/adminApiSlice';

const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
  const SUPERADMIN_URL = 'http://localhost:3000' + '/api/superadmin';
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
    // Fetch user data when the component mounts
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

  const adminToggle = async (user) => {
    console.log();
    if (user.roles[0] === 'superadmin') {
      console.log('Already Superadmin');
    } else {
      let response;
      if (user.roles[0] === 'admin') {
        response = await removeAdmin({ _id: user._id }, token);
        if (response.status === 200) {
          console.log(response);
          // Update the user's role in the local state
          setUsers((prevUsers) =>
            prevUsers.map((prevUser) =>
              prevUser._id === user._id
                ? { ...prevUser, roles: ['unallocated'] }
                : prevUser
            )
          );
        }
      } else {
        response = await createAdmin({ _id: user._id }, token);
        if (response.status === 200) {
          console.log(response);
          // Update the user's role in the local state
          setUsers((prevUsers) =>
            prevUsers.map((prevUser) =>
              prevUser._id === user._id
                ? { ...prevUser, roles: ['admin'] }
                : prevUser
            )
          );
        }
      }
    }
  };

  const approveDoc = async (userId) => {
    alert('clicked on' + userId);
    const response = await approveDocById({ adminID: `${userId}` }, token);

    if (response.status === 200) {
      console.log(response); // Assuming the user data is in the response data
      alert('Document Verified');
      setdocument(null);
      setOpen(false);
    } else {
      // Handle any errors or show a message
      alert('something went wrong');
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

  const addUserToAdmin = async (userId, adminId) => {
    console.log('mapped');
    try {
      console.log('in fetchdata');
      const data = {
        adminId: adminId,
        userIds: [userId],
      };
      console.log(data);
      const response = await AddUsersToAdmin(data, token);
      console.log(response);
      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        // setAdminUsers((prevUsers) => [
        //   ...prevUsers,
        //   users.find((user) => user._id === userId),
        // ]);
        // setUsers((prevUsers) => prevUsers.filter((user) => user._id !== _id));
      } else {
        // Handle any errors or show a message
      }
    } catch (error) {
      // Handle any network or API request errors
    }
  };

  //const isExpanded = (user) => expandedUsers.includes(user._id);
  const isExpanded = (user) => user._id === currentlyExpandedUser;

  //Data related to Table

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.4,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.4,
    },
    {
      field: 'admin_id',
      headerName: 'Admin ID',
      flex: 0.5,
    },
    {
      field: 'doc_status',
      headerName: 'Doc Status',
      flex: 0.4,
    },
    {
      field: 'Admin',
      headerName: 'Admin Status',
      flex: 0.3,
    },
    {
      field: 'devices',
      headerName: 'Devices',
      flex: 0.3,
    },
  ];
  console.log('in superadmin');
  return (
    <>
      <div>
        Hello SuperAdmin,
        <Button
          onClick={handleLogout}
          style={{
            backgroundColor: '#7CD6AB',
            color: '#121318',
            margin: '20px 0',
            padding: '0.8rem',
          }}
          fullWidth
        >
          Logout
        </Button>
        <h1>Admin Management</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin ID</th>
              <th>Doc Status</th>
              <th>Admin Status</th>
              <th>Devices</th>
            </tr>
          </thead>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography id='modal-modal-title' variant='h6' component='h2'>
                List of Documents
              </Typography>
              <Card>
                {document && (
                  <img
                    src={document}
                    alt='Image'
                    style={{
                      maxWidth: '100%',
                      maxHeight: '40rem', // Set your desired max-height
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain', // Maintain aspect ratio without stretching
                    }}
                  />
                )}
              </Card>
              <button onClick={() => approveDoc(selectedAdmin)}>
                Approve Documents{selectedAdmin}
              </button>
            </Box>
          </Modal>
          <tbody>
            {users.map((admin) => (
              <>
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin._id}</td>
                  <td>
                    {admin?.adminDetails[0]?.accountEnabled ? (
                      <a href='#' onClick={() => disableAdminByID(admin._id)}>
                        Disable Admin
                      </a>
                    ) : (
                      <a href='#' onClick={() => enableAdminByID(admin._id)}>
                        Enable Admin
                      </a>
                    )}
                  </td>

                  {/* <tr>
              <button onClick={() => handleShowUserIds(admin._id)}>
                    {showUserIds[admin._id] ? 'Hide Admin IDs' : 'Show Admin IDs'}
                  </button>
              </tr> */}
                  <tr>
                    {admin?.adminDetails[0]?.accountEnabled ? (
                      <td>Enabled</td>
                    ) : (
                      <td>Disabled</td>
                    )}
                  </tr>
                  <td>
                    {!admin?.doc_verified ? (
                      <>
                        <a
                          href='#'
                          onClick={(event) => handleOpen(admin._id)}
                          className='link-button'
                        >
                          See documents
                        </a>
                        <IconButton
                          onClick={() => handleShowUserIds(admin._id)}
                        >
                          <KeyboardArrowDownIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <a href='#' className='link-button disabled'>
                          See documents
                        </a>
                        <IconButton
                          onClick={() => handleShowUserIds(admin._id)}
                        >
                          <KeyboardArrowDownIcon />
                        </IconButton>
                      </>
                    )}
                  </td>
                </tr>

                <tr>
                  {showUserIds[admin._id] && admin.adminDetails && (
                    <table className='newtableoutline'>
                      <th className='newtableth'>Device ID</th>
                      <tr></tr>
                      {admin?.adminDetails[0]?.deviceIds.map((userId) => (
                        <>
                          <th className='newtableth' key={userId}>
                            {userId}
                          </th>
                          <tr></tr>
                        </>
                      ))}
                      <tr>
                        <TextField
                          style={{ 'padding-left': '0.5em' }}
                          id='outlined-basic'
                          onChange={handleInputChange}
                          value={textFieldValue}
                          label='Add Device id'
                          variant='outlined'
                        />
                        <button onClick={() => addDevice(admin._id)}>
                          Add Device
                        </button>
                      </tr>
                    </table>
                  )}
                </tr>
              </>
            ))}
          </tbody>
        </table>
        <Box m='1.5rem '></Box>
      </div>
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
