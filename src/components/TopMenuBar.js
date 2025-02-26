import React, { useState, useEffect, useRef } from 'react';
import '../styles/topMenuBar.css';
// Import icons for battery and wifi
import batteryFullIcon from '../assets/icons/battery-full.png';
import batteryLowIcon from '../assets/icons/battery-low.png';
import wifiOnIcon from '../assets/icons/wifi-on.png';
import wifiOffIcon from '../assets/icons/wifi-off.png';
// Import profile picture
import profilePic from '../assets/images/pp.PNG';
// Import weather icons
import sunnyIcon from '../assets/icons/sunny.png';
import cloudyIcon from '../assets/icons/cloudy.png';
import rainyIcon from '../assets/icons/rainy.png';

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
  // Add state for datetime dropdown
  const [showDateTimeInfo, setShowDateTimeInfo] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: 72,
    condition: 'Sunny',
    location: 'New Jersey, USA',
    forecast: [
      { day: 'Today', temp: 72, condition: 'Sunny' },
      { day: 'Tomorrow', temp: 68, condition: 'Partly Cloudy' },
      { day: 'Wednesday', temp: 65, condition: 'Rainy' }
    ]
  });
  // Add state for weather loading
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const handleLocationPermission = (granted) => {
    setShowLocationPrompt(false);
    if (granted) {
      setLocationPermission('granted');
    } else {
      setLocationPermission('denied');
      setWeatherError('Weather data unavailable without location access.');
      setIsWeatherLoading(false);
    }
  };

  // Create refs for each dropdown container
  const socialsDropdownRef = useRef(null);
  const projectsDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const batteryInfoRef = useRef(null);
  const wifiInfoRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const dateTimeInfoRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch weather data based on user's location
  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      setIsWeatherLoading(true);
      setWeatherError(null);
      
      try {
        // Using WeatherAPI.com
        const apiKey = 'e3b51d8b01174839b3625130252602'; // Your WeatherAPI.com API key
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        
        const data = await response.json();
        
        // Update weather data state with the new API response format
        setWeatherData({
          temperature: Math.round(data.current.temp_f),
          condition: data.current.condition.text,
          location: `${data.location.name}, ${data.location.country}`,
          forecast: [
            { 
              day: 'Today', 
              temp: Math.round(data.current.temp_f), 
              condition: data.current.condition.text 
            },
            { 
              day: 'Tomorrow', 
              temp: Math.round(data.forecast.forecastday[1].day.avgtemp_f), 
              condition: data.forecast.forecastday[1].day.condition.text 
            },
            { 
              day: getDayName(new Date(data.forecast.forecastday[2].date)), 
              temp: Math.round(data.forecast.forecastday[2].day.avgtemp_f), 
              condition: data.forecast.forecastday[2].day.condition.text 
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherError('Failed to load weather data');
      } finally {
        setIsWeatherLoading(false);
      }
    };
    
    // Helper function to get day name
    const getDayName = (date) => {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    };
    
    // Get user's location and fetch weather data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setWeatherError('Location access denied. Using default weather data.');
        }
      );
    } else {
      setWeatherError('Geolocation is not supported by this browser. Using default weather data.');
    }
  }, [locationPermission]);

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

  // Function to get weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (!condition) return sunnyIcon;
    
    condition = condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle')) return rainyIcon;
    if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || 
        condition.includes('mist') || condition.includes('partly')) return cloudyIcon;
    return sunnyIcon; // Default to sunny for clear, sun, etc.
  };

  // Handle Sign Out - refreshes the page
  const handleSignOut = () => {
    window.location.reload();
  };

  // Handle Logout - alternative approaches
  const handleLogout = () => {
    // Option 1: Redirect to a blank page or a logout confirmation page
    window.location.href = "about:blank";
  };

  // Render weather content based on loading/error state
  const renderWeatherContent = () => {
    if (isWeatherLoading) {
      return (
        <div className="datetime-weather loading">
          <span>Loading weather data...</span>
        </div>
      );
    }
    
    if (weatherError) {
      return (
        <div className="datetime-weather error">
          <span>{weatherError}</span>
        </div>
      );
    }
    
    return (
      <div className="datetime-weather">
        <img 
          src={getWeatherIcon(weatherData.condition)} 
          alt={weatherData.condition} 
          className="datetime-weather-icon"
        />
        <div className="datetime-weather-info">
          <span className="datetime-weather-temp">{weatherData.temperature}°F</span>
          <span className="datetime-weather-condition">{weatherData.condition}</span>
          <div className="datetime-weather-location-container">
            <span className="datetime-weather-location">{weatherData.location}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLocationPrompt = () => {
    if (!showLocationPrompt) return null;
    
    return (
      <div className="location-permission-modal">
        <div className="location-permission-content">
          <h3>Location Access</h3>
          <p>Portfolio OS would like to access your location to show local weather information.</p>
          <div className="location-permission-buttons">
            <button 
              className="location-deny-btn"
              onClick={() => handleLocationPermission(false)}
            >
              Deny
            </button>
            <button 
              className="location-allow-btn"
              onClick={() => handleLocationPermission(true)}
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="top-menubar">
      {renderLocationPrompt()}
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
            href="https://docs.google.com/document/d/1FX2dabPGTTywadxxvj0YFbiqVcKzoJRUk-xUebIUSlE/edit?usp=sharing" 
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
        <div 
          className="center-menu"
          ref={dateTimeInfoRef}
          onMouseEnter={() => setShowDateTimeInfo(true)}
          onMouseLeave={() => setShowDateTimeInfo(false)}
        >
          <span className="datetime">
            {formatTime(dateTime)} | {formatDate(dateTime)}
          </span>
          {showDateTimeInfo && (
            <div className="dropdown-menu datetime-dropdown">
              <div className="datetime-header">
                <h3>Calendar & Weather</h3>
              </div>
              
              {/* Weather section with conditional rendering */}
              {renderWeatherContent()}

              {/* Calendar section remains unchanged */}
              <div className="datetime-content">
                <div className="calendar-view">
                  <div className="calendar-month">
                    <h4>{dateTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                    <div className="calendar-grid">
                      <div className="calendar-day-header">Su</div>
                      <div className="calendar-day-header">Mo</div>
                      <div className="calendar-day-header">Tu</div>
                      <div className="calendar-day-header">We</div>
                      <div className="calendar-day-header">Th</div>
                      <div className="calendar-day-header">Fr</div>
                      <div className="calendar-day-header">Sa</div>
                      
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - (new Date(dateTime.getFullYear(), dateTime.getMonth(), 1).getDay()) + 1;
                        const isCurrentMonth = day > 0 && day <= new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 0).getDate();
                        const isToday = day === dateTime.getDate() && isCurrentMonth;
                        
                        return (
                          <div 
                            key={i} 
                            className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`}
                          >
                            {isCurrentMonth ? day : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                  width: `${Math.min(batteryLevel / 100 * 14, 14)}px`, 
                  backgroundColor: getBatteryColor() 
                }}
              ></div>
            </div>
            {showBatteryInfo && (
              <div className="status-dropdown">
                <div className="status-info">
                  <span>Battery: {batteryLevel.toFixed(1)}%</span>
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
