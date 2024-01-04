import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  createAdmin,
  getAllUsers,
  removeAdmin,
  enableAdmin,
  getAllAdmin,
  disableAdmin,
  docById
} from './../../slices/superAdminApiSlice';
import {
  getUnallocatedUsers,
  AddUsersToAdmin,
  getAdminUsers,
  RemoveUsersFromAdmin,
} from '../../slices/adminApiSlice';

const style = {
  position: "absolute",
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,

  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const SuperAdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState([]);
  const [currentlyExpandedUser, setCurrentlyExpandedUser] = useState(null);
  const dispatch = useDispatch();
  const [adminInfo, setAdminInfo] = useState();
  // const token = useSelector(
  //   (state) => state.auth.AuthUser.stsTokenManager.accessToken
  // );
  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUyNmM2YTg0YWMwNjcwMDVjZTM0Y2VmZjliM2EyZTA4ZTBkZDliY2MiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUGl5dXNoIEphZ3RhcCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJNGdWaVdFRkdHa2Jrbm1YdDlkcGlrck1CeDhVRmc4WWQzTjY5NFdSNWs9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd2htcy1hdXRoLTdlZDRiIiwiYXVkIjoid2htcy1hdXRoLTdlZDRiIiwiYXV0aF90aW1lIjoxNzA0Mzc0MTE3LCJ1c2VyX2lkIjoibjlSeXdTV05nU1hQVHdPcWhhTUFvbUk5SVlpMSIsInN1YiI6Im45Unl3U1dOZ1NYUFR3T3FoYU1Bb21JOUlZaTEiLCJpYXQiOjE3MDQzNzQxMTcsImV4cCI6MTcwNDM3NzcxNywiZW1haWwiOiJwanRlbXBpZEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwMjQ4MDA4NjE0NzE3MDU0MjUxMCJdLCJlbWFpbCI6WyJwanRlbXBpZEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.QQiaX7nGy9DFbhtavRAFCxfSsScpuAqpeTHZg9YSDj92ndsj4oadqgEIKtGTIAxCHOWCUSVkfX9wlwVcSn-fGEclfu0yQTFMtIhzIIG-tLLKrZ_rl4au-xpFGBfXiauPejefhdNGiFDOOMlDslc5sWe5BZqTLmJIad-qUrsBDboNCNiom7aL90YPb9XNJDMnSUKktbYDhZ8lISOvCzQtZRAdm4PFxslmD1gr3WG7_OYZSuF_GnbhuqmOpTtoKJ5BTDK8qynXSLZqS9qLP93q5ASraE09kEyBUNtMSiGpSsbFKoobwZxEFuMrCrXzS9ZwBr8owM0lQnYoBzVPnyXWMQ"
  const { userInfo } = useSelector((state) => state.superAdmin);
  const [adminUsers, setAdminUsers] = useState([]); // State to store admin users
  const [button,setButton] = useState('false');
  const [open, setOpen] = React.useState(false);


  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        console.log('in fetchdata');
        const response = await getAllAdmin(token);
        console.log("users data ashi",response.data.admins);
        if (response.status === 200) {
          setUsers(response.data.admins);

        } else {
          // Handle any errors or show a message
        }
      } catch (error) {
        // Handle any network or API request errors
      }
    };
    fetchData();
  }, [dispatch, token ,button]);

  const handleOpen = async (userId) => {
    setOpen(true);
    const doc = await documentByID(userId);
    console.log("handle open doc",doc);

  }
  const handleClose = () => setOpen(false);

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

  const enableAdminByID = async  (userId) => {
    // Perform your query or action using the retrieved data
    console.log(`Clicked user ID: ${userId}`);
    console.log('enable Admin');
    try {
      const response = await enableAdmin({ adminId: `${userId}`}, token);
      console.log(response);
      if (response.status === 200) {
        console.log(response); // Assuming the user data is in the response data
        setButton(!button);
      } else {
        // Handle any errors or show a message
      }
  } catch(error) {
    console.log(error);
  }
}



const disableAdminByID = async  (userId) => {
  // Perform your query or action using the retrieved data
  console.log(`Clicked user ID: ${userId}`);
  console.log('enable Admin');
  try {
    const response = await disableAdmin({ adminId: `${userId}`}, token);
    console.log(response);
    if (response.status === 200) {
      console.log(response); // Assuming the user data is in the response data
      setButton(!button);
    } else {
      // Handle any errors or show a message
    }
} catch(error) {
  console.log(error);
}
}

const documentByID = async (userId) => {
  alert(`clicked by ${userId}`)
  console.log('enable Admin');
  try {
    const response = await docById({ "_id": `${userId}`}, token);
    console.log("image response",response);
    if (response.status === 200) {
      console.log(response); // Assuming the user data is in the response data
      setButton(!button);
    } else {
      // Handle any errors or show a message
    }
} catch(error) {
  console.log(error);
}
  


//   try {
//     const response = await enableAdmin({ adminId: `${userId}`}, token);
//     console.log(response);
//     if (response.status === 200) {
//       console.log(response); // Assuming the user data is in the response data
//       setButton(!button);
//     } else {
//       // Handle any errors or show a message
//     }
// } catch(error) {
//   console.log(error);
// }
}

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
          {/* {users} */}
        {/* unallocated */}
        {/* {users.map((user) => (
          <tr key={user.id} >
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

              <button onClick={() => enableAdminByID(user._id)}>
                {user.roles[0] === 'admin' ? 'Remove Admin' : 'Make Admin'}ENABLE
              </button>
            </td>
            <td></td>
          </tr>
        ))} */}
         
          {users.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin._id}</td>
              <td>{admin?.adminDetails[0]?.accountEnabled ? 'True' : 'False'}</td> 
             {
                admin?.adminDetails[0]?.accountEnabled 
              ?
                <button onClick={() => disableAdminByID(admin._id)}>
                  Disable Admin
                </button>
              :
                <button onClick={() => enableAdminByID(admin._id)}>
                  Enable Admin
                </button>
              }

              {
                !(admin?.doc_verified)
              ?
              <>
              <button onClick={() => handleOpen(admin._id)}>
                See documents
              </button>
 
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    List of Documents
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                  </Typography>
                </Box>
              </Modal>
              </>
              
              :
              <span></span>
              }
            </tr>
          ))}

        </tbody>
      </table>
      <div>
        {/* {users.map((user) => (
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
        ))} */}
      </div>
      <div>
        {/* <p id='myText'>{token}</p> */}
      </div>
    </div>
  );
};

export default SuperAdminScreen;
