import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import '../../css/theme.css';
import Loader from '../Loader';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { auth } from '../../firebase';

const RegisterScreen = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [ph, setPh] = useState('');
  const [displayName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Add state for phone number

  const navigate = useNavigate();
  const isLoading = false;
  const phoneAuth = getAuth();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [navigate, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Create a user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // After user creation, set the display name
        const user = userCredential.user;
        return updateProfile(user, { displayName }).then(() => {
          sendEmailVerification(user)
            .then(() => {
              toast.info(
                'A verification email has been sent to your email address. Please check your inbox.'
              );
            })
            .catch((error) => {
              console.error('Error sending email verification:', error);
            });
          toast.info('User Created, Please Verify Mail then Login');
          signOut(auth).catch((err) => {
            console.log(err);
          });
          navigate('/login');
        });
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code === 'auth/email-already-in-use') {
          toast.error('User already exists, Please Sign In');
        } else if (error.code === 'auth/weak-password') {
          toast.error('Please use a strong password');
        } else {
          toast.error(error.message || 'Error creating user');
        }
      });
  };

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        phoneAuth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            onSignup();
          },
          'expired-callback': () => {},
        }
      );
    }
  }

  function onSignup() {
    // seetLoading(true);
    onCaptchaVerify();
    const formatPh = '+' + ph;
    console.log(formatPh);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(phoneAuth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
        toast.success('OTP sent Succesfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function onOTPVerify(displayName) {
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        // After OTP verification, set the display name and navigate to '/home'
        return updateProfile(res.user, { displayName })
          .then(() => {
            navigate('/home');
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-3' controlId='name'>
          <Form.Label className='my-3'>Name</Form.Label>
          <Form.Control
            className='input  my-2'
            type='name'
            placeholder='Enter name'
            value={displayName}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-3' controlId='email'>
          <Form.Label className='my-3'>Your Email</Form.Label>
          <Form.Control
            className='input  my-2'
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-3' controlId='password'>
          <Form.Label className='my-3'>Your Password</Form.Label>
          <Form.Control
            className='input  my-2'
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {isLoading && <Loader />}
        <Button
          type='submit'
          variant='outline-primary'
          className='w-100 mt-3 py-3'
        >
          Register
        </Button>
        <Form.Group className='my-3' controlId='phone'>
          {/* <Form.Label className='my-3'>Phone Number</Form.Label>
          <div id='recaptcha-container'></div> */}

          {/* <Form.Control
            className='input  my-2'
            type='tel'
            placeholder='Enter phone number'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control> */}
        </Form.Group>

        <div id='recaptcha-container'></div>
        {showOTP ? (
        <>
          <Form.Group className='my-3' controlId='password'>
          <Form.Label className='my-3'>OTP</Form.Label>
          <Form.Control
            className='input  my-2'
            type='text'
            placeholder='Enter OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          ></Form.Control>
        </Form.Group>
          <Button
            onClick={onOTPVerify(displayName)}
            type='button'
            variant='outline-primary'
            className='w-100 py-3'
          >
            Verify Otp
          </Button>
        </>
      ) : (
        <>
          <Form.Group className='my-3' controlId='password'>
          <Form.Label className='my-3'>Register Using Phone</Form.Label>
          <PhoneInput className='input  my-2' country={'in'} value={ph} onChange={setPh} />
        </Form.Group>
          
          <div className='mt-3'>
          <Button
            onClick={onSignup}
            type='button'
            variant='outline-primary'
            className='w-100 py-3'
          >
            Send Code via sms
          </Button>
        </div>
        </>
      )}
        {/* <div className='mt-3'>
          <Button
            onClick={onSignup}
            type='button'
            variant='outline-primary'
            className='w-100 py-3'
          >
            Send Code via sms
          </Button>
        </div> */}
      </Form>

      

      

      <Row className='mx-auto py-5'>
        <Col>
          <Link to={`/login`}>or log in to your account</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
