import React from 'react';
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
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../Button.jsx';
import {
  addDeviceID,
  approveDocById,
  disableAdmin,
  enableAdmin,
  getAllAdmin,
} from './../../slices/superAdminApiSlice';
import Navbar from '../Navbar.jsx';

const SuperAdminScreen = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
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
  // const [button, setButton] = useState('false');
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setselectedAdmin] = useState('');
  const theme = useTheme();
  const [data, setData] = useState([]);

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
  }, [dispatch, token, document]);

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

  const enableAdminByID = async (userId) => {
    try {
      const response = await enableAdmin({ adminId: `${userId}` }, token);
      if (response.status === 200) {
        // setButton(!button);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disableAdminByID = async (userId) => {
    try {
      const response = await disableAdmin({ adminId: `${userId}` }, token);
      if (response.status === 200) {
        // setButton(!button);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addDevice = async (data, textData, clearTextField) => {
    try {
      const response = await addDeviceID(
        { adminId: `${data}`, deviceIds: [`${textData}`] },
        token
      );
      if (response.status === 200) {
        clearTextField(); // Clear the text field on success
        toast.success('Device added successfully');
      } else {
        toast.error('Something went wrong, Please try again later');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  function Row({ row }) {
    const [textFieldValue, setTextFieldValue] = useState('');
    const [updatedRow, setUpdatedRow] = useState(row);
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
                    {updatedRow?.adminDetails[0]?.deviceIds.map((deviceID) => (
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
                        // onClick={(e) => e.stopPropagation()} // Stop event propagation here
                        onChange={(e) => setTextFieldValue(e.target.value)}
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
                        onClick={() =>
                          addDevice(row._id, textFieldValue, () => {
                            setTextFieldValue('');
                            setUpdatedRow({
                              ...updatedRow,
                              adminDetails: [
                                {
                                  ...updatedRow.adminDetails[0],
                                  deviceIds: [
                                    ...updatedRow.adminDetails[0].deviceIds,
                                    textFieldValue,
                                  ],
                                },
                              ],
                            });
                          })
                        }
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
        <DialogTitle id='custom-dialog-title'>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id='custom-dialog-description'>
            Are you sure you want to{' '}
            {customDialogAction === 'enable'
              ? 'enable this user as an admin'
              : 'disable this admin'}
            ?
          </DialogContentText>
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
          <CustomButton variant='contained' onClick={handleCustomDialogClose}>
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
