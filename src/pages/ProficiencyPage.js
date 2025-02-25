import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';
import '../styles/proficiencyPage.css';

const ProficiencyPage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("ProficiencyPage rendering, isOpen:", isOpen);
  
  // Proficiency data with percentages
  const proficiencyData = [
    { skill: "Python", percentage: 80 },
    { skill: "C#", percentage: 65 },
    { skill: "Frontend/Design", percentage: 70 },
    { skill: "Database Management", percentage: 70 },
    { skill: "Arduino C++", percentage: 70 },
    { skill: "Data Structures and Algorithms", percentage: 60 },
    { skill: "ASP.NET", percentage: 60 }
  ];
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Proficiency" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Proficiency</h1>
          <p className="proficiency-intro">
            My technical proficiency levels across various technologies and skills:
          </p>
          
          <div className="proficiency-container">
            {proficiencyData.map((item, index) => (
              <div key={index} className="proficiency-item">
                <div className="proficiency-info">
                  <span className="proficiency-skill">{item.skill}</span>
                  <span className="proficiency-percentage">{item.percentage}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${item.percentage}%` }}
                  >
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="proficiency-note">
            <h3>Continuous Learning</h3>
            <p>
              I'm constantly improving my skills through projects, courses, and hands-on experience.
              My goal is to deepen my expertise in these areas while exploring new technologies.
            </p>
          </div>
        </div>
      </WindowBox>
    </div>
  );
};

export default ProficiencyPage;
