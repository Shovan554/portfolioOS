import React from 'react';
import '../styles/mobileWarning.css';

const MobileWarning = () => {
  return (
    <div className="mobile-warning">
      <div className="warning-content">
        <h2>⚠️ Device Not Supported</h2>
        <p>This portfolio OS requires a screen size of at least 845px width for proper viewing.</p>
        <p>Please visit on a tablet (iPad) or laptop/desktop computer for the full experience.</p>
        <div className="warning-actions">
          <a 
            href="https://docs.google.com/document/d/1FX2dabPGTTywadxxvj0YFbiqVcKzoJRUk-xUebIUSlE/edit?usp=sharing" 
            className="resume-link" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View My Resume Instead
          </a>
          <div className="social-links">
            <p>Or connect with me on:</p>
            <div className="social-buttons">
              <a 
                href="https://github.com/Shovan554" 
                className="social-button github"
                target="_blank" 
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/shovan-raut-81537b18a/" 
                className="social-button linkedin"
                target="_blank" 
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWarning;
