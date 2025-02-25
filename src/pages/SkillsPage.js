import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';

const SkillsPage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("SkillsPage rendering, isOpen:", isOpen);
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Skills & Interests" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Skills & Interests</h1>
          <p>This is the skills page content. If you can see this, the component is rendering correctly.</p>
          {/* Add your skills page content here */}
        </div>
      </WindowBox>
    </div>
  );
};

export default SkillsPage;

