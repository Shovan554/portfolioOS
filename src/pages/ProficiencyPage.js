import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';

const ProficiencyPage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("ProficiencyPage rendering, isOpen:", isOpen);
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Proficiency" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Proficiency</h1>
          <p>This is the proficiency page content. If you can see this, the component is rendering correctly.</p>
          {/* Add your proficiency page content here */}
        </div>
      </WindowBox>
    </div>
  );
};

export default ProficiencyPage;
