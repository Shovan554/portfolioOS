import React, { useEffect } from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/homePage.css';
import profileImage from '../assets/images/pp.PNG'; // Make sure to add your profile image

const HomePage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("HomePage rendering, isOpen:", isOpen);
  
  useEffect(() => {
    console.log("HomePage mounted");
  }, []);

  return (
    <div className="home-page">
      <div className="grid-overlay"></div>
      <WindowBox 
        title="Home" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
        width={1100}
        height={750}
      >
        <div className="home-content">
          <div className="profile-section">
            <div className="profile-image-container">
              <img src={profileImage} alt="Shovan Raut" className="profile-image" />
            </div>
            <div className="profile-intro" style={{ color: '#000' }}>
              <h1 className="profile-name" style={{ color: '#000' }}>Shovan Raut</h1>
              <h2 className="profile-title" style={{ color: '#01a7a8' }}>Innovative Tech Enthusiast</h2>
              <p className="profile-tagline" style={{ color: '#000' }}>A dedicated computer science student skilled in Python, SQL, React, web development and passionate about Robotics.</p>
              
              <div className="contact-info">
                <div className="contact-item" style={{ color: '#000', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                  <span className="contact-icon">📍</span>
                  <span>Caldwell, New Jersey, USA</span>
                </div>
                <div className="contact-item" style={{ color: '#000', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                  <span className="contact-icon">📱</span>
                  <span>605-670-9329</span>
                </div>
                <div className="contact-item" style={{ color: '#000', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                  <span className="contact-icon">✉️</span>
                  <a href="mailto:Shovan.Rautt@gmail.com" style={{ color: '#01a7a8' }}>Shovan.Rautt@gmail.com</a>
                </div>
                <div className="contact-item" style={{ color: '#000', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                  <span className="contact-icon">💻</span>
                  <a href="https://github.com/Shovan554" target="_blank" rel="noopener noreferrer" style={{ color: '#01a7a8' }}>GitHub: Shovan554</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rest of your content */}
        </div>
      </WindowBox>
    </div>
  );
};

export default HomePage;