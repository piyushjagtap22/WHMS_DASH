import React, { useState } from "react";

import "../css/theme.css";

function Button({children, onClick, variant }) {


    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
      if (onClick) {
        onClick();
      }

      clicked ? setClicked(false) : setClicked(true);
    };

    
    let buttonClass = 'button';
    let textClass = 'button-text';
  
    if (variant === 'primary') {
      buttonClass += ' button-primary';
      textClass += ' primary-text';
    } else if (variant === 'primary-outlined') {
      buttonClass += ' primary-outlined';
      textClass += ' primary-text';
    } else if (variant === 'secondary') {
      buttonClass += ' button-secondary';
      textClass += ' secondary-text';
    } else if (variant === 'secondary-outlined') {
      buttonClass += 'secondary-outlined';
      textClass += ' secondary-text';
    }
  
    if (clicked) {
      if (variant === 'primary' || variant === 'primary-outlined') {
        buttonClass += ' primary-active';
      } else if (variant === 'secondary' || variant === 'secondary-outlined') {
        buttonClass += ' secondary-active';
      }
    }
  
    return (
      <button onClick={handleClick} className={buttonClass}>
        <span className={textClass}>{children}</span>
      </button>
    );
}

export default Button;
