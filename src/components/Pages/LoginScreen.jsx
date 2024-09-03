import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import CustomButton from '../Button';
import {
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { auth } from '../../firebase';
import { setAuthUser, setMongoUser, setToken } from '../../slices/authSlice';
import { setLoading } from '../../slices/loadingSlice';
import { getMongoUser } from '../../slices/usersApiSlice';
import Loader from '../Loader';
import { setAuthState } from '../../slices/authSlice';
import { useLayoutEffect } from 'react';
function LoginScreen() {
  const loading = useSelector((state) => state.loading.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  useLayoutEffect(() => {
    toast.dismiss(); // Dismiss any previous toasts
  }, []);
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Password reset email sent. Check your inbox.');
        setError(null);
      })
      .catch((error) => {
        if (error.message === 'Firebase: Error (auth/user-not-found).') {
          toast.error('User not found');
        }
        setMessage(null);
      });
  };

  const handleToggleModal = () => {
    setOpen(!open);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsFormValid(false);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = auth.currentUser;
      console.log('User:', user);
      dispatch(setLoading(true));
      toast.success('Login successful');
      localStorage.setItem(
        'accessToken',
        userCredential._tokenResponse.idToken
      );
      await dispatch(setToken(userCredential._tokenResponse.idToken));
      console.log('User Details:', {
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
      });
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

      const mongoUser = await getMongoUser(user.stsTokenManager.accessToken);
      console.log('Mongo User:', mongoUser);
      dispatch(setMongoUser(mongoUser.data.InitialUserSchema));
      console.log(mongoUser.status === 200, mongoUser.data, user.emailVerified);
      if (mongoUser.status === 204 && !mongoUser.data) {
        console.log('Navigating to /emailregister');
        dispatch(setAuthState('/emailregister'));
        navigate('/emailregister');
      } else if (
        mongoUser.status === 200 &&
        mongoUser.data &&
        user.emailVerified === false
      ) {
        console.log('Navigating to /emailregister');
        dispatch(setAuthState('/emailregister'));
        navigate('/emailregister');
      } else if (mongoUser.status === 204) {
        console.log('Navigating to /verify');
        dispatch(setAuthState('/verify'));
        navigate('/verify');
      } else if (mongoUser.data.InitialUserSchema.roles[0] === 'superadmin') {
        console.log('Navigating to /superadmin');
        dispatch(setAuthState('/superadmin'));
        navigate('/superadmin');
      } else if (mongoUser.data.InitialUserSchema.doc_verified === true) {
        console.log('Navigating to /dashboard');
        dispatch(setAuthState('/dashboard'));
        navigate('/dashboard');
      } else {
        console.log('Navigating to /verify');
        dispatch(setAuthState('/verify'));
        navigate('/verify');
      }
    } catch (err) {
      console.error('Login Error:', err);
      toast.error('Invalid Credentials');
    } finally {
      dispatch(setLoading(false));
    }
  };
  const [isValidMail, setIsValidMail] = useState(false);
  const validateEmail = (email) => {
    // Regular expression to check for valid email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // Check if the email matches the regex pattern
    if (emailRegex.test(email)) {
      setIsValidMail(true); // If valid, set isValidMail to true
    } else {
      setIsValidMail(false); // If invalid, set isValidMail to false
    }
  };

  useEffect(() => {
    setIsFormValid(email.trim() !== '' && password.trim() !== '');
  }, [email, password]);

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
      {loading ? (
        <Loader />
      ) : (
        <div style={styles.wrapper}>
          <Container maxWidth='sm' style={styles.container}>
            <Typography variant='h2' style={styles.title}>
              Login with Email
            </Typography>
            <Typography variant='subtitle1' style={styles.subtitle}>
              Please input your email and Password
            </Typography>
            <form style={styles.form} onSubmit={submitHandler}>
              <Typography variant='subtitle2' style={styles.label}>
                Email
              </Typography>
              <div style={styles.inputContainer}>
                <FaEnvelope style={styles.icon} />
                <TextField
                  type='email'
                  placeholder='Johndoe@gmail.com'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  style={styles.textField}
                />
              </div>
              <Typography variant='subtitle2' style={styles.label}>
                Password
              </Typography>
              <div style={styles.inputContainer}>
                <FaLock style={styles.icon} />
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.textField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? (
                            <Visibility style={styles.iconColor} />
                          ) : (
                            <VisibilityOff style={styles.iconColor} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Typography
                onClick={handleToggleModal}
                style={styles.forgotButton}
              >
                Forgot Password?
              </Typography>

              <Modal
                open={open}
                onClose={handleToggleModal}
                style={styles.modal}
              >
                <Box sx={styles.modalBox}>
                  <Typography variant='subtitle1' style={styles.modalTitle}>
                    Forgot Password?
                  </Typography>
                  <TextField
                    type='email'
                    placeholder='johndoe@gmail.com'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    fullWidth
                    style={styles.modalTextField}
                  />

                  <CustomButton
                    type='submit'
                    variant='contained'
                    color='primary'
                    onClick={handleResetPassword}
                    style={
                      isValidMail ? styles.submitButton : styles.disabledButton
                    }
                  >
                    Send Link
                  </CustomButton>
                  {/* <CustomButton
                    type='submit'
                    style={
                      !phoneNumber || !termsChecked || (showOtpScreen && !otp)
                        ? styles.disabledButton
                        : styles.submitButton
                    }
                    variant='contained'
                    width='100%'
                    // fullWidth
                    onClick={showOtpScreen ? onOtpVerify : onSignup}
                    disabled={buttonLoader || !termsChecked}
                  >
                    {buttonLoader ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress size={22} />
                      </Box>
                    ) : showOtpScreen ? (
                      'Verify OTP'
                    ) : (
                      'Send OTP'
                    )}
                  </CustomButton> */}
                </Box>
              </Modal>
              <Button
                type='submit'
                fullWidth
                style={
                  !isFormValid || !isValidMail
                    ? styles.disabledButton
                    : styles.submitButton
                }
                disabled={!isFormValid || !isValidMail}
              >
                Login
              </Button>

              <Typography
                component={Link}
                to='/register'
                style={styles.registerLink}
              >
                New User? Register
              </Typography>
            </form>
          </Container>
        </div>
      )}
    </>
  );
}

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
    margin: '8px 0px',
    color: '#75777B',
  },
  inputContainer: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    marginTop: '20px',
    marginLeft: '20px',
    scale: '1.3',
    color: 'aliceblue',
  },
  textField: {
    border: '1px solid #75777B',
    borderRadius: '5px',
    width: '349px',
    outline: 'none',
    paddingLeft: '49px',
    height: '53px',
    transition: 'box-shadow 0.25s ease 0s',
  },
  iconColor: {
    color: '#7CD6AB',
  },
  forgotButton: {
    color: '#7CD6AB',
    marginTop: '10px',
    width: '100%',
  },
  forgotText: {
    margin: '8px 0',
    color: '#7CD6AB',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
  },
  successText: {
    color: 'green',
    marginTop: '10px',
  },
  modal: {
    display: 'flex',
    opacity: '99.99999%',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: 300,
    bgcolor: '#121318',
    p: 2,
    textAlign: 'center',
  },
  modalTitle: {
    alignContent: 'left',
    margin: '15px 0',
    color: '#7CD6AB',
  },
  modalTextField: {
    fontSize: '16px',
    color: 'aliceblue',
    border: '1px solid #75777B',
    borderRadius: '5px',
    outline: 'white',
    height: '52px',
  },
  modalButton: {
    marginTop: '15px',
    backgroundColor: '#7CD6AB',
    borderRadius: '5px',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#7CD6AB',
    color: '#121318',
    margin: '30px 0',
    padding: '0.8rem',
    fontWeight: 'bold',
  },
  registerLink: {
    color: '#7CD6AB',
    textAlign: 'left',
    variant: 'outlined',
    width: '100%',
    display: 'block',
    // paddingLeft: '80px',
    //     paddingTop: '12px',
  },
  submitButton: {
    backgroundColor: '#7CD6AB',
    color: '#121318',
    marginTop: '101px',
    marginBottom: '30px',
    padding: '0.8rem',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    color: '#121318',
    marginTop: '101px',
    marginBottom: '30px',
    padding: '0.8rem',
    fontWeight: 'bold',
  },
};

export default LoginScreen;
