import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../FormContainer';
import '../../css/theme.css';
import { setToken } from '../../slices/authSlice';
import { verify, login } from '../../slices/usersApiSlice';
import Loader from '../Loader';

const VerifyScreen = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(20);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  // const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = false;
  // const [verify, { isLoading }] = useVerifyMutation();

  // {auth &&  <Hero />}

  const { userId } = useSelector((state) => state.auth);
  const { emailId } = useSelector((state) => state.auth);
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      setAuth(true);
    }
  }, [navigate, userId]);

  useEffect(() => {
    let interval;

    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  useEffect(() => {
    if (timer === 0) {
      setIsButtonDisabled(false);
      setTimer(30);
    }
  }, [timer]);

  const handleButtonClick = async () => {
    setIsButtonDisabled(true);
    const res = await login({ email: emailId }).then((res) => {
      if (res.status.code === 200) {
        console.log('OTP Resent');
      } else {
        console.log('Error Handling');
        console.log(res);
      }
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await verify({ userId, otp });
      if (res.status === 200) {
        dispatch(setCredentials({ ...res.data.payload }));
        navigate('/home');
      } else {
        console.log('Error Handling');
        console.log(res);
      }
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {auth && (
        <FormContainer>
          <h1>Verification</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-3' controlId='otp'>
              <Form.Label className='my-3'>Confirmation Code</Form.Label>
              <Form.Control
                className='input  my-2'
                type='text'
                placeholder='Enter Confirmation Code'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {isLoading && <Loader />}
            <Button
              type='submit'
              variant='outline-primary'
              className='w-100 mt-3 py-3'
            >
              Submit
            </Button>
            <Button
              disabled={isButtonDisabled}
              onClick={handleButtonClick}
              variant='outline-primary'
              className='w-100 mt-3 py-3'
            >
              {isButtonDisabled
                ? `Wait ${timer} seconds`
                : 'Resend Verification Code'}
            </Button>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default VerifyScreen;
