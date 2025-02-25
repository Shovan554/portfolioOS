
import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';

const ProjectsPage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("ProjectsPage rendering, isOpen:", isOpen);
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Projects" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Projects</h1>
          <p>This is the projects page content. If you can see this, the component is rendering correctly.</p>
          {/* Add your projects page content here */}
        </div>
      </WindowBox>
    </div>
  );
};

export default ProjectsPage;

