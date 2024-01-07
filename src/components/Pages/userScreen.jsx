import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../FormContainer';
import { SetUsers } from '../../slices/superAdminSlice';
import { getAllUsers } from '../../slices/superAdminApiSlice';

const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.superAdmin);
  const { AuthUser } = useSelector((state) => state.auth);
  console.log('userInfo' + userInfo);
  // console.log("AuthUser" + AuthUser.email);
  const submitHandler = async (e) => {
    // if (token) {
    //     try {
    //         const res = await getAllUsers(token).then((res) => {
    //             console.log(res);
    //             if (res.status === 200) {
    //                 console.log(res.data[0]);
    //                 res.forEach((data) => {
    //                     dispatch(SetUsers(userInfo,{ ...data }));
    //                   });
    //             } else {
    //                 console.log('Error fetching user');
    //                 console.log(res);
    //             }
    //         })
    //     } catch (err) {
    //         console.log(err);
    //         console.log(err?.data?.message || err.error);
    //         toast.error(err?.data?.message || err.error);
    //     }
    // }
  };
  const token = useSelector(
    (state) => state.auth.AuthUser.stsTokenManager.accessToken
  );
  console.log('Hello there');
  return (
    <div>
      Hello User:
      <p>{token}</p>
      <h1>User Management</h1>
      <table>
        {/* <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={submitHandler()}>
                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  );
};

export default UserScreen;
