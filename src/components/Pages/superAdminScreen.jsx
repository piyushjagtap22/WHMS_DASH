import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../FormContainer';
import { SetUsers } from '../../slices/superAdminSlice';
import {
  createAdmin,
  getAllUsers,
  removeAdmin,
} from '../../slices/superAdminApiSlice';

const SuperAdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector(
    (state) => state.auth.AuthUser.stsTokenManager.accessToken
  );
  const { userInfo } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getAllUsers(token);
        console.log(response);
        if (response.status === 200) {
          setUsers(response.data);
          console.log(response.data); // Assuming the user data is in the response data
        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        // Handle any network or API request errors
      }
    };
    fetchData();
  }, [dispatch, token]);

  const adminToggle = async (user) => {
    console.log();
    if (user.roles[0] === 'superadmin') {
      console.log('Already Superadmin');
    } else {
      let response;
      if (user.roles[0] === 'admin') {
        response = await removeAdmin({ _id: user._id }, token);
        if (response.status === 200) {
          console.log(response);
          // Update the user's role in the local state
          setUsers((prevUsers) =>
            prevUsers.map((prevUser) =>
              prevUser._id === user._id
                ? { ...prevUser, roles: ['unallocated'] }
                : prevUser
            )
          );
        }
      } else {
        response = await createAdmin({ _id: user._id }, token);
        if (response.status === 200) {
          console.log(response);
          // Update the user's role in the local state
          setUsers((prevUsers) =>
            prevUsers.map((prevUser) =>
              prevUser._id === user._id
                ? { ...prevUser, roles: ['admin'] }
                : prevUser
            )
          );
        }
      }
    }
  };
  const expandUser = (user) => {
    if (expandedUsers.includes(user._id)) {
      setExpandedUsers((prevExpandedUsers) =>
        prevExpandedUsers.filter((userId) => userId !== user._id)
      );
    } else {
      setExpandedUsers((prevExpandedUsers) => [...prevExpandedUsers, user._id]);
    }
  };
  const isExpanded = (user) => expandedUsers.includes(user._id);
  return (
    <div>
      Hello SuperAdmin
      <h1>Admin Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user._id}</td>

              <td>{user.roles[0]}</td>
              <td>
                <button onClick={() => adminToggle(user)}>
                  {user.roles[0] === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button onClick={() => expandUser(user)}>
                  {isExpanded(user) ? 'Close This Admin' : 'Expand This Admin'}
                </button>
              </td>

              {/* <td>
                {isExpanded(user) && (
                  <tr key={`${user.id}-expanded`} className='expanded-row'>
                    <td colSpan='5'>
                      <div>
                        <table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>ID</th>
                              <th>Role</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users
                              .filter((user) => user.roles[0] === 'unallocated')
                              .map((user) => (
                                <tr key={user.id}>
                                  <td>{user.name}</td>
                                  <td>{user.email}</td>
                                  <td>{user._id}</td>
                                  <td>{user.roles[0]}</td>
                                  <button onClick={() => addUserToAdmin(user)}>
                                    {user.roles[0] === 'admin'
                                      ? 'Remove Admin'
                                      : 'Make Admin'}
                                  </button>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p id='myText'>{token}</p>
      </div>
    </div>
  );
};

export default SuperAdminScreen;
