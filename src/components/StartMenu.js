import React from 'react';
import '../styles/startMenu.css';
import profileImage from '../assets/images/pp.PNG';

// Import icons for the start menu
import homeIcon from '../assets/icons/home.png';
import skillsIcon from '../assets/icons/skills.png';
import proficiencyIcon from '../assets/icons/proficiency.png';
import experienceIcon from '../assets/icons/experience.png';
import educationIcon from '../assets/icons/education.png';
import projectsIcon from '../assets/icons/projects.png';
import gameIcon from '../assets/icons/game.png';
import terminalIcon from '../assets/icons/terminal.png';

const StartMenu = ({ isOpen, onClose, handleOpenWindow }) => {
  if (!isOpen) return null;

  const menuItems = [
    { name: 'Home', path: '/', icon: homeIcon },
    { name: 'Skills', path: '/skills', icon: skillsIcon },
    { name: 'Proficiency', path: '/proficiency', icon: proficiencyIcon },
    { name: 'Experience', path: '/experience', icon: experienceIcon },
    { name: 'Education', path: '/education', icon: educationIcon },
    { name: 'Projects', path: '/projects', icon: projectsIcon },
    { name: 'Flappy Dunk', path: '/flappydunk', icon: gameIcon },
    { name: 'Terminal', path: '/terminal', icon: terminalIcon }
  ];

  const handleItemClick = (path) => {
    handleOpenWindow(path);
    onClose(); // Close the start menu after selection
  };

  // Close the start menu when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('start-menu-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="start-menu-backdrop" onClick={handleBackdropClick}>
      <div className="start-menu">
        <div className="start-menu-header">
          <div className="start-menu-profile">
            <img src={profileImage} alt="Shovan Raut" className="start-menu-avatar" />
            <div className="start-menu-user-info">
              <h3>Shovan Raut</h3>
              <p>Tech Enthusiast</p>
            </div>
          </div>
        </div>
        
        <div className="start-menu-content">
          <div className="start-menu-left">
            {menuItems.map((item) => (
              <div 
                key={item.name} 
                className="start-menu-item"
                onClick={() => handleItemClick(item.path)}
              >
                <img src={item.icon} alt={item.name} className="start-menu-icon" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="start-menu-right">
            <div className="start-menu-quick-links">
              <h4>Quick Links</h4>
              <a href="https://github.com/Shovan554" target="_blank" rel="noopener noreferrer" className="quick-link">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/shovan-raut-81537b18a/" target="_blank" rel="noopener noreferrer" className="quick-link">
                LinkedIn
              </a>
              <a href="mailto:Shovan.Rautt@gmail.com" className="quick-link">
                Email Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;