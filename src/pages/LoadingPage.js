import React, { useEffect } from 'react';
import LoadingAnimation from '../components/loadingAnimation';
import WindowBox from '../components/WindowBox';
import '../styles/loadingPage.css';

const LoadingPage = ({ onComplete }) => {
  // Add console log to debug
  console.log("LoadingPage rendering");
  
  // Force complete loading after timeout (fallback)
  useEffect(() => {
    console.log("LoadingPage mounted");
    const timer = setTimeout(() => {
      console.log("Forcing loading complete after timeout");
      onComplete();
    }, 10000); // 10 seconds fallback
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-page">
      <div className="grid-overlay"></div>
      <WindowBox title="Loading" isLoading={true}>
        <div className="loading-content">
          <LoadingAnimation onComplete={onComplete} />
          <p>Loading... Please wait</p>
        </div>
      </WindowBox>
    </div>
  );
};

export default LoadingPage;
