// AuthValidations.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthValidations = () => {
  const navigate = useNavigate();
  console.log('In AuthValidations');
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  console.log(AuthUser);
  let page;
  if (!AuthUser) {
    console.log('Not Auth User');
    page = 'register';
    // navigate('/register');
    // If not logged in, you can redirect to the welcome page or login
  } else if (AuthUser && !AuthUser.email) {
    console.log('No email loop');
    console.log(AuthUser.email);
    page = 'emailregister';
  }
  console.log('after no email');

  return (
    <div>
      {page === 'register' && <Navigate to='/register' replace />}
      {page === 'emailregister' && <Navigate to='/emailregister' replace />}
      {page === 'superadmin' && <Navigate to='/superadmin' replace />}
      <Outlet />
    </div>
  );
};

export default AuthValidations;
