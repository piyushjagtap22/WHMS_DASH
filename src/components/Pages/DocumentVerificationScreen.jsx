import {
  setAuthState,
  setAuthUser,
  setMongoUser,
} from '../../slices/authSlice';
import { setLoading } from '../../slices/loadingSlice';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.js';
import Loader from '../Loader.jsx';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import { Toaster, toast } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { initializeMongoUser } from '../../slices/authSlice';
import CustomButton from '../Button.jsx';
import store from '../../store';
const ENDPOINT = import.meta.env.VITE_REACT_API_URL;

const DocumentVerificationScreen = (props) => {
  console.log(props.mongoUser);
  const [file, setFile] = useState(null);
  const [orgName, setOrgName] = useState(''); // State for organization name
  const [deptName, setDeptName] = useState(''); // State for department name
  const fileInputRef = useRef(null);

  const [buttonLoader, setButtonLoader] = useState(false);
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  const authUser = useSelector((state) => state.auth.AuthUser);
  const mongoUser = useSelector((state) => state.auth.MongoUser);
  const [docUploadedSuccess, setDocUploadedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [docUploaded, setDocUploaded] = useState('load');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          dispatch(setAuthState('/register'));
          dispatch(setAuthUser(null));
          dispatch(setMongoUser(null));
          navigate('/register');
          unsubscribe();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mongoUser?.doc_uploaded === true) {
      setDocUploadedSuccess(true);
      console.log('if');
      setDocUploaded('yes');
    } else {
      console.log('else');
      setDocUploaded('no');
      console.log(docUploaded);
    }
    console.log(docUploaded);
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      // Check if Organization and Department are provided
      if (!orgName || !deptName) {
        toast.error('Please fill in all required fields');
        return;
      }

      setButtonLoader(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orgName', orgName); // Include orgName in FormData
      formData.append('deptName', deptName); // Include deptName in FormData

      const response = await axios.post(
        `${ENDPOINT}/api/profile/uploadDocument`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      if (response.data.message === 'File uploaded successfully') {
        setDocUploadedSuccess(true);
        setDocUploaded('yes');
      }
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 400) {
        toast.error('Please attach document');
      }
    } finally {
      setButtonLoader(false);
    }
  };

  return (
    <>
      <Container
        maxWidth='sm'
        style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: 'rgb(18, 19, 24)',
          color: 'white',
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '1rem',
          height: '100vh', // Take full viewport height
        }}
      >
        <Toaster toastOptions={{ duration: 4000 }} />

        {docUploaded === 'load' ? (
          <Loader />
        ) : docUploaded === 'yes' ? (
          <>
            <Typography
              variant='h3'
              fontWeight='bold'
              style={{ color: '#7CD6AB' }}
              marginBottom='20px'
            >
              Document Uploaded Succesfully !
            </Typography>
            <Typography
              variant='subtitle2'
              style={{ margin: '15px 0', padding: '0px 0px' }}
            >
              Verification in Progress ..... Wait till admin verifies your doc
            </Typography>
            <CustomButton
              onClick={handleLogout}
              style={{
                backgroundColor: '#7CD6AB',
                color: '#121318',
                margin: '20px 0',
                padding: '0.8rem',
              }}
              fullWidth
            >
              Not You, Sign in With Different Account
            </CustomButton>
          </>
        ) : (
          <>
            <Typography
              variant='h3'
              fontWeight='bold'
              style={{ color: '#7CD6AB' }}
              marginBottom='20px'
            >
              Complete your profile
            </Typography>

            <div style={{ width: '70%', margin: 'auto', textAlign: 'left' }}>
              <TextField
                label='Organization'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                InputLabelProps={{ style: { color: 'grey' } }}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required // Make Organization field required
              />

              <TextField
                label='Department'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                InputLabelProps={{ style: { color: 'grey' } }}
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                required // Make Department field required
              />

              <Typography
                variant='subtitle2'
                style={{ margin: '15px 0', padding: '0px 0px' }}
              >
                Upload government ID proof
              </Typography>

              <div
                style={{
                  border: '1px solid grey',
                  borderRadius: '5px',
                  padding: '20px',
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    border: '2px dashed grey',
                    borderRadius: '5px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    marginBottom: '25px',
                    cursor: 'pointer',
                  }}
                >
                  <CloudUploadIcon
                    style={{ fontSize: '3rem', color: '#7CD6AB' }}
                  />
                  <Typography
                    m='10px'
                    variant='body2'
                    style={{ color: 'grey' }}
                  >
                    Click or drag file to this area to upload
                  </Typography>
                  <label
                    style={{
                      padding: '5px 15px',
                      border: '1px solid #7cd6ab',
                      borderRadius: '4px',
                      color: '#7cd6ab',
                    }}
                  >
                    <input
                      type='file'
                      accept='.jpg, .jpeg, .png, .pdf'
                      style={{
                        display: 'none',
                        background: '#7CD6AB',
                        color: '#121318',
                      }}
                      onChange={handleFileChange}
                    />
                    choose
                  </label>
                </div>
                <Typography
                  variant='body2'
                  style={{ color: 'grey', marginBottom: '40px' }}
                >
                  Formats accepted are jpg, jpeg, png, and PDF
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CustomButton
                    variant='outlined'
                    style={{
                      color: '#7CD6AB',
                      borderColor: '#7CD6AB',
                      margin: '0 10px',
                    }}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    style={{
                      backgroundColor: '#7CD6AB',
                      color: '#121318',
                      margin: '0',
                    }}
                    onClick={handleUpload}
                  >
                    {buttonLoader ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress size={22} />
                      </Box>
                    ) : (
                      'Upload'
                    )}
                  </CustomButton>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CustomButton
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#7CD6AB',
                    color: '#121318',
                    margin: '10px 0',
                    padding: '0.8rem',
                    width: '100%', // Ensure button takes full width
                  }}
                >
                  Not You, Sign in With Different Account
                </CustomButton>
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default DocumentVerificationScreen;
