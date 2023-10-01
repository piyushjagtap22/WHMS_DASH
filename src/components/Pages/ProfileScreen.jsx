import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import { updateUser } from '../../slices/profileApiSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { userInfo, token } = useSelector((state) => state.auth);
  const { profileInfo } = useSelector((state) => state.profile);
  const [age, setAge] = useState(profileInfo?.age || '');
  const [weight, setWeight] = useState(profileInfo?.weight || '');
  const [gender, setGender] = useState(profileInfo?.gender || '');
  const [height, setHeight] = useState(profileInfo?.height || '');

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await updateUser(
        {
          age,
          weight,
          gender,
          height,
        },
        token
      );

      if (res.status === 200) {
        toast.success('Profile updated successfully.');
      } else if (res.status === 409) {
        toast.error('Display user already exists, please sign in.');
      } else {
        toast.error('Unexpected error, please sign in again.');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error('Display user already exists, please sign in.');
      } else {
        console.error(err);
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  return (
    <FormContainer>
      <h3>Hello {userInfo.name}!</h3>
      <h1>Update Profile</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='name' value={userInfo.name} disabled />
        </Form.Group>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' value={userInfo.email} disabled />
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
