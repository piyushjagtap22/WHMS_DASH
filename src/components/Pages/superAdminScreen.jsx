import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAdmin,
  getAllUsers,
  removeAdmin,
} from './../../slices/superAdminApiSlice';
import {
  getUnallocatedUsers,
  AddUsersToAdmin,
  getAdminUsers,
  RemoveUsersFromAdmin,
} from '../../slices/adminApiSlice';
const SuperAdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState([]);
  const [currentlyExpandedUser, setCurrentlyExpandedUser] = useState(null);
  const dispatch = useDispatch();
  const [adminInfo, setAdminInfo] = useState();
  const token = useSelector(
    (state) => state.auth.AuthUser.stsTokenManager.accessToken
  );
  const { userInfo } = useSelector((state) => state.superAdmin);
  const [adminUsers, setAdminUsers] = useState([]); // State to store admin users
  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getAllUsers(token);
        console.log(response);
        if (response.status === 200) {
          setUsers(response.data);
          setAdmins(
            response.data.filter((user) => user.roles.includes('admin'))
          );
          console.log(response.data);
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
          setAdmins((prevUsers) =>
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
          setAdmins((prevUsers) =>
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

  const fetchAdminUsers = async (admin) => {
    console.log(admin);
  };

  const expandUser = (user) => {
    fetchAdminUsers(user);
    setAdminInfo('True');
    //if (expandedUsers.includes(user._id)) {
    if (currentlyExpandedUser === user._id) {
      setCurrentlyExpandedUser(null);
      setExpandedUsers((prevExpandedUsers) =>
        prevExpandedUsers.filter((userId) => userId !== user._id)
      );
    } else {
      setCurrentlyExpandedUser(user._id);
      setExpandedUsers((prevExpandedUsers) => [...prevExpandedUsers, user._id]);
    }
  };

  const addUserToAdmin = async (userId, adminId) => {
    console.log('mapped');
    try {
      console.log('in fetchdata');
      const data = {
        adminId: adminId,
        userIds: [userId],
      };
      console.log(data);
      const response = await AddUsersToAdmin(data, token);
      console.log(response);
      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        // setAdminUsers((prevUsers) => [
        //   ...prevUsers,
        //   users.find((user) => user._id === userId),
        // ]);
        // setUsers((prevUsers) => prevUsers.filter((user) => user._id !== _id));
      } else {
        // Handle any errors or show a message
      }
    } catch (error) {
      // Handle any network or API request errors
    }
  };

  //const isExpanded = (user) => expandedUsers.includes(user._id);
  const isExpanded = (user) => user._id === currentlyExpandedUser;
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
          {admins.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>a
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

              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {users.map((user) => (
          <div key={`${user.id}-expanded`} className='expanded-row'>
            {isExpanded(user) && (
              <div>
                <p>Admin Details:</p>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>ID: {user._id}</p>
                <p>Role: {user.roles[0]}</p>
                <h2>Admin Users</h2>
                <div>
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
                <table>
                  <thead>
                    <h2>Unallocated Users</h2>
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
                      .filter(
                        (unallocatedUser) =>
                          unallocatedUser.roles[0] === 'unallocated'
                      )
                      .map((unallocatedUser) => (
                        <tr key={unallocatedUser.id}>
                          <td>{unallocatedUser.name}</td>
                          <td>{unallocatedUser.email}</td>
                          <td>{unallocatedUser._id}</td>
                          <td>{unallocatedUser.roles[0]}</td>
                          <td>
                            <button
                              onClick={() =>
                                addUserToAdmin(unallocatedUser._id, user._id)
                              }
                            >
                              Add User to This Admin
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <p id='myText'>{token}</p>
      </div>
    </div>
  );
};

export default SuperAdminScreen;
