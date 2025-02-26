import React, { useState, useEffect, useRef } from "react";
import homeIcon from "../assets/icons/home.png"; // Import the home icon
import startupSound from "../assets/sounds/startup.mp3"; // Import the startup sound
import "../styles/loadingAnimation.css";

const LoadingAnimation = ({ onComplete }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [waitingForKeyPress, setWaitingForKeyPress] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state for loading bar
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const hasCompletedRef = useRef(false);
  
  // Add console logs for debugging
  console.log("LoadingAnimation rendering, isComplete:", isAnimationComplete, "waitingForKeyPress:", waitingForKeyPress);

  useEffect(() => {
    console.log("LoadingAnimation mounted");
    
    // Create audio element only once when component mounts
    audioRef.current = new Audio(startupSound);
    
    // Set up audio ended event handler
    audioRef.current.onended = () => {
      console.log("Audio playback ended");
      isPlayingRef.current = false;
    };
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (Math.random() * 10);
        if (newProgress >= 100) {
          // When progress reaches 100%, mark animation as complete
          setIsAnimationComplete(true);
          setWaitingForKeyPress(true);
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    // Force animation to complete after 5 seconds (as a fallback)
    const timer = setTimeout(() => {
      console.log("Forcing animation complete");
      setProgress(100);
      setIsAnimationComplete(true);
      setWaitingForKeyPress(true);
      clearInterval(progressInterval);
    }, 5000);
    
    const handleKeyPress = (event) => {
      console.log("Key pressed:", event.key);
      if (waitingForKeyPress && !hasCompletedRef.current) {
        console.log("Completing loading due to key press");
        hasCompletedRef.current = true;
        playStartupSound();
      }
    };

    const handleClick = () => {
      console.log("Mouse clicked");
      if (waitingForKeyPress && !hasCompletedRef.current) {
        console.log("Completing loading due to mouse click");
        hasCompletedRef.current = true;
        playStartupSound();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
      clearTimeout(timer);
      clearInterval(progressInterval);
      
      // Clean up audio - don't try to pause if it's playing
      if (audioRef.current) {
        // Remove event listeners
        audioRef.current.onended = null;
        
        // Only pause if not currently playing to avoid AbortError
        if (!isPlayingRef.current) {
          try {
            audioRef.current.pause();
          } catch (e) {
            console.log("Error pausing audio:", e);
          }
        }
      }
    };
  }, [waitingForKeyPress, onComplete]);

  // Function to play the startup sound
  const playStartupSound = () => {
    if (!audioRef.current || isPlayingRef.current) return;
    
    try {
      console.log("Attempting to play startup sound");
      isPlayingRef.current = true;
      
      // Reset the audio to the beginning
      audioRef.current.currentTime = 0;
      
      // Play the startup sound
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
            // Call onComplete after a short delay to ensure sound starts playing
            setTimeout(() => {
              if (!hasCompletedRef.current) return;
              onComplete();
            }, 300);
          })
          .catch(error => {
            console.error("Error playing startup sound:", error);
            isPlayingRef.current = false;
            // If audio fails, still complete the loading
            onComplete();
          });
      }
    } catch (error) {
      console.error("Error with audio playback:", error);
      isPlayingRef.current = false;
      // If audio fails, still complete the loading
      onComplete();
    }
  };

  return (
    <div className="loading-animation-container">
      <div className="loading-header">
        <img src={homeIcon} alt="Portfolio OS" className="loading-icon" />
        <h1 className="loading-title">Portfolio OS</h1>
      </div>
      
      <div className="loading-progress-container">
        <div className="loading-progress-bar">
          <div 
            className="loading-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="loading-progress-text">
          {Math.floor(progress)}% Complete
        </div>
      </div>
      
      <div className={`completion-message ${isAnimationComplete ? 'show' : ''}`}>
        <p className={`continue-text ${isAnimationComplete ? 'show' : ''}`}>
          Press any key or click anywhere to continue
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
