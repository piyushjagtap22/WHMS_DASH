// PrivacyAndSecurityPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import CustomButton from '../Button';
import { Toaster, toast } from 'react-hot-toast';
function PrivacyAndSecurityPage() {
  useLayoutEffect(() => {
    toast.dismiss(); // Dismiss any previous toasts
  }, []);
  const navigate = useNavigate();
  const goToDash = () => {
    navigate('/dashboard');
  };

  // Inline styles
  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  };

  const contentStyle = {
    maxWidth: '600px',
    width: '100%',
  };

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <h2>Privacy and Security</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Cras vulputate, nulla eu tincidunt sagittis, urna urna
          lacinia eros, ac tempus tortor enim id elit. Vivamus non dui vel orci
          bibendum accumsan. Donec euismod sem nec quam efficitur, ac tristique
          odio fermentum. Suspendisse potenti.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit.
        </p>
        <CustomButton onClick={goToDash}>Back to Dashboard</CustomButton>
      </div>
    </div>
  );
}

export default PrivacyAndSecurityPage;
