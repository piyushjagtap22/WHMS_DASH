import React from 'react';
// import { delay } from '@reduxjs/toolkit/dist/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
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
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../firebase.js';
import { setAuthState } from '../../slices/authSlice';
import { setLoading } from '../../slices/loadingSlice';
import CustomButton from '../Button.jsx';
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

  const [customDialogOpen, setCustomDialogOpen] = useState(false);
const [customDialogAction, setCustomDialogAction] = useState(null);
const [customDialogUserId, setCustomDialogUserId] = useState(null);

  // const token = '';
  const [document, setdocument] = useState(null);
  const { userInfo } = useSelector((state) => state.superAdmin);
  const [adminUsers, setAdminUsers] = useState([]); // State to store admin users
  const [button, setButton] = useState('false');
  const [open, setOpen] = useState(false);
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


  const handleCustomDialogOpen = (action, userId) => {
    setCustomDialogAction(action);
    setCustomDialogUserId(userId);
    setCustomDialogOpen(true);
  };
  
  const handleCustomDialogClose = () => {
    setCustomDialogOpen(false);
  };
  
  const handleCustomDialogConfirm = () => {
    if (customDialogAction === 'enable') {
      enableAdminByID(customDialogUserId);
    } else if (customDialogAction === 'disable') {
      disableAdminByID(customDialogUserId);
    }
    setCustomDialogOpen(false);
  };
  

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
  };
  const handleClose = () => setOpen(false);

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
    try {
      const response = await enableAdmin({ adminId: `${userId}` }, token);
      if (response.status === 200) {
        setButton(!button);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const disableAdminByID = async (userId) => {
    try {
      const response = await disableAdmin({ adminId: `${userId}` }, token);
      if (response.status === 200) {
        setButton(!button);
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
        setTextFieldValue('');
        setButton(!button);
      } else {
        // Handle any errors or show a message
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = async (event) => {
    event.preventDefault();
    // Update the state with the current value of the text field
    setTextFieldValue(event.target.value);
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
  };

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
        onClick={() => handleCustomDialogOpen('disable', row._id)}
      >
        Enabled
      </a>
    </>
  ) : (
    <>
      <a
        href='#'
        style={{ color: '#FF553C' }}
        onClick={() => handleCustomDialogOpen('enable', row._id)}
      >
        Disabled
      </a>
    </>
  )}
</TableCell>
          <TableCell>
            View Devices
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
                ></Typography>
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
                        onClick={(e) => e.stopPropagation()} // Stop event propagation here
                        onChange={handleInputChange}
                        value={textFieldValue}
                        InputProps={{
                          onClick: (e) => e.stopPropagation(), // Also stop propagation on InputProps
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'grey',
                            },
                            '&:hover fieldset': {
                              borderColor: '#7CD6AB',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#7CD6AB',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'grey',
                          },
                          '&:hover .MuiInputLabel-root': {
                            color: '#7CD6AB',
                          },
                          '& .Mui-focused .MuiInputLabel-root': {
                            color: '#7CD6AB',
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
      <Dialog
  open={customDialogOpen}
  onClose={handleCustomDialogClose}
  aria-labelledby='custom-dialog-title'
  aria-describedby='custom-dialog-description'
  PaperProps={{ style: { borderRadius: 12, background: '#191c23' } }}

>
  <DialogTitle id='custom-dialog-title'>
    Confirm Action
  </DialogTitle>
  <DialogContent>
    <DialogContentText id='custom-dialog-description'>
      Are you sure you want to{' '}
      {customDialogAction === 'enable'
        ? 'enable this user as an admin'
        : 'disable this admin'}
      ?
    </DialogContentText>
  </DialogContent>
  <DialogActions  sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                paddingBottom: '20px',
              }}>
    <CustomButton       variant='contained'
 onClick={handleCustomDialogClose} >
      Cancel
    </CustomButton>
    <CustomButton
      onClick={handleCustomDialogConfirm}
      variant='outlined'
      autoFocus
    >
      Confirm
    </CustomButton>
  </DialogActions>
</Dialog>
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
            PaperProps={{ style: { borderRadius: 12, background: '#191c23' } }}
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
              <CustomButton
                onClick={() => approveDoc(selectedAdmin)}
                variant='contained'
                disabled={buttonLoader}
              >
                {buttonLoader ? (
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress size={21} />
                  </Box>
                ) : (
                  'Approve Documents'
                )}
              </CustomButton>
              <CustomButton onClick={handleClose} variant='outlined'>
                Cancel
              </CustomButton>
            </DialogActions>
          </Dialog>

          <TableBody>
            {users.map((row) => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SuperAdminScreen;
