import React, { useEffect, useState, useRef } from 'react';
import '../styles/shutdownScreen.css';
// Import the same background images used in Desktop.js
import lightBackground from '../assets/images/windows.jpg'; // Light mode background
import darkBackground from '../assets/images/dark.jpg'; // Dark mode background
import shutdownSound from '../assets/sounds/shutdown.mp3'; // Import shutdown sound

const ShutdownScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  // Check if dark mode is enabled
  const isDarkMode = document.body.classList.contains('dark-mode');
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const soundCompletedRef = useRef(false);
  const progressCompleteRef = useRef(false);
  const shutdownTimerRef = useRef(null);

  // Function to play the shutdown sound with better error handling
  const playShutdownSound = () => {
    if (hasPlayedRef.current) return; // Prevent multiple play attempts
    
    try {
      console.log("Attempting to play shutdown sound");
      
      // Create a new Audio element each time to avoid issues with reusing
      const audio = new Audio(shutdownSound);
      audioRef.current = audio;
      
      // Set volume and other properties
      audio.volume = 0.7;
      
      // Add an event listener for when the sound finishes playing
      audio.addEventListener('ended', () => {
        console.log("Shutdown sound finished playing completely");
        soundCompletedRef.current = true;
        
        // If progress is already at 100%, complete the shutdown
        if (progressCompleteRef.current) {
          completeShutdown();
        }
      });
      
      // Play with promise handling
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        hasPlayedRef.current = true;
        
        playPromise
          .then(() => {
            console.log("Shutdown sound playing successfully");
            
            // Set a fallback timer for 5 seconds in case the 'ended' event doesn't fire
            shutdownTimerRef.current = setTimeout(() => {
              console.log("Fallback timer triggered - completing shutdown");
              soundCompletedRef.current = true;
              if (progressCompleteRef.current) {
                completeShutdown();
              }
            }, 5000); // 5 seconds to ensure full 4-second sound has a chance to play
          })
          .catch(error => {
            console.error("Error playing shutdown sound:", error);
            // Reset flag to allow retry
            hasPlayedRef.current = false;
            // Mark as completed anyway to not block shutdown
            soundCompletedRef.current = true;
          });
      }
    } catch (error) {
      console.error("Error with audio setup:", error);
      hasPlayedRef.current = false;
      // Mark as completed anyway to not block shutdown
      soundCompletedRef.current = true;
    }
  };

  // Function to complete the shutdown process
  const completeShutdown = () => {
    // Clear any pending timers
    if (shutdownTimerRef.current) {
      clearTimeout(shutdownTimerRef.current);
    }
    
    if (onComplete) {
      console.log("Calling onComplete callback");
      onComplete();
    } else {
      console.log("Refreshing page");
      window.location.reload();
    }
  };

  useEffect(() => {
    console.log("ShutdownScreen mounted");
    
    // Try to play the sound immediately
    playShutdownSound();
    
    // Also try again after a short delay (sometimes helps with browser restrictions)
    const soundTimer = setTimeout(() => {
      if (!hasPlayedRef.current) {
        console.log("Retrying sound playback after delay");
        playShutdownSound();
      }
    }, 500);
    
    // Simulate shutdown progress - complete in 4 seconds to match sound duration
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        // Increase by 2.5% each time to reach 100% in 4 seconds
        // (100% / 4 seconds) / 10 intervals per second = 2.5% per interval
        const newProgress = prevProgress + 2.5;
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          progressCompleteRef.current = true;
          
          // Only complete shutdown if sound has finished
          if (soundCompletedRef.current) {
            completeShutdown();
          } else {
            console.log("Progress complete, waiting for sound to finish");
          }
          
          return 100;
        }
        
        return newProgress;
      });
    }, 100); // 10 updates per second
    
    // Absolute fallback timer - 10 seconds max for the entire shutdown process
    const absoluteFallbackTimer = setTimeout(() => {
      console.log("Absolute fallback timer triggered - forcing shutdown");
      completeShutdown();
    }, 10000);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(soundTimer);
      clearTimeout(absoluteFallbackTimer);
      if (shutdownTimerRef.current) {
        clearTimeout(shutdownTimerRef.current);
      }
      
      // Clean up audio
      if (audioRef.current) {
        try {
          // Remove event listeners
          audioRef.current.onended = null;
          audioRef.current.pause();
          audioRef.current = null;
        } catch (e) {
          console.error("Error cleaning up audio:", e);
        }
      }
    };
  }, [onComplete]);

  // Calculate the stroke-dashoffset based on progress
  // The formula is: total length - (progress percentage * total length / 100)
  const circumference = 2 * Math.PI * 54; // 2πr where r is (120px - 8px stroke width) / 2 = 56px
  const strokeDashoffset = circumference - (progress * circumference / 100);

  return (
    <div 
      className="shutdown-screen" 
      style={{
        backgroundImage: `url(${isDarkMode ? darkBackground : lightBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      // Add a click handler as a backup to trigger sound (helps with some browsers)
      onClick={() => {
        if (!hasPlayedRef.current) {
          playShutdownSound();
        }
      }}
    >
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
