import Loader from '../Loader.jsx';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { setAuthUser } from '../../slices/authSlice.js';
import { signOut } from 'firebase/auth';
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
} from '@mui/material';
import { auth } from '../../firebase.js';
import {
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import CustomButton from '../Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthState, setMongoUser } from '../../slices/authSlice.js';
import { toast, Toaster } from 'react-hot-toast';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  ConstructionOutlined,
} from '@mui/icons-material';
import { setLoading } from '../../slices/loadingSlice.js';
import {
  getMongoUser,
  getMongoUserByEmail,
} from '../../slices/usersApiSlice.js';

import { logout } from '../../slices/authSlice.js';

const ENDPOINT = import.meta.env.VITE_REACT_API_URL;

const EmailRegister = () => {
  const isLoading = useSelector((state) => state.loading.loading);

  const [displayName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [linkSend, setLinkSend] = useState('load');
  const navigate = useNavigate();
  const { emailid } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const dispatch = useDispatch();
  const AuthUser = useSelector((state) => state.auth.AuthUser);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordsMatch(confirmPwd === password);
  };

  const linkEmailWithPhone = async (email, password) => {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      const currentUser = auth.currentUser;

      // Check if the email is already linked to another account
      if (
        currentUser.providerData.some(
          (provider) => provider.providerId === 'password'
        )
      ) {
        console.log('Email is already linked to this account.');
        return;
      }

      // Link the email with the current user
      await linkWithCredential(currentUser, credential);

      updateProfile(currentUser, { displayName: displayName }).then(
        (result) => {
          console.log(result);
        }
      );

      // Fetch the updated user data
      const updatedUser = auth.currentUser;
      console.log('Account linking success', updatedUser);
    } catch (error) {
      console.log(error.message);

      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        toast.error(
          'This email is already in use with different account, please use another mail'
        );
        setLoading(false);
      } else if (
        error.message === 'Firebase: Error (auth/requires-recent-login).'
      ) {
        toast.error('Session Timed out, Please login again,');

        setTimeout(() => {
          handleLogout();
          Navigate('/register');
        }, 3000);
      }
      // g error auth/email-already-in-use
      else {
        console.error('Account linking error', error.code, error.message);
      }
    }
  };

  const sendEmailLink = async (user) => {
    await sendEmailVerification(user)
      .then(() => {
        setLinkSend('sent');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleLogin = async (e) => {
    dispatch(setLoading(true));

    e.preventDefault();
    if (displayName === '' || email === '' || password === '') {
      toast.error('Please Fill up the details');
      dispatch(setLoading(false));
    } else if (!passwordsMatch) {
      toast.error("Passwords don't match");
      dispatch(setLoading(false));
    } else {
      try {
        await linkEmailWithPhone(email, password);

        const user = auth.currentUser;
        console.log(user.email);
        if (user.email) {
          await sendEmailLink(user);
        }

        setLinkSend('sent');

        // Store email in localStorage for reference
        localStorage.setItem('email', email);
      } catch (error) {
        console.log(error.message);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const createMongoUser = (token, name, role) => {
    return async (dispatch) => {
      await getMongoUser(auth.currentUser.stsTokenManager.accessToken)
        .then(async (res) => {
          console.log(res);
          if (res.status === 204) {
            try {
              const response = await fetch(
                `${ENDPOINT}/api/auth/create-mongo-user`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ name, role }),
                }
              );

              if (!response.ok) {
                throw new Error('Failed to create user');
              }

              const userData = await response.json();
              console.log(userData);
              await dispatch(setMongoUser(userData));
            } catch (error) {
              console.log(error.message);
            }
          } else if (res.status === 200) {
            console.log('user already created');
          }
        })
        .catch(async (err) => {
          console.log(err);
        });
    };
  };

  const delay = (milliseconds) =>
    new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await delay(1000);
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
    } finally {
      dispatch(setLoading(false));
    }
  };

  const checkAndSetMonogosUser = async () => {
    try {
      await getMongoUserByEmail(auth.currentUser.email).then((res) => {
        const user = res.data.existingUser;
        dispatch(setMongoUser(user));
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const checkEmailVerification = async () => {
    try {
      const user = auth.currentUser;
      await user.reload();
      if (user.emailVerified) {
        await dispatch(
          createMongoUser(user.accessToken, user.displayName, 'admin')
        );
        await dispatch(setAuthState('/verify'));
        navigate('/verify');
      }
    } catch (error) {
      console.error('Error checking email verification:', error.message);
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    if (
      auth?.currentUser?.email !== null &&
      auth.currentUser.emailVerified === false
    ) {
      setLinkSend('sent');
    } else {
      setLinkSend('notsent');
    }
    dispatch(setLoading(false));

    const intervalId = setInterval(checkEmailVerification, 2000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 120000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Container
        maxWidth='sm'
        style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: 'transparent',
          color: 'white',
          marginTop: '3rem',
          borderRadius: '1rem',
        }}
      >
        <Toaster toastOptions={{ duration: 4000 }} />
        {linkSend === 'load' ? (
          <Loader />
        ) : linkSend === 'sent' ? (
          <Container
            maxWidth='sm'
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'transparentß',
              color: 'white',
            }}
          >
            <Typography
              variant='h2'
              ß
              fontWeight='bold'
              style={{ color: '#7CD6AB' }}
            >
              Verify Your email
            </Typography>
            <Typography variant='subtitle2' style={{ margin: '20px 0' }}>
              Confirm your email address by clicking the link we sent to{' '}
              {localStorage.getItem('email')}
            </Typography>
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              style={{ gap: '20px', marginTop: '20px' }}
            >
              <CustomButton
                style={{
                  backgroundColor: '#7CD6AB',
                  color: '#121318',
                  padding: '0.8rem',
                }}
                fullWidth
                onClick={() => sendEmailLink(auth.currentUser)}
              >
                Resend Link
              </CustomButton>
              <CustomButton
                onClick={handleLogout}
                style={{
                  backgroundColor: '#7CD6AB',
                  color: '#121318',
                  padding: '0.8rem',
                }}
                fullWidth
              >
                Not You, Sign in With Different Account
              </CustomButton>
            </Box>
          </Container>
        ) : (
          <>
            <Typography
              variant='h2'
              fontWeight='bold'
              style={{ color: '#7CD6AB' }}
            >
              Register Account
            </Typography>
            <Typography
              variant='subtitle1'
              style={{ margin: '15px 0', padding: '0px 120px' }}
            >
              For the purpose of industry regulation, your details are required.
            </Typography>
            <Typography
              variant='subtitle2'
              style={{ margin: '15px 0', color: '#75777B' }}
            >
              Please enter all the required details to link with your account...
            </Typography>
            <form
              onSubmit={handleLogin}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <TextField
                label='Your Full Name*'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                InputLabelProps={{ style: { color: 'grey' } }}
                value={displayName}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label='Enter Email address*'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                InputLabelProps={{ style: { color: 'grey' } }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label='Create Password*'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                type={showPassword ? 'text' : 'password'}
                InputLabelProps={{ style: { color: 'grey' } }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label='Confirm Password*'
                variant='outlined'
                fullWidth
                style={{ margin: '15px 0' }}
                type={showPassword ? 'text' : 'password'}
                InputLabelProps={{ style: { color: 'grey' } }}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {passwordsMatch ? (
                        <CheckCircle style={{ color: 'green' }} />
                      ) : (
                        <Cancel style={{ color: 'red' }} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <CustomButton
                type='submit'
                style={{
                  backgroundColor: '#7CD6AB',
                  color: '#121318',
                  padding: '0.8rem',
                  width: '100%',
                }}
              >
                Register Account
              </CustomButton>
            </form>
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              style={{ gap: '20px', marginTop: '20px', width: '100%' }}
            >
              <CustomButton
                variant='outlined'
                onClick={handleLogout}
                style={{
                  backgroundColor: '#7CD6AB',
                  color: '#121318',
                  padding: '0.8rem',
                  width: '100%',
                }}
              >
                Not you, Sign in With Different Account
              </CustomButton>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default EmailRegister;
