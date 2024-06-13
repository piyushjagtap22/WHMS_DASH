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
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { setAuthUser, setMongoUser, setToken } from '../../slices/authSlice';
import { setLoading } from '../../slices/loadingSlice';
import { getMongoUser } from '../../slices/usersApiSlice';
import Loader from '../Loader';

const provider = new GoogleAuthProvider();
const appleAuthProvider = new OAuthProvider('apple.com');

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

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Password reset email sent. Check your inbox.');
        setMessage('Password reset email sent. Check your inbox.');
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
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
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = auth.currentUser;
        dispatch(setLoading(true));
        toast.success('Login successful');

        localStorage.setItem('accessToken', userCredential._tokenResponse.idToken);
        dispatch(setToken(userCredential._tokenResponse.idToken));
        dispatch(setAuthUser(user));

        const mongoUser = await getMongoUser(user.stsTokenManager.accessToken);
        dispatch(setMongoUser(mongoUser.data.initialUserSchema));

        navigate('/dashboard');
      })
      .catch((err) => {
        setLoginErrorMessage('Invalid Credentials');
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    setIsFormValid(email.trim() !== '' && password.trim() !== '');
  }, [email, password]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={styles.wrapper}>
        <Container maxWidth="sm" style={styles.container}>
          <Typography variant="h2" style={styles.title}>
            Login with Email
          </Typography>
          <Typography variant="subtitle1" style={styles.subtitle}>
            Please input your email and Password
          </Typography>
          <form style={styles.form} onSubmit={submitHandler}>
            <Typography variant="subtitle2" style={styles.label}>
              Email
            </Typography>
            <div style={styles.inputContainer}>
              <FaEnvelope style={styles.icon} />
              <TextField
                type="email"
                placeholder="Johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.textField}
              />
            </div>
            <Typography variant="subtitle2" style={styles.label}>
              Password
            </Typography>
            <div style={styles.inputContainer}>
              <FaLock style={styles.icon} />
              <TextField
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.textField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <Visibility style={styles.iconColor} /> : <VisibilityOff style={styles.iconColor} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Typography onClick={handleToggleModal} style={styles.forgotButton}>
            Forgot Password?
            </Typography>

            {loginErrorMessage && (
              <Typography style={styles.errorText}>
                {loginErrorMessage}
              </Typography>
            )}
            <Modal open={open} onClose={handleToggleModal} style={styles.modal}>
              <Box sx={styles.modalBox}>
                <Typography variant="subtitle1" style={styles.modalTitle}>
                  Forgot Password?
                </Typography>
                <TextField
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  style={styles.modalTextField}
                />
                <Button variant="contained" color="primary" onClick={handleResetPassword} style={styles.modalButton}>
                  Send Link
                </Button>
                {error && (
                  <Typography style={styles.errorText}>
                    {error}
                  </Typography>
                )}
                {message && (
                  <Typography style={styles.successText}>
                    {message}
                  </Typography>
                )}
              </Box>
            </Modal>
            <Button type="submit"  fullWidth style={styles.submitButton} disabled={!isFormValid}>
              Login
            </Button>

            <Typography component={Link} to="/register" style={styles.registerLink}>
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
 

    backgroundColor:'#7CD6AB',
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
};

export default LoginScreen;

