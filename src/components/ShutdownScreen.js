import React, { useEffect, useState } from 'react';
import '../styles/shutdownScreen.css';
// Import the same background images used in Desktop.js
import lightBackground from '../assets/images/windows.jpg'; // Light mode background
import darkBackground from '../assets/images/dark.jpg'; // Dark mode background

const ShutdownScreen = () => {
  const [progress, setProgress] = useState(0);
  // Check if dark mode is enabled
  const isDarkMode = document.body.classList.contains('dark-mode');

  useEffect(() => {
    console.log("ShutdownScreen mounted");
    
    // Simulate shutdown progress - complete in 3 seconds
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        // Increase by ~3.33% each time to reach 100% in 3 seconds
        // (100% / 3 seconds) / 10 intervals per second = 3.33% per interval
        const newProgress = prevProgress + 3.33;
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          
          // Refresh the page when progress reaches 100%
          console.log("Progress reached 100%, refreshing page");
          window.location.reload();
          
          return 100;
        }
        
        return newProgress;
      });
    }, 100); // 10 updates per second
    
    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  // Calculate the stroke-dashoffset based on progress
  // The formula is: total length - (progress percentage * total length / 100)
  const circumference = 2 * Math.PI * 54; // 2πr where r is (120px - 8px stroke width) / 2 = 56px
  const strokeDashoffset = circumference - (progress * circumference / 100);

  return (
    <div className="shutdown-screen" style={{
      backgroundImage: `url(${isDarkMode ? darkBackground : lightBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="shutdown-overlay">
        <div className="shutdown-content">
          <h1 className="shutdown-title">Shutting Down</h1>
          <div className="shutdown-progress-container">
            {/* Circular progress indicator */}
            <div className="circular-progress">
              <svg className="circular-progress-circle" viewBox="0 0 120 120">
                <circle 
                  className="circular-progress-background"
                  cx="60" 
                  cy="60" 
                  r="54"
                />
                <circle 
                  className="circular-progress-value"
                  cx="60" 
                  cy="60" 
                  r="54"
                  style={{ strokeDashoffset }}
                />
                {/* Add a rotating element for additional visual effect */}
                <g className="circular-progress-rotation">
                  <circle 
                    cx="60" 
                    cy="6" 
                    r="4" 
                    fill="#0078d7"
                  />
                </g>
              </svg>
              <div className="circular-progress-text">
                {Math.floor(progress)}%
              </div>
            </div>
            
            {/* Keep the old progress bar elements for backward compatibility, but they'll be hidden by CSS */}
            <div className="shutdown-progress-bar">
              <div 
                className="shutdown-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="shutdown-progress-text">
              {/* Empty now since percentage is shown in the circle */}
            </div>
          </div>
          <p className="shutdown-message">Please wait while the system shuts down...</p>
        </div>
      </div>
    </div>
  );
};

export default ShutdownScreen;
