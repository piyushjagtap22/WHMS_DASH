import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { setLoading } from '../../slices/loadingSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { InputAdornment } from '@mui/material';

import { toast } from 'react-toastify';
import Loader from '../Loader';
import { initializeAuthUser, setToken } from '../../slices/authSlice.js';
import FormContainer from '../FormContainer';
import { signInWithEmailAndPassword , sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';

import { getMongoUser } from '../../slices/usersApiSlice.js';
import { Modal , Box} from '@material-ui/core';
import {
  OAuthProvider,
  getAdditionalUserInfo,
  signInWithRedirect,
  linkWithPopup,
  linkWithRedirect,
} from 'firebase/auth';
import {
  setAuthState,
  setAuthUser,
  setMongoUser,
} from '../../slices/authSlice.js';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';

import {
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { async } from '@firebase/util';

const provider = new GoogleAuthProvider();
const appleAuthProvider = new OAuthProvider('apple.com'); // TODO Create an Apple ID provider

function LoginScreen() {
  const loading = useSelector((state) => state.loading.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);


  const handleResetPassword = () => {
    sendPasswordResetEmail(auth ,email)
      .then(() => {
        toast.success('Success');
        setMessage('Password reset email sent. Check your inbox.');
        setError(null);
      })
      .catch((error) => {
        console.log("error aaya",error)
        setError(error.message);
        setMessage(null);
      });
  };

  const handleToggleModal = () => {
    setOpen(!open);
  };



  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log(userCredential);

        const user = auth.currentUser;
        console.log(userCredential._tokenResponse.idToken);
        try {
          dispatch(setLoading(true));
          toast.success('Success');
  
          const user = auth.currentUser;
          console.log(user.email);
  
          console.log(userCredential);
          localStorage.setItem('accessToken', userCredential._tokenResponse.idToken);
          setToken(userCredential._tokenResponse.idToken);
  
          dispatch(
            setAuthUser({
              email: user.email,
              emailVerified: user.emailVerified,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL,
              providerData: user.providerData,
              stsTokenManager: {
                accessToken: user.stsTokenManager.accessToken,
                expirationTime: user.stsTokenManager.expirationTime,
                refreshToken: user.stsTokenManager.refreshToken,
              },
              uid: user.uid,
              displayName: user.displayName,
            })
          );
  
          if (
            user !== null &&
            (user.email === null || user.emailVerified === false)
          ) {
            dispatch(setAuthState('/emailregister'));
            console.log('emailregister');
            navigate('/emailregister');
          } else if (
            user !== null &&
            user.email !== null &&
            user.emailVerified === true
          ) {
            console.log('get mongo and navigate');
            const mgu = await getMongoUser(user.stsTokenManager.accessToken);
            console.log(mgu);
            dispatch(setMongoUser(mgu.data.initialUserSchema));
            if (mgu.status === 204) {
              dispatch(setAuthState('/verify'));
              console.log('verify');
              navigate('/verify');
            } else if (mgu.data.InitialUserSchema.roles[0] === 'superadmin') {
              dispatch(setAuthState('/superadmin'));
              console.log('superadmin');
              navigate('/superadmin');
            } else if (mgu.data.InitialUserSchema.doc_verified === true) {
              dispatch(setAuthState('/dashboard'));
              console.log('dashboard');
              navigate('/dashboard');
            } else {
              dispatch(setAuthState('/verify'));
              console.log('verify');
              navigate('/verify');
            }
          } else if (
            user !== null &&
            user.email !== null &&
            user.emailVerified === false
          ) {
            dispatch(setAuthState('/verify'));
            console.log('verify');
            navigate('/verify');
          }
        } catch (err) {
          console.log(err.message);
          toast.error('Invalid verification code');
        } finally {
          dispatch(setLoading(false));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
         {loading ? (
        <Loader />
      ) : (
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
 
          <Typography
            variant='h2'
            fontWeight='bold'
            style={{ color: '#7CD6AB' }}
          >
           Login Account
          </Typography>
          <Typography
            variant='subtitle1'
            style={{ margin: '15px 0', padding: '0px 120px', color: '#75777B' }}
          >
            Please input your email and Password
          </Typography>
          <form
            style={{ width: '70%', margin: 'auto', textAlign: 'left' }}
            
            onSubmit={submitHandler}
          >
            <Typography
              variant='subtitle2'
              style={{ margin: '8px 9px', color: '#75777B' }}
            >
              Email
            </Typography>

            <div>
            <div>
              <input
                type="email"
                placeholder="Johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon style={{ color: '#7CD6AB' }} />
                    </InputAdornment>
                  ),
                }}
                style={{
                  fontSize: '16px',
                  background: 'black',
                  color: 'aliceblue',
                  border: '1px solid #75777B',
                  borderRadius: '5px',
                  width: '349px',
                  outline: 'none',
                  padding: '23.5px 14px 18.5px 58px',
                  height: '52px',
                  transition: 'box-shadow 0.25s ease 0s, border-color 0.25s ease 0s',
                }}
              />
            </div>
            <Typography
              variant='subtitle2'
              style={{ margin: '10px 9px', color: '#75777B' }}
            >
              Password
            </Typography>
            <div style={{ }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon style={{ color: '#7CD6AB' }} />
                    </InputAdornment>
                  ),
                }}
                style={{
                  fontSize: '16px',
                  background: 'black',
                  color: 'aliceblue',
                  border: '1px solid #75777B',
                  borderRadius: '5px',
                  width: '349px',
                  outline: 'none',
                  padding: '23.5px 14px 18.5px 58px',
                  height: '52px',
                  transition: 'box-shadow 0.25s ease 0s, border-color 0.25s ease 0s',
                }}
              />
            </div>

              <style>
                {`
                .react-tel-input .special-label  {
                  display: none;
                }
                .react-tel-input .selected-flag {
                  outline: none;
                  background: black;
                  color: black;
                  position: relative;
                  width: 52px;
                  height: 100%;
                  padding: 0 0 0 11px;
                  border-radius: 3px 0 0 3px;
                }
                .react-tel-input .flag-dropdown.open .selected-flag {
                  background: black;
                  border-radius: 3px 0 0 0;
                }
                .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus {
                  background-color: black;
                }
                .react-tel-input .country-list {
                  background-color: black;
                }
                .react-tel-input .country-list .country.highlight {
                  background-color: #7CD6AB;
                  color: black;
                }
                .react-tel-input .country-list .country:hover {
                  background-color: #7CD6AB;
                  color: black;
                }
              `}
              </style>
            </div>
              
            <Button variant="outlined" onClick={handleToggleModal}>
              Forgot Password?
            </Button>
   


            <Modal open={open} onClose={handleToggleModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2, textAlign: 'center' }}>
                  <Typography variant='subtitle1' style={{ margin: '15px 0', color: '#7CD6AB' }}>
                    Forgot Password?
                  </Typography>
                
                  <TextField
                    type="email"
                    placeholder='johndoe@gmail.com'
                    
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    style={{
                      fontSize: '16px',
                      background: 'black',
                      color: 'aliceblue',
                      border: '1px solid #75777B',
                      borderRadius: '5px',
                      
                      outline: 'white',
                      
                      height: '52px',
                      
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResetPassword}
                    style={{ marginTop: '15px',backgroundColor: '#7CD6AB' }}
                  >
                    Reset Password
                  </Button>
                  {error && <Typography style={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}
                  {message && <Typography style={{ color: 'green', marginTop: '10px' }}>{message}</Typography>}
                </Box>
            </Modal >


        <Button className='py-3 mt-5 w-100' disabled={isLoading} type='submit'>
          LOGIN
        </Button>
            <div id='recaptcha-container' />

          
            
          </form>
          <Typography
            variant='subtitle1'
            style={{ margin: '19px 12px', padding: '0px 0px', color: '#7CD6AB' }}
            component={Link} // Render Typography as a link
            to='/register' // Specify the route to navigate to
          >
            New User Register
          </Typography>

        </Container>
      )}

    
    </>

  );
}

export default LoginScreen;
