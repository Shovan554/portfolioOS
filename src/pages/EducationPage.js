import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';
import '../styles/educationPage.css';

const EducationPage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("EducationPage rendering, isOpen:", isOpen);
  
  // Education data
  const educationData = [
    {
      school: "Caldwell University",
      degree: "Bachelor of Science in Computer Science",
      period: "December 2022 - May 2026 (Expected)",
      description: "Currently pursuing a Bachelor's degree in Computer Science, focusing on developing strong programming skills and theoretical knowledge in computer science fundamentals."
    },
    {
      school: "University of South Dakota",
      degree: "Bachelor of Science in Computer Science",
      period: "August 2022 - December 2022",
      description: "Started my undergraduate studies in Computer Science, establishing a foundation in programming principles and computer science theory."
    },
    {
      school: "Saint Xavier's Maitighar",
      degree: "Cambridge International AS & A Levels",
      period: "June 2019 - August 2021",
      description: "Completed Cambridge International Advanced Level education with a focus on Mathematics, Physics, and Computer Science, preparing for university-level studies."
    }
  ];
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Education" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Education</h1>
          
          <div className="education-timeline">
            {educationData.map((education, index) => (
              <div key={index} className="education-item">
                <div className="education-dot"></div>
                <div className="education-content">
                  <div className="education-header">
                    <h2 className="school-name">{education.school}</h2>
                    <h3 className="degree-name">{education.degree}</h3>
                    <span className="education-period">{education.period}</span>
                  </div>
                  <p className="education-description">{education.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="education-footer">
            <h3>Continuous Learning</h3>
            <p>Beyond formal education, I'm committed to lifelong learning through online courses, coding challenges, and personal projects to stay current with emerging technologies and best practices.</p>
          </div>
        </div>
      </WindowBox>
    </div>
  );
};

export default EducationPage;
