import React, { useEffect, useState } from 'react';
import LoadingAnimation from '../components/loadingAnimation';
import WindowBox from '../components/WindowBox';
import '../styles/loadingPage.css';
import powerIcon from '../assets/icons/power.png'; // Import the power icon

const LoadingPage = ({ onComplete }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [showLoadingWindow, setShowLoadingWindow] = useState(false);
  
  // Add console log to debug
  console.log("LoadingPage rendering");
  
  // Force complete loading after timeout (fallback)
  useEffect(() => {
    console.log("LoadingPage mounted");
    setIsRendered(true);
    
    const timer = setTimeout(() => {
      console.log("Forcing loading complete after timeout");
      onComplete();
    }, 15000); // 15 seconds fallback
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handlePowerButtonClick = () => {
    console.log("Power button clicked");
    setShowLoadingWindow(true);
  };

  return (
    <div className="loading-page">
      {/* Removed the grid-overlay div */}
      
      {!showLoadingWindow ? (
        <div className="power-button-container">
          <div className="power-button-wrapper">
            <img 
              src={powerIcon} 
              alt="Power" 
              className="power-button"
              onClick={handlePowerButtonClick}
            />
            <p className="power-text">Press to power on</p>
          </div>
        </div>
      ) : (
        <WindowBox 
          title="Loading" 
          isOpen={true} 
          isLoading={true}
          width={800}
          height={600}
        >
          <div className="loading-content">
            <LoadingAnimation onComplete={onComplete} />
          </div>
        </WindowBox>
      )}
    </div>
  );
};

export default LoadingPage;
