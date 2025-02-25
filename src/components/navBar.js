
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/navBar.css';
// Import icons from correct path
import homeIcon from '../assets/icons/home.png';
import skillsIcon from '../assets/icons/skills.png';
import proficiencyIcon from '../assets/icons/proficiency.png';
import experienceIcon from '../assets/icons/experience.png';
import educationIcon from '../assets/icons/education.png';
import projectsIcon from '../assets/icons/projects.png';

const NavBar = ({ minimizedWindows, setMinimizedWindows, openWindows, handleOpenWindow, windowZIndex }) => {
  const location = useLocation();

  // Find the window with the highest z-index (the one on top)
  const getTopWindowPath = () => {
    let topPath = '';
    let highestZ = -1;
    
    Object.keys(windowZIndex).forEach(path => {
      if (openWindows[path] && !minimizedWindows[path] && windowZIndex[path] > highestZ) {
        highestZ = windowZIndex[path];
        topPath = path;
      }
    });
    
    return topPath;
  };
  
  const topWindowPath = getTopWindowPath();

  const navItems = [
    {
      name: 'Home',
      icon: homeIcon,
      path: '/'
    },
    {
      name: 'Skills',
      icon: skillsIcon,
      path: '/skills'
    },
    {
      name: 'Proficiency',
      icon: proficiencyIcon,
      path: '/proficiency'
    },
    {
      name: 'Experience',
      icon: experienceIcon,
      path: '/experience'
    },
    {
      name: 'Education',
      icon: educationIcon,
      path: '/education'
    },
    {
      name: 'Projects',
      icon: projectsIcon,
      path: '/projects'
    }
  ];

  const handleNavClick = (path) => {
    // If window is open but minimized, restore it
    if (openWindows[path] && minimizedWindows[path]) {
      setMinimizedWindows({...minimizedWindows, [path]: false});
    }
    // Otherwise use the handleOpenWindow function
    handleOpenWindow(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Home button positioned on the left */}
        <button
          key="Home"
          className={`nav-item home-button ${topWindowPath === '/' ? 'active' : ''} ${openWindows['/'] && minimizedWindows['/'] ? 'minimized' : ''}`}
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
            className={`nav-item ${topWindowPath === item.path ? 'active' : ''} ${openWindows[item.path] && minimizedWindows[item.path] ? 'minimized' : ''}`}
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
