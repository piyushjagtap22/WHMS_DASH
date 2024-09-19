import React from 'react';
import Hero from '../Hero';
import Header from '../Header';
import Section from '../Section';
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
        <style jsx="true">{`
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden; /* Prevent scrolling on the body */
          }
          .snap-container {
            scroll-snap-type: y mandatory;
            overflow-y: scroll;
            max-height: 80vh; /* Ensure the snap container takes up full screen */
            scrollbar-width: none; /* For Firefox, hide scrollbar */
            -ms-overflow-style: none; /* For IE and Edge, hide scrollbar */
          }
          .snap-container::-webkit-scrollbar {
            display: none; /* For Chrome, Safari, and Opera, hide scrollbar */
          }
          .snap-section {
            scroll-snap-align: start;
            min-height: 80vh; /* Each section takes full screen */
          }
          header {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
          }
        `}</style>

        {/* Scroll Snap Sections */}
        <div className="snap-container">
          <div className="snap-section">
            <Hero />
          </div>
          <div className="snap-section">
            <AboutUs />
          </div>
          <div className="snap-section">
            <Section />

          </div>
          
        </div>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default LandingPage;
