import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OtpInput from 'otp-input-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { toast, Toaster } from 'react-hot-toast';
import 'react-phone-input-2/lib/material.css';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAuthUser, setToken } from '../../slices/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';

const Register = () => {
  // const AuthUser = useSelector((state) => state.auth.AuthUser);
  // if (AuthUser){

  // }
  useEffect(() => {
    console.log('mounted');
  }, []);

  const [otp, setOtp] = useState('');
  const [confirmOtp, setConfirmOtp] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(true);
  const [errors, setErrors] = useState({});
  const formatPhone = '+' + phoneNumber;
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  function recaptchaVerifier(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      { size: 'invisible' }
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, formatPhone, recaptchaVerifier);
  }

  const onSignup = async (e) => {
    console.log(auth);
    e.preventDefault();
    setErrors('');
    if (phoneNumber === '' || phoneNumber === undefined) {
      console.log('error');
      return toast.error('Please enter a valid number');
    }
    if (!termsChecked) {
      return toast.error('Please agree to terms and conditions');
    }

    try {
      const response = await recaptchaVerifier(formatPhone);
      setConfirmOtp(response);
      toast.success('Otp Send succesfully !');
      setShowOtpScreen(true);
      console.log(response);
    } catch (err) {
      setErrors(err.message);
      toast.error('Please retry again');
    }
  };

  const onOtpVerify = async (e) => {
    e.preventDefault();
    if (otp === '' || otp === undefined) {
      toast.error('Please enter a valid otp');
    } else {
      console.log(otp);
      try {
        await confirmOtp.confirm(otp).then((result) => {
          toast.success('Success');
          const user = auth.currentUser;
          localStorage.setItem('accessToken', result._tokenResponse.idToken);
          console.log(result._tokenResponse.idToken);
          setToken(result._tokenResponse.idToken);
          // dispatch(initializeAuthUser());
          console.log(auth);
          user.email === null
            ? navigate('/emailregister')
            : user.emailVerified
            ? navigate('/dashboard')
            : navigate('/emailregister');
        });
      } catch (err) {
        console.log(err.message);
        toast.error('invalid-verification-code');
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (!termsChecked) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    // Set errors and prevent submission if there are errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };
  };

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
        <Typography variant='h2' fontWeight='bold' style={{ color: '#7CD6AB' }}>
          Register Account
        </Typography>
        <Typography
          variant='subtitle1'
          style={{ margin: '15px 0', padding: '0px 120px', color: '#75777B' }}
        >
          For the purpose of industry regulation, your details are required.
        </Typography>
        <form
          style={{ width: '70%', margin: 'auto', textAlign: 'left' }}
          onSubmit={handleSubmit}
        >
          <Typography
            variant='subtitle2'
            style={{ margin: '8px 0', color: '#75777B' }}
          >
            Phone Number
          </Typography>

          <div>
            <PhoneInput
              country={'in'}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputStyle={{
                fontSize: '16px',
                background: 'black',
                color: 'aliceblue',
                border: '1px solid #75777B',
                borderRadius: '5px',
                width: '349px',
                outline: 'none',
                padding: '23.5px 14px 18.5px 58px',
                height: '52px',
                transition:
                  'box-shadow 0.25s ease 0s, border-color 0.25s ease 0s',
              }}
            />
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

          {showOtpScreen && (
            <TextField
              label='OTP'
              type={showPassword ? 'text' : 'password'}
              variant='outlined'
              fullWidth
              style={{ margin: '20px 0' }}
              InputLabelProps={{ style: { color: 'grey' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon style={{ color: '#7CD6AB' }} />
                      ) : (
                        <VisibilityOffIcon style={{ color: '#7CD6AB' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}
          <div id='recaptcha-container' />

          {!showOtpScreen && (
            <FormControlLabel
              control={<Checkbox style={{ color: '#7CD6AB' }} />}
              label='I agree to the terms and conditions'
              style={{ margin: '20px 0' }}
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              error={errors.terms}
            />
          )}
          <Button
            type='submit'
            style={{
              backgroundColor: '#7CD6AB',
              color: '#121318',
              margin: '30px 0',
              padding: '0.8rem',
              fontWeight: 'bold',
            }}
            fullWidth
            onClick={showOtpScreen ? onOtpVerify : onSignup}
          >
            {showOtpScreen ? 'Verify OTP' : 'Send OTP'}
          </Button>
        </form>
      </Container>
    </>
  );
};

export default Register;
