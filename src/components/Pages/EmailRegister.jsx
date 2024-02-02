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
  Checkbox,
  Button,
  FormControlLabel,
  Divider,
  IconButton,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { auth } from '../../firebase.js';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  updateProfile,
  linkWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  setAuthState,
  setEmailId,
  setMongoUser,
  setToken,
} from '../../slices/authSlice.js';
import { toast, Toaster } from 'react-hot-toast';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import {
  getMongoUser,
  getMongoUserByEmail,
} from '../../slices/usersApiSlice.js';
// import { createMongoUserAsync } from "../../slices/userSlice.js";
import { logout } from '../../slices/authSlice.js';
import { setLoading } from '../../slices/loadingSlice.js';

const EmailRegister = () => {
  const isLoading = useSelector((state) => state.loading.loading);

  console.log('in email register');
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
    console.log(email, password);
    try {
      console.log('called');
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
      if (error.message === 'Firebase: Error (auth/requires-recent-login).') {
        console.log('hello');
        toast.error('Session Timed out, Please login again,');

        setTimeout(() => {
          handleLogout();
          Navigate('/register');
        }, 3000);
      }
      console.error('Account linking error', error.code, error.message);
    }
  };

  const sendEmailLink = async (user) => {
    console.log('called' + email);
    await sendEmailVerification(user)
      .then(() => {
        console.log('link send success');
        setLinkSend('sent');
      })
      .catch((err) => {
        console.log(err.message);
        toast.error(err.message);
      });
  };

  const handleLogin = async (e) => {
    dispatch(setLoading(true));

    e.preventDefault();
    if (displayName === '' || email === '' || password === '') {
      toast.error('Please Fill up the details');
    } else if (!passwordsMatch) {
      toast.error("Passwords don't match");
    } else {
      try {
        // linkEmailWithPhone(email, password).then(async () => {
        //   const user = auth.currentUser;
        //   console.log(user.email + '  email');
        //   sendEmailLink(user);
        // });
        await linkEmailWithPhone(email, password);

        const user = auth.currentUser;
        console.log(user.email + '  email');

        await sendEmailLink(user);

        setLinkSend('sent');

        // Store email in localStorage for reference
        localStorage.setItem('email', email);
      } catch (error) {
        console.log('Error creating user:', error.message);
        toast.error(error.message);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const createMongoUser = (token, name, role) => {
    console.log('inside');
    return async (dispatch) => {
      console.log(auth.currentUser.stsTokenManager.accessToken);
      await getMongoUser(auth.currentUser.stsTokenManager.accessToken)
        .then(async (res) => {
          console.log(res);
          console.log('get mongo user email reg ');
          console.log(JSON.stringify(res));
          // con;
          if (res.status === 204) {
            try {
              const response = await fetch(
                'http://localhost:3000/api/auth/create-mongo-user',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ name, role }),
                }
              );
              console.log(response);
              console.log('Create Mongo User Response');
              if (!response.ok) {
                console.log('Failed to create user');
                throw new Error('Failed to create user');
              }

              const userData = await response.json();
              console.log('done');
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
      console.log('Delay called ', milliseconds);
      setTimeout(resolve, milliseconds);
    });

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

  const checkAndSetMonogosUser = async () => {
    try {
      await getMongoUserByEmail(auth.currentUser.email).then((res) => {
        console.log(res.data.existingUser);
        const user = res.data.existingUser;
        dispatch(setMongoUser(user));
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const checkEmailVerification = async () => {
    try {
      // Refresh the user object to get the latest data
      const user = auth.currentUser;
      console.log('checking for verify link');
      console.log(user.email);
      await user.reload();
      // Check if the email is verified
      if (user.emailVerified) {
        console.log('hogaya');
        console.log(user.accessToken + '    ' + user.displayName);
        await dispatch(
          createMongoUser(user.accessToken, user.displayName, 'admin')
        );
        console.log('shivanshu');
        // checkAndSetMonogosUser(user.accessToken);
        await dispatch(setAuthState('/verify'));
        navigate('/verify');
      }
    } catch (error) {
      console.error('Error checking email verification:', error.message);
    }
  };
  useEffect(() => {
    dispatch(setLoading(true));
    console.log('EmailRegister component mounted');
    // Check if user is coming without phone verification
    // if (AuthUser === null) {
    //   navigate('/register');
    // }
    if (
      auth?.currentUser?.email !== null &&
      auth.currentUser.emailVerified === false
    ) {
      var r = 1;

      setLinkSend('sent');
    } else {
      setLinkSend('notsent');
    }
    dispatch(setLoading(false));

    // Check email verification every 2 seconds for 2 minutes
    const intervalId = setInterval(checkEmailVerification, 2000);

    // Cleanup interval after 2 minutes
    setTimeout(() => {
      clearInterval(intervalId);
    }, 120000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

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
        {linkSend === 'load' ? (
          <Loader />
        ) : linkSend === 'sent' ? (
          <Container
            maxWidth='sm'
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'black',
              color: 'white',
            }}
          >
            <Typography
              variant='h2'
              fontWeight='bold'
              style={{ color: '#7CD6AB' }}
            >
              Verify Your email
            </Typography>
            <Typography variant='subtitle2' style={{ margin: '20px 0' }}>
              Confirm your email address by clicking the link we sent to{' '}
              {localStorage.getItem('email')}
            </Typography>
            <Button
              style={{
                backgroundColor: '#7CD6AB',
                color: '#121318',
                margin: '20px 0',
                padding: '0.8rem',
              }}
              fullWidth
              onClick={() => sendEmailLink(auth.currentUser)}
            >
              Resend Link
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
              style={{ width: '70%', margin: 'auto', textAlign: 'left' }}
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
                Register Account
              </Button>
            </form>
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
              Not you, Sign in With Different Account
            </Button>
          </>
        )}
      </Container>
    </>
  );
};

export default EmailRegister;
