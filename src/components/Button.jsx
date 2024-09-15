import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const CustomButton = ({
  variant = 'contained',
  color = '#7CD6AB',
  borderRadius = '8px',
  width = 'auto',
  children,
  style,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyle = {
      padding: '0.5rem 2rem',
      fontWeight: 'bold',
      textTransform: 'none',
      fontSize: '0.8rem',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      borderRadius: borderRadius,
      width: width,
      cursor: 'pointer',
      outline: 'none',
      disabled: 'true',
    };

    if (variant === 'contained') {
      return {
        ...baseStyle,
        backgroundColor: color,
        color: '#121318',
        border: `1px solid ${color}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          backgroundColor: '#f3f2f1',
        },
        '&:focus': {
          backgroundColor: '#f3f2f1',
        },
        '&:active': {
          backgroundColor: '#f3f2f1',
        },
      };
    } else if (variant === 'outlined') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: color,
        border: `1px solid ${color}`,
        '&:hover': {
          backgroundColor: '#f3f2f1',
        },
        '&:focus': {
          backgroundColor: '#f3f2f1',
        },
        '&:active': {
          backgroundColor: '#f3f2f1',
        },
      };
    } else if (variant === 'text') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: color,
        border: 'none',
        '&:hover': {
          backgroundColor: '#f3f2f1',
        },
        '&:focus': {
          backgroundColor: '#f3f2f1',
        },
        '&:active': {
          backgroundColor: '#f3f2f1',
        },
      };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <Button style={{ ...buttonStyles, ...style }} {...props}>
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.string,
  borderRadius: PropTypes.string,
  width: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default CustomButton;
