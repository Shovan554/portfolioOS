import React, { useState, useEffect, useRef } from 'react';
import '../styles/topMenuBar.css';
// Import icons for battery and wifi
import batteryFullIcon from '../assets/icons/battery-full.png';
import batteryLowIcon from '../assets/icons/battery-low.png';
import wifiOnIcon from '../assets/icons/wifi-on.png';
import wifiOffIcon from '../assets/icons/wifi-off.png';
// Import profile picture
import profilePic from '../assets/images/pp.PNG';

const TopMenuBar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [showSocialsDropdown, setShowSocialsDropdown] = useState(false);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // Add states for battery and wifi
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [wifiConnected, setWifiConnected] = useState(true);
  const [showBatteryInfo, setShowBatteryInfo] = useState(false);
  const [showWifiInfo, setShowWifiInfo] = useState(false);
  // Add state for profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Create refs for each dropdown container
  const socialsDropdownRef = useRef(null);
  const projectsDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const batteryInfoRef = useRef(null);
  const wifiInfoRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate battery drain
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prevLevel => {
        // Random small decrease in battery level
        const newLevel = Math.max(0, prevLevel - Math.random() * 0.5);
        return Number(newLevel.toFixed(1));
      });
    }, 60000); // Update every minute

    return () => clearInterval(batteryTimer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleWifi = () => {
    setWifiConnected(!wifiConnected);
  };

  // Function to get battery icon based on level
  const getBatteryIcon = () => {
    return batteryLevel > 20 ? batteryFullIcon : batteryLowIcon;
  };

  // Function to get battery color based on level
  const getBatteryColor = () => {
    if (batteryLevel <= 20) return '#ff4d4d'; // Red for low battery
    if (batteryLevel <= 50) return '#ffcc00'; // Yellow for medium battery
    return '#00cc66'; // Green for good battery
  };

  // Handle Sign Out - refreshes the page
  const handleSignOut = () => {
    window.location.reload();
  };

  // Handle Logout - alternative approaches
  const handleLogout = () => {
    // Option 1: Redirect to a blank page or a logout confirmation page
    window.location.href = "about:blank";
    
    // Option 2: Show a confirmation dialog asking the user to close the window
    // if (window.confirm("Are you sure you want to logout? Please close this window to complete the process.")) {
    //   // You could also try window.close() after confirmation
    //   window.close();
    // }
    
    // Option 3: Clear any session data and redirect to a login page
    // localStorage.clear();
    // sessionStorage.clear();
    // window.location.href = "/login"; // If you have a login page
  };

  return (
    <div className="top-menubar">
      <div className="menubar-container">
        <div className="left-menu">
          <div 
            className="menu-item-dropdown"
            ref={projectsDropdownRef}
            onMouseEnter={() => setShowProjectsDropdown(true)}
            onMouseLeave={() => setShowProjectsDropdown(false)}
          >
            <span className="menu-item">
              Projects
            </span>
            {showProjectsDropdown && (
              <div className="dropdown-menu">
                <a 
                  href="https://github.com/Shovan554/portfolioOS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  Portfolio (GitHub)
                </a>
                <a 
                  href="https://www.cougarhacks.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  Cougar Hacks
                </a>
                <a 
                  href="https://lotus-wear-f372053a3005.herokuapp.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  Lotus Wear
                </a>
                <a 
                  href="https://github.com/Shovan554/brainwave" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  BrainWave (GitHub)
                </a>
                <a 
                  href="https://caldwell-robotics.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  Caldwell Robotics
                </a>
                
                <a 
                  href="https://www.thecollegeadvisers.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  The College Advisers
                </a>
              </div>
            )}
          </div>
          <a 
            href="https://docs.google.com/document/d/your-resume-id/edit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="menu-item"
          >
            Resume
          </a>
          <div 
            className="menu-item-dropdown"
            ref={socialsDropdownRef}
            onMouseEnter={() => setShowSocialsDropdown(true)}
            onMouseLeave={() => setShowSocialsDropdown(false)}
          >
            <span className="menu-item">
              Socials
            </span>
            {showSocialsDropdown && (
              <div className="dropdown-menu">
                <a 
                  href="https://github.com/Shovan554" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/shovan-raut-81537b18a/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://www.instagram.com/shovan._._/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="dropdown-item"
                >
                  Instagram
                </a>
              </div>
            )}
          </div>
          <div 
            className="menu-item-dropdown"
            ref={settingsDropdownRef}
            onMouseEnter={() => setShowSettingsDropdown(true)}
            onMouseLeave={() => setShowSettingsDropdown(false)}
          >
            <span className="menu-item">
              Settings
            </span>
            {showSettingsDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item settings-item">
                  <span>Dark Mode</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={darkMode} 
                      onChange={toggleDarkMode}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="dropdown-item settings-item">
                  <span>WiFi</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={wifiConnected} 
                      onChange={toggleWifi}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="center-menu">
          <span className="datetime">
            {formatTime(dateTime)} | {formatDate(dateTime)}
          </span>
        </div>
        <div className="right-menu">
          {/* Battery indicator */}
          <div 
            className="status-icon-container"
            ref={batteryInfoRef}
            onMouseEnter={() => setShowBatteryInfo(true)}
            onMouseLeave={() => setShowBatteryInfo(false)}
          >
            <div className="battery-indicator">
              <img 
                src={getBatteryIcon()} 
                alt="Battery" 
                className="status-icon"
              />
              <div 
                className="battery-level" 
                style={{ 
                  width: `${batteryLevel}%`, 
                  backgroundColor: getBatteryColor() 
                }}
              ></div>
            </div>
            {showBatteryInfo && (
              <div className="status-dropdown">
                <div className="status-info">
                  <span>Battery: {batteryLevel.toFixed(0)}%</span>
                  <div className="battery-bar">
                    <div 
                      className="battery-fill" 
                      style={{ 
                        width: `${batteryLevel}%`, 
                        backgroundColor: getBatteryColor() 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* WiFi indicator */}
          <div 
            className="status-icon-container"
            ref={wifiInfoRef}
            onMouseEnter={() => setShowWifiInfo(true)}
            onMouseLeave={() => setShowWifiInfo(false)}
          >
            <img 
              src={wifiConnected ? wifiOnIcon : wifiOffIcon} 
              alt="WiFi" 
              className="status-icon"
            />
            {showWifiInfo && (
              <div className="status-dropdown">
                <div className="status-info">
                  <span>WiFi: {wifiConnected ? 'Connected' : 'Disconnected'}</span>
                  {wifiConnected && <span>Network: Portfolio-OS-Network</span>}
                </div>
              </div>
            )}
          </div>
          
          {/* Profile section */}
          <div 
            className="profile-container"
            ref={profileDropdownRef}
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
          >
            <span className="user-name">@Shovan Raut</span>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="profile-pic"
                  />
                  <div className="profile-info">
                  <span className="profile-name">Shovan Raut</span>
                    <a 
                      href="https://github.com/Shovan554" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="profile-name-link"
                    >
                      
                      <span className="profile-username">@Shovan554</span>
                    </a>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">Available</span>
                  </div>
                  <div className="profile-detail-item">
                    <span className="detail-label">Role:</span>
                    <span className="detail-value">Software Developer</span>
                  </div>
                  <div className="profile-detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">NJ, USA</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <button 
                    className="profile-action-btn"
                    onClick={handleSignOut}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;
