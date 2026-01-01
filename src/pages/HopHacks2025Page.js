import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/hackathonsPage.css';

const HopHacks2025Page = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  return (
    <div className="page-container">
      <WindowBox 
        title="HopHacks 2025" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content hackathon-content">
          <div className="hackathon-header">
            <h1>HopHacks 2025</h1>
            <p className="hackathon-placement">🥈 Second Place</p>
          </div>
          
          <div className="hackathon-details">
            <h2>Project Overview</h2>
            <p className="hackathon-description">
              Built an EHR connecting doctors and patients with an AI-powered clinical assistant and continuous health monitoring.
            </p>
            
            <div className="hackathon-info">
              <h3>Tech Stack</h3>
              <p>Full-stack application with AI integration for healthcare monitoring</p>
            </div>
          </div>

          <div className="hackathon-links">
            <a 
              href="https://github.com/Shovan554/medlink" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </WindowBox>
    </div>
  );
};

export default HopHacks2025Page;
