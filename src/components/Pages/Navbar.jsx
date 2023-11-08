import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "../FlexBetween";
import {
    AppBar,
    Button,
    Box,
    Typography,
    IconButton,
    InputBase,
    Toolbar,
    Menu,
    MenuItem,
    useTheme,
  } from "@mui/material";
import { setMode } from "../../slices/modeSlice";
import Badge from 'react-bootstrap/Badge';

const NavigationBar = ({ show, handleShow }) => {
    const dispatch = useDispatch();
  const theme = useTheme();
  const mode = useSelector((state) => state.mode.mode);
  console.log("nav" + mode);

  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Button variant="primary" onClick={handleShow}>
        {!show && <Badge bg="secondary"><MenuIcon/></Badge>}  
        
        
      </Button>
          <Nav className="me-auto">
          <Breadcrumb>
      <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
        Default
      </Breadcrumb.Item>
    </Breadcrumb>
            
          </Nav>
          <Nav>
          <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
  </>
  )
}

export default NavigationBar
