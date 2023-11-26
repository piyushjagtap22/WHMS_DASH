import { Typography, Box, useTheme } from '@mui/material';
import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const AuthUser = useSelector((state) => state.auth.AuthUser);
  const MongoUser = useSelector((state) => state.auth.MongoUser);
  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Succesfully Signed Out');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (AuthUser && AuthUser.displayName) {
      setName(AuthUser.displayName);
    }
    console.log(MongoUser);
  }, [AuthUser, MongoUser]);
  return (
    <Box>
      <Typography
        variant='h2'
        color={theme.palette.secondary[100]}
        fontWeight='bold'
        sx={{ mb: '5px' }}
      >
        {title}
      </Typography>
      <Typography variant='h5' color={theme.palette.secondary[300]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
