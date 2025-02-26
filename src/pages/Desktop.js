import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/desktop.css';
import lightBackground from '../assets/images/windows.jpg'; // Light mode background
import darkBackground from '../assets/images/dark.jpg'; // Dark mode background
import DesktopIcon from '../components/DesktopIcon'; // Import the DesktopIcon component

// Import icon for Flappy Dunk
import gameIcon from '../assets/icons/game.png'; // You may need to create/import this icon

const Desktop = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for dark mode and update state when it changes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark-mode');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Create a mutation observer to watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    // Start observing the body element
    observer.observe(document.body, { attributes: true });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  // Handle icon click to open the Flappy Dunk window
  const handleFlappyDunkClick = () => {
    console.log('Opening Flappy Dunk window');
    // This should connect to your window management system in App.js
    // For now, we'll assume there's a route or window handler for '/flappydunk'
    if (window.handleOpenWindow) {
      window.handleOpenWindow('/flappydunk');
    } else {
      // Fallback if the global handler isn't available
      navigate('/flappydunk');
    }
  };

  return (
    <div className="desktop" style={{
      backgroundImage: `url(${isDarkMode ? darkBackground : lightBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transition: 'background-image 0.5s ease' // Add transition for smooth background change
    }}>
      {/* Flappy Dunk Desktop Icon */}
      <DesktopIcon 
        icon={gameIcon} 
        title="Flappy Dunk" 
        onClick={handleFlappyDunkClick} 
        position={{ x: window.innerWidth - 100, y: 50 }}
      />
    </div>
  );
};

export default Desktop;
