import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import { setToken } from '../../slices/authSlice';
import { updateUser } from '../../slices/usersApiSlice';
import { setProfileInfo } from '../../slices/profileSlice';

const ProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [authId, setAuthId] = useState('');
  const dispatch = useDispatch();
  const { AuthUser } = useSelector((state) => state.auth); // Get userInfo from the Redux store

  useEffect(() => {
    // Set the initial values for name and email based on userInfo

    if (AuthUser) {
      console.log(AuthUser);
      setName(AuthUser.displayName);
      setEmail(AuthUser.email);
      setAuthId(AuthUser.uid);
    }
  }, [AuthUser]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      console.log('1');
      const res = await updateUser(
        {
          authId,
          age,
          weight,
          gender,
          height,
        },
        token
      ).then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          console.log('TODO : Alert to say Updated profile');
        } else if (res.data.status === 409) {
          console.log('Display user already Exists, please Sign in');
        } else {
          console.log(res);
        }
      });
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h3>Hello {name}!</h3>
      <h1>Update Profile</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='name' value={name} disabled></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' value={email} disabled></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='age'>
          <Form.Label>Age</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Age'
            value={age}
            onChange={(e) => setAge(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='gender'>
          <Form.Label>Gender</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Gender'
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='height'>
          <Form.Label>Height</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Height'
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='weight'>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Weight'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Update
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
