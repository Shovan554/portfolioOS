import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/desktop.css';
import lightBackground from '../assets/images/windows.jpg'; // Light mode background
import darkBackground from '../assets/images/dark.jpg'; // Dark mode background
import DesktopIcon from '../components/DesktopIcon'; // Import the DesktopIcon component

// Import icons
import gameIcon from '../assets/icons/game.png'; // Flappy Dunk icon
import terminalIcon from '../assets/icons/terminal.png'; // Terminal icon

const Desktop = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [flappyIconPosition, setFlappyIconPosition] = useState({ x: 0, y: 0 });
  const [terminalIconPosition, setTerminalIconPosition] = useState({ x: 0, y: 0 });
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

  // Calculate and update icon positions based on window dimensions
  useEffect(() => {
    const updateIconPositions = () => {
      // Position the Flappy Dunk icon in the top right corner with some padding
      const flappyX = Math.max(window.innerWidth - 100, 20); // At least 20px from left
      const flappyY = 50; // 50px from top
      setFlappyIconPosition({ x: flappyX, y: flappyY });
      
      // Position the Terminal icon below the Flappy Dunk icon
      const terminalX = flappyX; // Same X position as Flappy Dunk
      const terminalY = flappyY + 120; // 120px below Flappy Dunk (accounting for icon height)
      setTerminalIconPosition({ x: terminalX, y: terminalY });
    };

    // Set initial positions
    updateIconPositions();

    // Update positions when window is resized
    window.addEventListener('resize', updateIconPositions);

    // Cleanup
    return () => window.removeEventListener('resize', updateIconPositions);
  }, []);

  // Handle icon click to open the Flappy Dunk window
  const handleFlappyDunkClick = () => {
    console.log('Opening Flappy Dunk window');
    // This should connect to your window management system in App.js
    if (window.handleOpenWindow) {
      window.handleOpenWindow('/flappydunk');
    } else {
      // Fallback if the global handler isn't available
      navigate('/flappydunk');
    }
  };

  // Handle icon click to open the Terminal window
  const handleTerminalClick = () => {
    console.log('Opening Terminal window');
    // This should connect to your window management system in App.js
    if (window.handleOpenWindow) {
      window.handleOpenWindow('/terminal');
    } else {
      // Fallback if the global handler isn't available
      navigate('/terminal');
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
        position={flappyIconPosition}
      />
      
      {/* Terminal Desktop Icon */}
      <DesktopIcon 
        icon={terminalIcon} 
        title="Terminal" 
        onClick={handleTerminalClick} 
        position={terminalIconPosition}
      />
    </div>
  );
};

export default Desktop;
