// PrivateRoute.jsx
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const PrivateRoute = () => {
  const AuthUser = useSelector((state) => state.auth.AuthUser);

  if (!AuthUser) {
    // If not logged in, you can redirect to the welcome page or login
    return <Navigate to='/login' replace />;
  }

  const role = 'admin';

  return (
    <div>
      {role === 'admin' && <Navigate to='/admin' replace />}
      {role === 'superadmin' && <Navigate to='/superadmin' replace />}
      {role === 'user' && <Navigate to='/user' replace />}
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
