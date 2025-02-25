import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loadingAnimation.json";
import "../styles/loadingAnimation.css";

const LoadingAnimation = ({ onComplete }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [waitingForKeyPress, setWaitingForKeyPress] = useState(false);
  
  // Add console logs for debugging
  console.log("LoadingAnimation rendering, isComplete:", isAnimationComplete, "waitingForKeyPress:", waitingForKeyPress);

  useEffect(() => {
    console.log("LoadingAnimation mounted");
    
    // Force animation to complete after 5 seconds
    const timer = setTimeout(() => {
      console.log("Forcing animation complete");
      setIsAnimationComplete(true);
      setWaitingForKeyPress(true);
    }, 5000);
    
    const handleKeyPress = (event) => {
      console.log("Key pressed:", event.key);
      if (waitingForKeyPress) {
        console.log("Completing loading due to key press");
        onComplete();
      }
    };

    const handleClick = () => {
      console.log("Mouse clicked");
      if (waitingForKeyPress) {
        console.log("Completing loading due to mouse click");
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
      clearTimeout(timer);
    };
  }, [waitingForKeyPress, onComplete]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    console.log("Lottie animation completed");
    setIsAnimationComplete(true);
    setWaitingForKeyPress(true);
  };

  return (
    <div className="loading-animation-container">
      <h1 className="loading-title">Loading Portfolio</h1>
      <div className="animation">
        <Lottie 
          animationData={loadingAnimation} 
          loop={false}
          style={{ width: 600, height: 600 }}
          onComplete={handleAnimationComplete}
        />
      </div>
      {isAnimationComplete && (
        <div className="completion-message">
          <p className="continue-text show">Press any key or click anywhere to continue</p>
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;
