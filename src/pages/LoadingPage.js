import React, { useEffect, useState } from 'react';
import LoadingAnimation from '../components/loadingAnimation';
import WindowBox from '../components/WindowBox';
import '../styles/loadingPage.css';

const LoadingPage = ({ onComplete }) => {
  const [isRendered, setIsRendered] = useState(false);
  
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

  return (
    <div className="loading-page">
      <div className="grid-overlay"></div>
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
    </div>
  );
};

export default LoadingPage;
