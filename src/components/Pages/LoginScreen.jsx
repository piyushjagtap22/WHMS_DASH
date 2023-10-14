import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import FormContainer from '../FormContainer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';
import {
  OAuthProvider,
  getAdditionalUserInfo,
  signInWithRedirect,
  linkWithPopup,
  linkWithRedirect,
} from 'firebase/auth';

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
      .then((userCredential) => {
        console.log(userCredential.toJSON());
        if (!userCredential.emailVerified) {
          toast.info('Please Verify Account');
          sendEmailVerification(userCredential)
            .then(() => {
              signOut(auth).catch((err) => {
                console.log(err);
              });
              toast.info(
                'A verification email has been sent to your email address. Please check your inbox.'
              );
            })
            .catch((error) => {
              console.error('Error sending email verification:', error);
            });
        }
        console.log(userCredential);
        // navigate('/home');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // You can handle the user object as needed, e.g., dispatch it to the Redux store.
      console.log(user);
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle Apple ID sign-in
  const handleAppleSignIn = async () => {
    try {
      await signInWithRedirect(auth, appleAuthProvider);
    } catch (error) {
      console.error(error);
    }
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
