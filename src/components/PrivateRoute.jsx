// PrivateRoute.jsx
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const PrivateRoute = () => {
  console.log('In private');
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  console.log(!AuthUser);
  if (!AuthUser) {
    // If not logged in, you can redirect to the welcome page or login
    // return <Navigate to='/register' replace />;
  }

  let role;
  // if (MongoUser && MongoUser.InitialUserSchema) {
  //   console.log(MongoUser);
  //   role = MongoUser.InitialUserSchema.roles[0];
  // } else {
  //   role = 'user';
  // }
  // role = 'superadmin';

  return (
    <div>
      {/* {role === 'testing' && <Navigate to='/imagetesting' replace />} */}
      {/* {role === 'admin' && <Navigate to='/admin' replace />}
      {role === 'superadmin' && <Navigate to='/superadmin' replace />}
      {role === 'superadmin2' && <Navigate to='/superadmin2' replace />}
      {role === 'user' && <Navigate to='/user' replace />}
      {role === 'unallocated' && <Navigate to='/newuser' replace />} */}
      {/* {role === 'superadmin' && <Navigate to='/superadmin' replace />} */}
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
