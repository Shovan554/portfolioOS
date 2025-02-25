import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';

const EducationPage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("EducationPage rendering, isOpen:", isOpen);
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Education" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Education</h1>
          <p>This is the education page content. If you can see this, the component is rendering correctly.</p>
          {/* Add your education page content here */}
        </div>
      </WindowBox>
    </div>
  );
};

export default EducationPage;
