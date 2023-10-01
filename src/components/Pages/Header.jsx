import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [name, setName] = useState('');
  const logoutHandler = async () => {
    try {
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const ForgotPassword = async () => {
    try {
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
          toast.info('Password Reset Link sent on mail!');
        } else if (res.status === 409) {
          toast.error('Display user already Exists, please Sign in.');
        } else {
          toast.error('Unexpected Error, please Sign in again');
        }
      });
    } catch (err) {
      console.log(err);
      console.log(err.response.status);
      if (err.response.status === 409) {
        toast.error('Display user already Exists, please Sign in.');
      }
      console.log(err);
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.name) {
      setName(userInfo.name);
    } else {
      setName('');
    }
  }, [userInfo]);
  return (
    <header className='shadow-sm'>
      <Navbar bg='transparent' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/home'>
            <Navbar.Brand>Online Store</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {token ? (
                <>
                  <NavDropdown title={name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={ForgotPassword}>
                      Forgot Password
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
