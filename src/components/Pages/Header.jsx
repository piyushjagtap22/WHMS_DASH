import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const Header = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Succesfully Signed Out');
        navigate('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (AuthUser && AuthUser.displayName) {
      setName(AuthUser.displayName);
    }
  }, [AuthUser]);

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
              {AuthUser ? (
                <>
                  <NavDropdown title={name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={userSignOut}>
                      Sign Out
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
