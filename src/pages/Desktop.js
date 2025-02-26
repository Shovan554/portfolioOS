import React, { useEffect, useState } from 'react';
import '../styles/desktop.css';
import lightBackground from '../assets/images/windows.jpg'; // Light mode background
import darkBackground from '../assets/images/dark.jpg'; // Dark mode background

const Desktop = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className="desktop" style={{
      backgroundImage: `url(${isDarkMode ? darkBackground : lightBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transition: 'background-image 0.5s ease' // Add transition for smooth background change
    }}>
      {/* Desktop content goes here */}
    </div>
  );
};

export default Desktop;
