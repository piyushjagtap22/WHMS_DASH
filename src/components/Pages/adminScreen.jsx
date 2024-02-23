import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../FormContainer';
import { SetUsers } from '../../slices/superAdminSlice';
import { getAllUsers } from '../../slices/superAdminApiSlice';
import {
  getUnallocatedUsers,
  AddUsersToAdmin,
  getAdminUsers,
  RemoveUsersFromAdmin,
} from '../../slices/adminApiSlice';

// import { auth } from '../../firebase';
const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]); // State to store admin users
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.superAdmin);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  console.log(userInfo);
  const token = useSelector(
    (state) => state.auth.AuthUser.stsTokenManager.accessToken
  );
  const addUserToAdmin = async (_id) => {
    console.log('mapped');
    try {
      console.log('in fetchdata');
      const data = {
        adminId: AuthUser.uid,
        userIds: [_id],
      };
      console.log(data);
      const response = await AddUsersToAdmin(data, token);
      console.log(response);
      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        setAdminUsers((prevUsers) => [
          ...prevUsers,
          users.find((user) => user._id === _id),
        ]);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== _id));
      } else {
        // Handle any errors or show a message
      }
    } catch (error) {
      // Handle any network or API request errors
    }
  };
  const removeUser = async (id) => {
    console.log('deleted');
    try {
      console.log('in fetchdata');
      const data = {
        adminId: AuthUser.uid,
        userIds: [id],
      };
      const response = await RemoveUsersFromAdmin(data, token);
      console.log(response);
      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        setUsers((prevUsers) => [
          ...prevUsers,
          adminUsers.find((user) => user._id === id),
        ]);

        setAdminUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== id)
        );
      } else {
        // Handle any errors or show a message
      }
    } catch (error) {
      // Handle any network or API request errors
    }
  };
  useEffect(() => {
    console.log(MongoUser);
    setUsers(MongoUser.AdminSchema.userIds);
    console.log(users);
    console.log(users.length);
  }, [AuthUser, MongoUser]);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getUnallocatedUsers(token);
        console.log(response);
        if (response.status === 200) {
          setUsers(response.data);
          console.log(users); // This might not show the updated value immediately
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        // Handle any network or API request errors
      }
    };
    fetchData();

    const fetchAdminUsers = async () => {
      try {
        const response = await getAdminUsers(token);
        if (response.status === 200) {
          setAdminUsers(response.data);
          console.log(response.data); // Log the adminUsers here after receiving the response
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
    };
    fetchAdminUsers();
  }, [dispatch, token]);

  return (
    <div>
      <div>
        Hi Admin {AuthUser.uid}
        <h1>User Mapped to you</h1>
        {adminUsers.length === 0 ? (
          'No user found'
        ) : (
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user._id}</td>
                  <td>
                    <button onClick={() => removeUser(user._id)}>
                      Remove User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <br></br>
      <div>
        <h1>Unallocated Users</h1>
        <div>
          {users.length === 0 ? (
            'No user found'
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user._id}</td>
                    <td>
                      <button onClick={() => addUserToAdmin(user._id)}>
                        Add User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      token:
      {token}
    </div>
  );
};

export default AdminScreen;
