import React from 'react';
import Hero from '../Hero';
import Header from '../Header';
import Section from '../Section';
import Testimonial from '../Testimonial';
import Footer from '../Footer';
import AboutUs from '../AboutUs.jsx';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
  palette: {
    background: {
      default: '#121318', // Black background
    },
    text: {
      primary: '#75777B', // White text color
    },
  },
});

const LandingPage = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Hero />
        <AboutUs />
        <Section />
        {/* <Testimonial /> */}
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default LandingPage;
