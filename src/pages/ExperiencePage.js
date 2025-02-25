import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';

const ExperiencePage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("ExperiencePage rendering, isOpen:", isOpen);
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Experience" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Experience</h1>
          <p>This is the experience page content. If you can see this, the component is rendering correctly.</p>
          {/* Add your experience page content here */}
        </div>
      </WindowBox>
    </div>
  );
};

export default ExperiencePage;
