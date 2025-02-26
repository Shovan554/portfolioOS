import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';
import '../styles/experiencePage.css';

const ExperiencePage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("ExperiencePage rendering, isOpen:", isOpen);
  
  // Experience data
  const experienceData = [
    {
      company: "CogAI",
      position: "Research Assistant (Part time)",
      period: "Sep 2023 - Current",
      description: "Designed and implemented experiments to evaluate the impact of backpropagation on CNN performance. Worked on a device enhancing mobility and environmental awareness for visually impaired individuals."
    },
    {
      company: "STEM Advance Project",
      position: "Summer Researcher",
      period: "May 2024 - August 2024",
      description: "Conducted research as part of the STEM Advance Project at Caldwell, New Jersey, focusing on innovative solutions and technological advancements."
    },
    {
      company: "South Dakota Science Olympiad",
      position: "Media Analyst",
      period: "Sep 2022 - Dec 2022",
      description: "Built a website for the science Olympiad team. Managed and handled the social media accounts to increase visibility and engagement."
    },
    {
      company: "E Automations",
      position: "Junior Developer",
      period: "Jan 2022 - Jul 2022",
      description: "Automated data import to a database built in Visual Basic. Developed a SaaS framework for managing, generating, and reporting commissions for dealers authorized by Ncell Pvt Ltd."
    }
  ];
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Experience" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Professional Experience</h1>
          
          <div className="timeline">
            {experienceData.map((experience, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="experience-header">
                    <div className="experience-title">
                      <h2>{experience.company}</h2>
                      <h3>{experience.position}</h3>
                      <span className="experience-period">{experience.period}</span>
                    </div>
                  </div>
                  <p className="experience-description">{experience.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="experience-footer">
            <p>Always seeking new challenges and opportunities to apply and expand my skills.</p>
          </div>
        </div>
      </WindowBox>
    </div>
  );
};

export default ExperiencePage;
