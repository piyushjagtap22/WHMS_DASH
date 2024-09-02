import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import Loader from '../Loader.jsx';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../Button.jsx';
import {
  addDeviceID,
  approveDocById,
  disableAdmin,
  enableAdmin,
  getAllAdmin,
} from '../../slices/superAdminApiSlice.js';
import Navbar from '../Navbar.jsx';
import SuperAdminRows from '../SuperAdminRows.jsx';
import { useLayoutEffect } from 'react';
const SAdminScreen = () => {
  useLayoutEffect(() => {
    toast.dismiss(); // Dismiss any previous toasts
  }, []);
  const [users, setUsers] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customDialogAction, setCustomDialogAction] = useState(null);
  const [customDialogUserId, setCustomDialogUserId] = useState(null);
  const [document, setDocument] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [callbackRow, setCallbackRow] = useState(null);

  const dispatch = useDispatch();
  const theme = useTheme();

  const [data, setData] = useState([]);
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  const SUPERADMIN_URL = `${import.meta.env.VITE_REACT_API_URL}/api/superadmin`;

  const fetchData = useCallback(async () => {
    try {
      console.log('in fetchdata');
      const response = await getAllAdmin(token);
      if (response.status === 200) {
        setUsers(response.data.admins);
      }
    } catch (error) {
      toast.error('Error fetching admin data:');
      console.error('Error fetching admin data:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCustomDialogOpen = useCallback((action, userId, callback) => {
    setCustomDialogUserId(userId);
    setCustomDialogAction(action);
    setCustomDialogOpen(true);
    setCallbackRow(() => callback);
  }, []);

  const handleCustomDialogClose = useCallback(() => {
    setCustomDialogOpen(false);
  }, []);

  const [docText, setDocText] = useState('Fetching Document...');

  const handleOpen = useCallback(
    async (userId) => {
      setOpen(true);
      setSelectedAdmin(userId);
      const apiUrl = `${SUPERADMIN_URL}/getDocById`;
      const authToken = `Bearer ${token}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
          },
          body: JSON.stringify({ _id: userId }),
        });

        const blob = await response.blob();
        console.log(response);
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(blob);

          setDocument(imageUrl);
        } else if (response.status === 404) {
          setDocText('Document not found');
        } else {
          toast.error('Error Fetching Document');
          setDocText('Error Fetching Document');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        if (error.message === 'Failed to fetch') {
          toast.error('Error Fetching Document');
          setDocText('Error Fetching Document');
        }
      }
    },
    [SUPERADMIN_URL, token]
  );

  const handleClose = useCallback(() => {
    setOpen(false);

    setDocument(null);

    setDocText('Fetching document...');
  }, []);

  const approveDoc = useCallback(
    async (userId) => {
      try {
        setButtonLoader(true);
        const response = await approveDocById({ adminID: `${userId}` }, token);

        if (response.status === 200) {
          toast.success('Document Approved');
        } else {
          toast.error('Something went wrong, Please try again later');
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setDocument(null);
        setOpen(false);
        setButtonLoader(false);
      }
    },
    [token]
  );

  const enableAdminByID = useCallback(
    async (userId) => {
      try {
        var result = 0;
        const response = await enableAdmin({ adminId: `${userId}` }, token);
        if (response.status === 200) {
          // Handle success case if needed
          result = 1;
          toast.success('Admin Enabled');
        }
      } catch (error) {
        if (error.message === 'Network Error') {
          toast.error('Internal Server Error');
        }
        console.error('Error enabling admin:', error);
      } finally {
        return result;
      }
    },
    [token]
  );

  const disableAdminByID = useCallback(
    async (userId) => {
      try {
        var result = 0;
        const response = await disableAdmin({ adminId: `${userId}` }, token);
        if (response.status === 200) {
          // Handle success case if needed
          toast.success('Admin disabled');
          result = 1;
        }
      } catch (error) {
        if (error.message === 'Network Error') {
          toast.error('Internal Server Error');
        }
        console.error('Error disabling admin:', error);
      } finally {
        return result;
      }
    },
    [token]
  );

  const addDevice = useCallback(
    async (data, textData, clearTextField) => {
      try {
        const response = await addDeviceID(
          { adminId: `${data}`, deviceIds: [`${textData}`] },
          token
        );
        if (response.status === 200) {
          clearTextField();
          toast.success('Device added successfully');
        } else {
          toast.error('Something went wrong, Please try again later');
        }
      } catch (error) {
        console.error('Error adding device:', error);
        toast.error('Internal Server Error');
      }
    },
    [token]
  );

  const handleCustomDialogConfirm = useCallback(async () => {
    var result;
    if (customDialogAction === 'enable') {
      result = await enableAdminByID(customDialogUserId);
    } else if (customDialogAction === 'disable') {
      result = await disableAdminByID(customDialogUserId);
    }
    setCustomDialogOpen(false);
    if (callbackRow && result) {
      callbackRow();
    }
  }, [
    customDialogAction,
    customDialogUserId,
    callbackRow,
    enableAdminByID,
    disableAdminByID,
  ]);

  const tableHeadCells = useMemo(
    () => (
      <>
        <TableCell sx={{ color: theme.palette.grey[400] }}>Name</TableCell>
        <TableCell sx={{ color: theme.palette.grey[400] }}>Email</TableCell>
        <TableCell sx={{ color: theme.palette.grey[400] }}>Admin ID</TableCell>
        <TableCell sx={{ color: theme.palette.grey[400] }}>
          Doc Status
        </TableCell>
        <TableCell sx={{ color: theme.palette.grey[400] }}>
          Admin Status
        </TableCell>
        <TableCell sx={{ color: theme.palette.grey[400] }}>Devices</TableCell>
      </>
    ),
    [theme.palette.grey]
  );

  const tableBodyRows = useMemo(
    () =>
      users.map((row) => (
        <SuperAdminRows
          row={row}
          handleCustomDialogOpen={handleCustomDialogOpen}
          handleOpen={handleOpen}
          key={row?._id}
          addDevice={addDevice}
        />
      )),
    [users, handleCustomDialogOpen, handleOpen]
  );

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
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
          <CustomButton
            onClick={handleCustomDialogConfirm}
            variant='contained'
            autoFocus
          >
            Confirm
          </CustomButton>
          <CustomButton variant='outlined' onClick={handleCustomDialogClose}>
            Cancel
          </CustomButton>
        </DialogActions>
      </Dialog>
      <TableContainer
        sx={{ padding: '32px 32px 32px 32px', backgroundColor: '#121318' }}
      >
        <Table
          sx={{ backgroundColor: '#121318', padding: '16px' }}
          aria-label='collapsible table'
        >
          <TableHead>
            <TableRow>{tableHeadCells}</TableRow>
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
              {document ? (
                <img
                  src={document}
                  alt='Document'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '40rem',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '12px',
                  }}
                />
              ) : (
                <div>{docText}</div>
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
                  'Approve Document'
                )}
              </CustomButton>
              <CustomButton onClick={handleClose} variant='outlined'>
                Cancel
              </CustomButton>
            </DialogActions>
          </Dialog>
          <TableBody>{tableBodyRows}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SAdminScreen;
