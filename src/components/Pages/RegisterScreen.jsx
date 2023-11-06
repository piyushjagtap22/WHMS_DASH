import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import '../../css/theme.css';
import { setUserId, logout } from '../../slices/authSlice';
import { register } from '../../slices/usersApiSlice';
import Loader from '../Loader';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { callUserApi } from '../../slices/authSlice';
import { createUser } from '../../slices/authSlice';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import OtpInput from 'otp-input-react';

const provider = new GoogleAuthProvider();
// const appleAuthProvider = new OAuthProvider('apple.com'); // TODO Create an Apple ID provider

const RegisterScreen = () => {
  // const auth1 = getAuth();
  // window.recaptchaVerifier = new RecaptchaVerifier(
  //   auth1,
  //   'recaptcha-container',
  //   {}
  // );
  const [otp, setOtp] = useState('');
  const appVerifier = window.recaptchaVerifier;
  const [displayName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Add state for phone number

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = false;
  // const [register, { isLoading }] = useRegisterMutation();

  const { token } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   console.log("runimng");
  //   // if (token) {
  //   //   navigate('/home');
  //   // }
  // }, [navigate, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // Create a user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // After user creation, set the display name
        const user = userCredential.user;

        return updateProfile(user, { displayName }).then(async() => {
        
        toast.info('User Created, Please Verify Mail then Login');
        // User doesn't exist, create a new user
          try{
            const response2 = await dispatch(createUser(user));
            console.log(response2);
            toast.info('Creating Mongo User');
            console.log("Creating Mongo User");
          }catch(error){
            console.error(error);
            toast.info('Mongo User Creation failed');
            console.log("Creation user failed");
          }
          console.log("navigationg to login");
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

    // Function to handle Google sign-in
    const handleGoogleSignIn = async () => {
      try {
        let userExist = false;
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // You can handle the user object as needed, e.g., dispatch it to the Redux store.
        console.log("check user",user.stsTokenManager.accessToken);

        // check mongo-user exist in db or not      ------> using email
          // Check if the user exists in the MongoDB database
          const response = await dispatch(callUserApi(user));

        if (response.data.message.toUpperCase() == "USER NOT FOUND") {
          // User doesn't exist, create a new user
          const response2 = await createUser(response)
        
          console.log(response2);

          toast.info('Creating Mongo User');
          navigate('/unallocatedUser');
        } else {
          // User already exists
          toast.info('User already exists please login');
          navigate('/login');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    // Function to handle Apple ID sign-in
    const handleAppleSignIn = async() => {
      toast.info('Feature will be coming soon');
      // const provider = new OAuthProvider('apple.com');
      // try {
      //   const result = await signInWithPopup(auth, appleAuthProvider);
      //   const user = result.user;
      //   // You can handle the user object as needed, e.g., dispatch it to the Redux store.
      //   console.log(user);
      //   navigate('/home');
      // } catch (error) {
      //   console.error(error);
      // }
    };

  // const res = await register({ displayName, email, password }).then(
  //   (res) => {
  //     if (res.status === 201) {
  //       console.log('TODO : Alert to say verify email');
  //       navigate('/login');
  //     }
  //     if (res.data.status === 409) {
  //       console.log('Display user already Exists, please Sign in');
  //     } else {
  //       console.log(res.data.payload);
  //     }
  //   }
  // );

  const handlePhoneSignUp = async () => {
    console.log('hello');
    //   try {
    //     // Initiate the phone number sign-up
    //     // const appVerifier = window.recaptchaVerifier;
    //     const phoneCredential = await signInWithPhoneNumber(
    //       auth1,
    //       phoneNumber,
    //       appVerifier
    //     )
    //       .then((confirmationResult) => {
    //         window.confirmationResult = confirmationResult;
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //     // You can handle the phone sign-up success here
    //     console.log('Phone sign-up successful:', phoneCredential);
    //     // Navigate to a verification screen where the user enters the verification code.
    //     // navigate('/verify-phone', { state: { phoneCredential } });
    //   } catch (error) {
    //     console.error('Phone sign-up error:', error);
    //   }
  };

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
        <div className='mt-3'>
          <Button
            className='py-3 w-100'
            disabled={isLoading}
            type='button'
            onClick={handleGoogleSignIn} // Call the Google sign-in function
          >
            Sign In with Google
          </Button>
        </div>

        <div className='mt-3'>
          <Button
            className='py-3 w-100'
            disabled={isLoading}
            type='button'
            onClick={handleAppleSignIn} // Call the Apple ID sign-in function
          >
            Sign In with Apple ID
          </Button>
        </div>
        <Form.Group className='my-3' controlId='phone'>
          <Form.Label className='my-3'>Phone Number</Form.Label>
          <div id='recaptcha-container'></div>

          <Form.Control
            className='input  my-2'
            type='tel'
            placeholder='Enter phone number'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div className='mt-3'>
          <Button
            type='button'
            variant='outline-primary'
            className='w-100 py-3'
            onClick={handlePhoneSignUp}
          >
            Sign Up with Phone Number
          </Button>
        </div>
        
      </Form>
      <OtpInput
        onChange={setOtp}
        OTPLength={6}
        otpType='number'
        disabled={false}
        autoFocus
        // className
      />
      <button>Verify Otp</button>

      <Row className='mx-auto py-5'>
        <Col>
          <Link to={`/login`}>or log in to your account</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
