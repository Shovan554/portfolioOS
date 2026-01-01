import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/hackathonsPage.css';

const CougarHacks2025Page = ({ 
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
        title="CougarHacks 2025" 
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
            <h1>CougarHacks 2025</h1>
            <p className="hackathon-placement">🥇 First Place</p>
          </div>
          
          <div className="hackathon-details">
            <h2>Project Overview</h2>
            <p className="hackathon-description">
              Built AI-powered Apple Watch companion for health monitoring and personalized insights.
            </p>
            
            <div className="hackathon-info">
              <h3>Tech Stack</h3>
              <p>Apple Watch WatchOS app with AI-driven health insights</p>
            </div>
          </div>

          <div className="hackathon-links">
            <a 
              href="https://github.com/Shovan554/PulseX-AI" 
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

export default CougarHacks2025Page;
