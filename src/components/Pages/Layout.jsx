import React, { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NavigationBar from './Navbar'
import Sidebar from '../SideBar'
import Header from './Header'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const Layout = () => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
    <Container>
    <Row>
      {show ? (<><Col md lg="2"><Offcanvas bg="dark" data-bs-theme="dark"show={show} onHide={handleClose} backdrop="false" style={{ width: '23%' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          I will not close if you click outside of me.
        </Offcanvas.Body>
      </Offcanvas></Col>
        <Col><NavigationBar
        show = {show}
        handleShow={handleShow}
        /></Col></>) : <><Col><Offcanvas bg="dark" data-bs-theme="dark"show={show} onHide={handleClose} backdrop="false" style={{ width: '23%' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          I will not close if you click outside of me.
        </Offcanvas.Body>
      </Offcanvas><NavigationBar
        show = {show}
        handleShow={handleShow}
        /></Col></>}
      </Row>
        </Container>
        </>
  )
}

export default Layout
