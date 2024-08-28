import React from 'react';
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
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const SuperAdminRows = (row) => {
  console.log(row.handleCustomDialogOpen);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [updatedRow, setUpdatedRow] = useState(row);

  const [open, setOpen] = useState(false);
  console.log(row);

  const [adminStatus, setAdminStatus] = useState(
    row?.row?.adminDetails[0]?.accountEnabled
  );

  const handleClick = async () => {
    console.log('iidd,', row.row._id);
    row.handleCustomDialogOpen(
      adminStatus ? 'disable' : 'enable',
      row?.row?._id,
      () => {
        // Set the callback to update the admin status
        setAdminStatus((prevStatus) => !prevStatus);
      }
    );
  };

  return (
    <>
      {row ? (
        <>
          <TableRow>
            <TableCell>{row?.row?.name}</TableCell>
            <TableCell>{row?.row?.email}</TableCell>
            <TableCell>{row?.row?._id}</TableCell>
            <TableCell>
              {row?.row?.roles[0] == 'admin' ? (
                <>
                  <a
                    href='#'
                    onClick={() => row.handleOpen(row?.row?._id)}
                    className='link-button'
                    style={{ textDecoration: 'underline' }}
                  >
                    See documents
                  </a>
                  <IconButton onClick={() => row.handleOpen(row?.row?._id)}>
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
                  <IconButton onClick={() => row.handleOpen(row?.row?._id)}>
                    <VisibilityIcon />
                  </IconButton>
                </>
              )}
            </TableCell>
            <TableCell
              sx={{
                width: '10%',
                color: row?.row?.roles[0] == 'admin' ? 'green' : 'red',
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
                      {updatedRow?.row?.adminDetails[0]?.deviceIds.map(
                        (deviceID) => (
                          <TableRow
                            sx={{ padding: '16px 32px 16px 32px' }}
                            key={deviceID}
                          >
                            <TableCell sx={{ padding: '16px 32px 16px 32px' }}>
                              {deviceID}
                            </TableCell>
                          </TableRow>
                        )
                      )}

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
                            addDevice(row?.row?._id, textFieldValue, () => {
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
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default SuperAdminRows;
