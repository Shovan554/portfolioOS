
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/navBar.css';
// Import icons from correct path
import homeIcon from '../assets/icons/home.png';
import skillsIcon from '../assets/icons/skills.png';
import proficiencyIcon from '../assets/icons/proficiency.png';
import experienceIcon from '../assets/icons/experience.png';
import educationIcon from '../assets/icons/education.png';

const NavBar = ({ minimizedWindows, setMinimizedWindows, openWindows, handleOpenWindow, windowZIndex }) => {
  const location = useLocation();

  // Find the window with the highest z-index (the one on top)
  const getTopWindowPath = () => {
    let topPath = '';
    let highestZ = -1;
    
    // Check if windowZIndex is defined before using Object.keys
    if (windowZIndex && typeof windowZIndex === 'object') {
      Object.keys(windowZIndex).forEach(path => {
        if (openWindows && openWindows[path] && 
            minimizedWindows && !minimizedWindows[path] && 
            windowZIndex[path] > highestZ) {
          highestZ = windowZIndex[path];
          topPath = path;
        }
      });
    }
    
    return topPath;
  };
  
  const topWindowPath = getTopWindowPath();

  // Add null checks for all props
  const handleNavClick = (path) => {
    // If window is open but minimized, restore it
    if (openWindows && minimizedWindows && openWindows[path] && minimizedWindows[path]) {
      setMinimizedWindows({...minimizedWindows, [path]: false});
    }
    // Otherwise use the handleOpenWindow function
    if (handleOpenWindow) {
      handleOpenWindow(path);
    }
  };

  // Define navItems with proper null checks
  const navItems = [
    { name: 'Home', path: '/', icon: homeIcon },
    { name: 'Skills', path: '/skills', icon: skillsIcon },
    { name: 'Proficiency', path: '/proficiency', icon: proficiencyIcon },
    { name: 'Experience', path: '/experience', icon: experienceIcon },
    { name: 'Education', path: '/education', icon: educationIcon }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Home button positioned on the left */}
        <button
          key="Home"
          className={`nav-item home-button ${topWindowPath === '/' ? 'active' : ''} ${openWindows && minimizedWindows && openWindows['/'] && minimizedWindows['/'] ? 'minimized' : ''}`}
          onClick={() => handleNavClick('/')}
        >
          <img 
            src={homeIcon} 
            alt="Home" 
            className="nav-icon"
          />
          <span className="nav-text">Home</span>
        </button>
        
        {/* Other nav items */}
        {navItems.slice(1).map((item) => (
          <button
            key={item.name}
            className={`nav-item ${topWindowPath === item.path ? 'active' : ''} ${openWindows && minimizedWindows && openWindows[item.path] && minimizedWindows[item.path] ? 'minimized' : ''}`}
            onClick={() => handleNavClick(item.path)}
          >
            <img 
              src={item.icon} 
              alt={item.name} 
              className="nav-icon"
            />
            <span className="nav-text">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
