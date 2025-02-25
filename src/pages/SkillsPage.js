import React from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/commonPage.css';
// Import icons
import { FaPython, FaDatabase, FaHtml5, FaCss3Alt, FaJs, FaReact, FaMicrochip, FaBrain } from 'react-icons/fa';
import { SiSqlite, SiOracle, SiCplusplus, SiArduino } from 'react-icons/si';

const SkillsPage = ({ 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  // Add console log for debugging
  console.log("SkillsPage rendering, isOpen:", isOpen);
  
  // Skills data with icons
  const skillsData = [
    {
      category: "Programming Languages",
      skills: [
        { name: "Python", icon: <FaPython className="skill-icon" /> },
        { name: "SQL", icon: <FaDatabase className="skill-icon" /> },
        { name: "C/C++ (Arduino)", icon: <SiCplusplus className="skill-icon" /> }
      ]
    },
    {
      category: "Web Development",
      skills: [
        { name: "HTML", icon: <FaHtml5 className="skill-icon" /> },
        { name: "CSS", icon: <FaCss3Alt className="skill-icon" /> },
        { name: "JavaScript", icon: <FaJs className="skill-icon" /> },
        { name: "React", icon: <FaReact className="skill-icon" /> }
      ]
    },
    {
      category: "Database Management",
      skills: [
        { name: "Oracle", icon: <SiOracle className="skill-icon" /> },
        { name: "SQLite", icon: <SiSqlite className="skill-icon" /> }
      ]
    },
    {
      category: "Hardware & IoT",
      skills: [
        { name: "Arduino", icon: <SiArduino className="skill-icon" /> }
      ]
    }
  ];
  
  return (
    <div className="page-container">
      <WindowBox 
        title="Skills & Interests" 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      >
        <div className="page-content">
          <h1>Skills & Interests</h1>
          
          <div className="skills-grid">
            {skillsData.map((category, index) => (
              <div key={index} className="skill-category">
                <h2>{category.category}</h2>
                <div className="skills-list">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-item">
                      {skill.icon}
                      <span className="skill-name">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="skills-highlights">
            <h2>Key Highlights</h2>
            <ul>
              <li><span className="highlight-icon">⚡</span> Programming in Python and SQL</li>
              <li><span className="highlight-icon">⚡</span> Web development using HTML, CSS, JavaScript and React</li>
              <li><span className="highlight-icon">⚡</span> Building projects with ReactJS</li>
              <li><span className="highlight-icon">⚡</span> Database management with Oracle and SQLite</li>
              <li><span className="highlight-icon">⚡</span> Arduino programming (C/C++)</li>
            </ul>
          </div>
          
          <div className="interests-section">
            <h2>Interests</h2>
            <div className="interests-list">
              <div className="interest-item">
                <FaBrain className="interest-icon" />
                <span>Artificial Intelligence</span>
              </div>
              <div className="interest-item">
                <FaMicrochip className="interest-icon" />
                <span>Robotics</span>
              </div>
              <div className="interest-item">
                <FaReact className="interest-icon" />
                <span>Web Development</span>
              </div>
              <div className="interest-item">
                <FaDatabase className="interest-icon" />
                <span>Data Science</span>
              </div>
            </div>
          </div>
        </div>
      </WindowBox>
    </div>
  );
};

export default SkillsPage;

