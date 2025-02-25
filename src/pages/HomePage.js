import React, { useEffect } from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/homePage.css';

const HomePage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("HomePage rendering, isOpen:", isOpen);
  
  useEffect(() => {
    console.log("HomePage mounted");
  }, []);

  return (
    <div className="home-page">
      <WindowBox 
        title="Home" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="home-content">
          <h1>Welcome</h1>
          <p>This is the home page content. If you can see this, the component is rendering correctly.</p>
        </div>
      </WindowBox>
    </div>
  );
};

export default HomePage;