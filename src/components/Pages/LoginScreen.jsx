import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import FormContainer from '../FormContainer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { callUserApi } from '../../slices/authSlice';
import { createUser } from '../../slices/authSlice';
import { getUserData } from "../../slices/usersApiSlice";
import axios from 'axios';
import {
  OAuthProvider,
  getAdditionalUserInfo,
  signInWithRedirect,
  linkWithPopup,
  linkWithRedirect,
} from 'firebase/auth';
import { async } from '@firebase/util';

const provider = new GoogleAuthProvider();
const appleAuthProvider = new OAuthProvider('apple.com'); // TODO Create an Apple ID provider

function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = useSelector((state) => state.auth.AuthUser);
  useEffect(() => {
    console.log(isAuthenticated);
    // Check if the user is authenticated when the component loads
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        console.log(userCredential);
        // console.log(userCredential.user.accessToken);?
        const response = await dispatch(callUserApi(userCredential.user));
        
        const rolesList = response.data.existingUser.roles
        if(rolesList.includes("unallocated")){
          navigate('/unallocatedUser');
        }else{
          console.log("rolelist",rolesList);
          navigate('/home');
        }

      })
      .catch((err) => {
        console.log(err);
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
          toast.info('logged in sucessfully');
          
          const rolesList = response.data.existingUser.roles
          if(rolesList.includes("unallocated")){
            navigate('/unallocatedUser');
          }else{
            console.log("rolelist",rolesList);
            navigate('/home');
          }

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

  if (isAuthenticated) {
    navigate('/home');
  }
  return (
    <FormContainer>
      <h1>LOGIN</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-3' controlId='email'>
          <Form.Label className='my-3'>Email Address</Form.Label>
          <Form.Control
            className='input  my-2'
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-3' controlId='password'>
          <Form.Label className='my-3'>Password</Form.Label>
          <Form.Control
            className='input  my-2'
            type='password'
            placeholder='Enter email'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <div className='mt-5'>
          <Form.Check
            type='checkbox'
            id={`default-checkbox`}
            label='Remember me'
          />
        </div>

        <Button className='py-3 mt-5 w-100' disabled={isLoading} type='submit'>
          LOGIN
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
      </Form>

      {isLoading && <Loader />}

      <Row className='mx-auto py-5'>
        <Col>
          <Link to={`/login`}>Forgotten password?</Link>
        </Col>
      </Row>

      <Row className='h3 color-primary mx-auto'>
        <Col>Don’t have an account yet?</Col>
      </Row>

      <Row className='mx-auto my-3'>
        <Col>
          <Link to={`/register`}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;
