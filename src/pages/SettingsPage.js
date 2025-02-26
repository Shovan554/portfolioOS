import React from 'react';
import Window from '../components/Window';
import '../styles/settingsPage.css';

const SettingsPage = ({ 
  isOpen, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus, 
  initialPosition, 
  onPositionChange,
  toggleDarkMode,
  isDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <Window
      title="Settings"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialPosition={initialPosition}
      onPositionChange={onPositionChange}
      width={500}
      height={400}
      minWidth={400}
      minHeight={300}
    >
      <div className="settings-container">
        <h2>System Settings</h2>
        
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label htmlFor="darkModeToggle">Dark Mode</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="darkModeToggle" 
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>About</h3>
          <div className="about-info">
            <p><strong>Portfolio OS</strong></p>
            <p>Version 1.0.0</p>
            <p>Created with React.js</p>
            <p>© 2023 Your Name</p>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <p>Email: your.email@example.com</p>
            <p>LinkedIn: linkedin.com/in/yourprofile</p>
            <p>GitHub: github.com/yourusername</p>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default SettingsPage;