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

const RegisterScreen = () => {
  const [displayName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = false;
  // const [register, { isLoading }] = useRegisterMutation();

  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [navigate, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ displayName, email, password }).then(
        (res) => {
          if (res.status === 201) {
            console.log('TODO : Alert to say verify email');
            navigate('/login');
          }
          if (res.data.status === 409) {
            console.log('Display user already Exists, please Sign in');
          } else {
            console.log(res.data.payload);
          }
        }
      );
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
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
