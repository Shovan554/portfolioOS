import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loadingAnimation.json";
import "../styles/loadingAnimation.css";

const LoadingAnimation = ({ onComplete }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // Add console logs for debugging
  console.log("LoadingAnimation rendering, isComplete:", isAnimationComplete);

  useEffect(() => {
    console.log("LoadingAnimation mounted");
    
    // Force animation to complete after 5 seconds
    const timer = setTimeout(() => {
      console.log("Forcing animation complete");
      setIsAnimationComplete(true);
      onComplete(); // Call onComplete directly
    }, 5000);
    
    const handleKeyPress = (event) => {
      console.log("Key pressed:", event.key);
      if (isAnimationComplete || event.key === "Enter") {
        console.log("Completing animation due to key press");
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(timer);
    };
  }, [isAnimationComplete, onComplete]);

  return (
    <div className="loading-animation-container">
      <h1 className="loading-title">Loading Portfolio</h1>
      <div className="animation">
        <Lottie 
          animationData={loadingAnimation} 
          loop={false}
          style={{ width: 600, height: 600 }}
          onComplete={() => {
            console.log("Lottie animation completed");
            setIsAnimationComplete(true);
            onComplete(); // Call onComplete directly
          }}
        />
      </div>
      {isAnimationComplete && (
        <div className="completion-message">
          <p>Loading complete. Press any key to continue.</p>
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;
