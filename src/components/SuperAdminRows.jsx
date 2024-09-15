import React, { useState, useCallback } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  TextField,
  Typography,
} from '@mui/material';

const SuperAdminRows = React.memo(
  ({ row, handleCustomDialogOpen, handleOpen, addDevice, isDocApproved }) => {
    const [textFieldValue, setTextFieldValue] = useState('');
    const [updatedRow, setUpdatedRow] = useState(row);
    const [open, setOpen] = useState(false);
    const [adminStatus, setAdminStatus] = useState(
      row?.adminDetails[0]?.accountEnabled
    );

    // Memoize handleClick
    const handleClick = useCallback(() => {
      handleCustomDialogOpen(adminStatus ? 'disable' : 'enable', row?._id, () =>
        setAdminStatus((prevStatus) => !prevStatus)
      );
    }, [adminStatus, handleCustomDialogOpen, row?._id]);

    // Memoize handleTextFieldChange
    const handleTextFieldChange = useCallback((e) => {
      setTextFieldValue(e.target.value);
    }, []);

    // Memoize handleAddDevice
    const handleAddDevice = useCallback(() => {
      addDevice(row?._id, textFieldValue, () => {
        setTextFieldValue('');
        setUpdatedRow((prevRow) => ({
          ...prevRow,
          adminDetails: [
            {
              ...prevRow.adminDetails[0],
              deviceIds: [...prevRow.adminDetails[0].deviceIds, textFieldValue],
            },
          ],
        }));
      });
    }, [row?._id, textFieldValue]);
    console.log('row', row);
    if (!row) return null;

    return (
      <>
        <TableRow>
          <TableCell>{row?.name}</TableCell>
          <TableCell>{row?.email}</TableCell>
          <TableCell>{row?._id}</TableCell>
          <TableCell>
            {row?.roles[0] === 'admin' ? (
              <>
                <a
                  href='#'
                  onClick={() => handleOpen(row?._id)}
                  className='link-button'
                  style={{ textDecoration: 'underline' }}
                >
                  See documents
                </a>
                <IconButton
                  onClick={() => {
                    handleOpen(row?._id);
                    isDocApproved(
                      row?.doc_verified != null &&
                        row?.doc_verified != undefined
                        ? row?.doc_verified
                        : false
                    );
                  }}
                >
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
                <IconButton onClick={() => handleOpen(row?._id)}>
                  <VisibilityIcon />
                </IconButton>
              </>
            )}
          </TableCell>
          <TableCell
            sx={{
              width: '10%',
              color: row?.roles[0] === 'admin' ? 'green' : 'red',
            }}
          >
            <a
              href='#'
              style={{ color: adminStatus ? '#7CD6AB' : '#FF553C' }}
              onClick={handleClick}
            >
              {adminStatus ? 'Enabled' : 'Disabled'}
            </a>
          </TableCell>
          <TableCell onClick={() => setOpen((prev) => !prev)}>
            View Devices
            <IconButton aria-label='expand row' size='small'>
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
                />
                <Table size='small' aria-label='devices'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          backgroundColor: '#191C23',
                        }}
                      >
                        Device ID
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ padding: '16px' }}>
                    {updatedRow?.adminDetails[0]?.deviceIds.map((deviceID) => (
                      <TableRow sx={{ padding: '16px 32px' }} key={deviceID}>
                        <TableCell sx={{ padding: '16px 32px' }}>
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
                        label='Add Device ID'
                        variant='outlined'
                        size='small'
                        onChange={handleTextFieldChange}
                        value={textFieldValue}
                        InputProps={{
                          onClick: (e) => e.stopPropagation(),
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
                        onClick={handleAddDevice}
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
      </>
    );
  }
);

export default SuperAdminRows;
