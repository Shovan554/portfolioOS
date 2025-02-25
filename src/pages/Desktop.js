import React from 'react';
import '../styles/desktop.css';
import backgroundImage from '../assets/images/windows.jpg'; // Import the background image

const Desktop = () => {
  return (
    <div className="desktop" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Desktop content goes here */}
    </div>
  );
};

export default Desktop;
