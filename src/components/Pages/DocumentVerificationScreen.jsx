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
import { Button, Container, TextField, Typography } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { initializeMongoUser } from '../../slices/authSlice';
import store from '../../store';
const ENDPOINT = import.meta.env.VITE_REACT_API_URL;

const DocumentVerificationScreen = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
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
      console.log('0');
      // dispatch(setLoading(true));

      // await delay(1000);
      console.log('1');
      await signOut(auth);
      console.log('2');
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
      // dispatch(setLoading(false)); // Hide loader when operation completes
    }
  };

  useEffect(() => {
    console.log('Doc Verification');
    console.log('docUploaded:', docUploaded);
    console.log('mongoUser:', mongoUser);
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
      console.log(token);
      console.log(authUser);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${ENDPOINT}/api/admin/uploadDocument`,
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
      console.error('Error uploading file:', error.response?.data?.message);
    }
  };

  // const handleSubmit = async () => {
  //   if (token) {
  //     await store.dispatch(initializeMongoUser(token));
  //   }
  // }

  // if (loading) {
  //   return null;
  // }

  return (
    <>
      <Container
        maxWidth='sm'
        style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: 'black',
          color: 'white',
          marginTop: '3rem',
          borderRadius: '1rem',
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
              Not You, Sign in With Different Account
            </Button>
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
                label='Organization*'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                InputLabelProps={{ style: { color: 'grey' } }}
                value={''}
              />

              <TextField
                label='Department'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                InputLabelProps={{ style: { color: 'grey' } }}
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
                  <Typography variant='body2' style={{ color: 'grey' }}>
                    Click or drag file to this area to upload
                  </Typography>
                  <input
                    type='file'
                    accept='.jpg, .jpeg, .png, .pdf'
                    style={{ display: '' }}
                    onChange={handleFileChange}
                  />
                </div>
                <Typography
                  variant='body2'
                  style={{ color: 'grey', marginBottom: '40px' }}
                >
                  Formats accepted are jpg, jpeg, png, and PDF
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant='outlined'
                    style={{
                      color: '#7CD6AB',
                      borderColor: '#7CD6AB',
                      margin: '0 10px',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{
                      backgroundColor: '#7CD6AB',
                      color: '#121318',
                      margin: '0',
                    }}
                    onClick={handleUpload}
                  >
                    Upload
                  </Button>
                </div>
              </div>
              <Button
                type='submit'
                style={{
                  backgroundColor: '#7CD6AB',
                  color: '#121318',
                  margin: '20px 0',
                  padding: '0.8rem',
                }}
                fullWidth
              >
                Submit
              </Button>
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
                Not You, Sign in With Different Account
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default DocumentVerificationScreen;
