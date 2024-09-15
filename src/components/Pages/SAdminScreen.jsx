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
import TickMark from '../../assets/roundTick.svg';
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
  const [adminDocument, setDocument] = useState(null);
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
  const [documentUrl, setDocumentUrl] = useState(null); // Rename document to documentUrl
  const handleDownload = useCallback(() => {
    if (adminDocument && documentUrl) {
      const link = document.createElement('a');
      link.href = adminDocument;

      // Use the original filename or default to 'document'
      const fileExtension = documentUrl.split('.').pop();
      const isValidExtension = ['jpg', 'jpeg', 'png', 'pdf'].includes(
        fileExtension
      );

      const fileName = isValidExtension
        ? documentUrl
        : `document.${fileExtension}`;

      link.download = fileName; // Use the correct file name here
      link.click();
    }
  }, [adminDocument, documentUrl]);

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

  const [docText, setDocText] = useState('');
  const [typeOfContent, setTypeOfContent] = useState('');
  const handleOpen = useCallback(
    async (userId) => {
      setDocText('Fetching document...');
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
        if (response.status === 200) {
          const contentType = response.headers.get('Content-Type');
          await setTypeOfContent(contentType);
          const objectUrl = URL.createObjectURL(blob);

          // Extract the filename from the Content-Disposition header
          const contentDisposition = response.headers.get(
            'Content-Disposition'
          );
          let fileName = 'document'; // Default name
          if (contentDisposition && contentDisposition.includes('filename=')) {
            fileName = contentDisposition
              .split('filename=')[1]
              .split(';')[0]
              .replace(/"/g, '');
          } else {
            // Fallback to using the content type to determine file extension
            const extension = contentType.split('/')[1];
            fileName = `document.${extension}`;
          }

          setDocumentUrl(fileName); // Save the file name for later download

          // Check if the file is an image (jpg or png)
          if (contentType === 'image/jpeg' || contentType === 'image/png') {
            setDocument(objectUrl); // Save the URL for displaying the image
            setDocText(''); // Clear the text
          } else if (contentType === 'application/pdf') {
            setDocument(objectUrl); // Use the object URL for PDF download
            setDocText(`File: ${fileName}`);
          } else {
            setDocument(null); // Don't display it as an image
            setDocText(`File: ${fileName}`); // Show file name instead
          }
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

    setTimeout(() => {
      setDocument(null);
      setDocText('');
      setTypeOfContent('');
    }, 500);
  }, []);

  console.log('users', users);
  const approveDoc = useCallback(
    async (userId) => {
      try {
        setButtonLoader(true);
        const response = await approveDocById({ adminID: `${userId}` }, token);

        if (response.status === 200) {
          toast.success('Document Approved');
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, doc_verified: true } : user
            )
          );
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
  const [docApproved, setDocApproved] = useState(false);
  const isDocApproved = (bool) => {
    setDocApproved(bool);
  };
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
  console.log('docApproved', docApproved);
  const tableBodyRows = useMemo(
    () =>
      users.map((row) => (
        <SuperAdminRows
          row={row}
          handleCustomDialogOpen={handleCustomDialogOpen}
          handleOpen={handleOpen}
          key={row?._id}
          addDevice={addDevice}
          isDocApproved={isDocApproved}
        />
      )),
    [users, handleCustomDialogOpen, handleOpen]
  );

  console.log(documentUrl);
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
                sx={{
                  mb: 2,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {docApproved ? (
                  <>
                    <div>
                      <p style={{ marginRight: '8px', display: 'inline' }}>
                        Document Approved
                      </p>
                      <TickMark />
                    </div>
                  </>
                ) : (
                  'Review the documents for the selected admin.'
                )}
              </DialogContentText>

              {/* Render the content based on file type */}
              {typeOfContent === 'application/pdf' ? (
                <div>{`File: ${documentUrl}`}</div>
              ) : adminDocument ? (
                <img
                  src={adminDocument}
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

              {documentUrl &&
                docText !== 'Fetching document...' &&
                docText !== 'Document not found' && (
                  <CustomButton
                    onClick={handleDownload}
                    variant='contained'
                    sx={{ mt: 2 }}
                    hidden={false}
                  >
                    Download Document
                  </CustomButton>
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
              {!docApproved && docText !== 'Document not found' && (
                <CustomButton
                  onClick={() => approveDoc(selectedAdmin)}
                  variant='contained'
                  disabled={
                    docText === 'Fetching document...' && !adminDocument
                  }
                  style={
                    docText === 'Fetching document...' && !adminDocument
                      ? styles.disabledButton
                      : styles.submitButton
                  }
                >
                  {docText === 'Fetching document...' && !adminDocument ? (
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress size={21} />
                    </Box>
                  ) : (
                    'Approve Document'
                  )}
                </CustomButton>
              )}
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
const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#121318',
  },
  container: {
    textAlign: 'center',
    padding: '50px',
    color: 'white',
    borderRadius: '1rem',
  },
  title: {
    color: '#7CD6AB',
  },
  subtitle: {
    margin: '15px 0',
    padding: '0px 120px',
    color: '#75777B',
  },
  form: {
    width: '70%',
    margin: 'auto',
    textAlign: 'left',
  },
  label: {
    margin: '8px 0',
    color: '#75777B',
  },
  phoneInput: {
    width: '100%',
    height: '40px',
    border: '1px solid #75777B',
    borderRadius: '5px',
    paddingLeft: '60px', // Adjust padding to ensure the flag doesn't overlap the text
    backgroundColor: '#121318',
    color: 'white',
  },
  phoneInputContainer: {
    width: '100%',
  },
  phoneButton: {
    backgroundColor: '#121318',
    color: 'white',
  },
  phoneDropdown: {
    backgroundColor: '#121318',
  },
  textField: {
    margin: '20px 0',
    width: '22rem',
  },
  checkbox: {
    color: '#7CD6AB',
  },
  terms: {
    paddingTop: '10px',
  },
  submitButton: {
    backgroundColor: '#7CD6AB',
    color: '#121318',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    color: '#121318',
  },
  loginLink: {
    color: '#7CD6AB',
    textAlign: 'left',
    variant: 'outlined',
    width: '100%',
    display: 'block',
  },
};
export default SAdminScreen;
