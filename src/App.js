import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LoadingPage from './pages/LoadingPage';
import Desktop from './pages/Desktop';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import ProficiencyPage from './pages/ProficiencyPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import ProjectsPage from './pages/ProjectsPage';
import FlappyDunkGame from './pages/FlappyDunkGame';
import Terminal from './pages/Terminal';
import NavBar from './components/navBar';
import TopMenuBar from './components/TopMenuBar';
import './App.css';
import './styles/darkMode.css'; // Import the dark mode styles
import './styles/desktop.css'; // Import the desktop styles for help button and help box
import MobileWarning from './components/MobileWarning';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Force isLoading to true on initial render
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStartTime] = useState(Date.now());
  const [minimizedWindows, setMinimizedWindows] = useState({
    '/': false,
    '/skills': false,
    '/proficiency': false,
    '/experience': false,
    '/education': false,
    '/projects': false,
    '/flappydunk': false,
    '/terminal': false
  });
  
  // Add state for window management
  const [openWindows, setOpenWindows] = useState({
    '/': false,
    '/skills': false,
    '/proficiency': false,
    '/experience': false,
    '/education': false,
    '/projects': false,
    '/flappydunk': false,
    '/terminal': false
  });
  
  const [windowZIndex, setWindowZIndex] = useState({
    '/': 1,
    '/skills': 1,
    '/proficiency': 1,
    '/experience': 1,
    '/education': 1,
    '/projects': 1,
    '/flappydunk': 1,
    '/terminal': 1
  });
  
  const [windowPositions, setWindowPositions] = useState({
    '/': { x: 100, y: 100 },
    '/skills': { x: 150, y: 150 },
    '/proficiency': { x: 200, y: 200 },
    '/experience': { x: 250, y: 250 },
    '/education': { x: 300, y: 300 },
    '/projects': { x: 350, y: 350 },
    '/flappydunk': { x: 200, y: 100 }, // Updated position
    '/terminal': { x: 250, y: 150 }    // Updated position
  });
  
  // Add state for help box
  const [showHelpBox, setShowHelpBox] = useState(false);
  
  // Toggle help box function
  const toggleHelpBox = () => {
    setShowHelpBox(!showHelpBox);
  };
  
  // Add state for mobile warning
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  // Window management functions
  const handleOpenWindow = (path) => {
    setOpenWindows({ ...openWindows, [path]: true });
    bringWindowToFront(path);
    navigate(path);
  };

  const handleCloseWindow = (path) => {
    setOpenWindows({ ...openWindows, [path]: false });
  };

  const handleMinimizeWindow = (path) => {
    setMinimizedWindows({ ...minimizedWindows, [path]: true });
  };

  const handleRestoreWindow = (path) => {
    setMinimizedWindows({ ...minimizedWindows, [path]: false });
    bringWindowToFront(path);
  };

  const bringWindowToFront = (path) => {
    const highestZ = Math.max(...Object.values(windowZIndex));
    setWindowZIndex({ ...windowZIndex, [path]: highestZ + 1 });
  };

  const updateWindowPosition = (path, position) => {
    setWindowPositions({ ...windowPositions, [path]: position });
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Remove this line to prevent automatically opening the home window
    // handleOpenWindow('/');
  };

  // Add this function to your App component
  const closeAllWindows = () => {
    // Get all open window paths
    const openWindowPaths = Object.keys(openWindows).filter(path => openWindows[path]);
    
    // Close each window
    openWindowPaths.forEach(path => {
      handleCloseWindow(path);
    });
  };

  // Add this useEffect for mobile warning
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 845) {
        setShowMobileWarning(true);
      } else {
        setShowMobileWarning(false);
      }
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Check when window is resized
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Make window management functions available globally
  useEffect(() => {
    window.handleOpenWindow = handleOpenWindow;
    window.closeAllWindows = closeAllWindows;
  }, []);

  // Render the mobile warning before anything else
  if (showMobileWarning) {
    return <MobileWarning />;
  }

  if (isLoading) {
    console.log("Rendering LoadingPage");
    return <LoadingPage onComplete={handleLoadingComplete} />;
  }

  console.log("Rendering main app content");
  console.log("Current openWindows state before render:", openWindows);
  
  return (
    <div className="App">
      <TopMenuBar />
      <div className="main-content" style={{flex: 1, position: 'relative'}}>
        {/* Background Grid - Set to lower opacity or remove if it interferes with the image */}
        <div className="grid-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.1, /* Reduced opacity to make background image more visible */
          zIndex: 1
        }}></div>
        
        {/* Desktop component with background image */}
        <Desktop />
        
        {/* Render all windows regardless of current route */}
        <HomePage 
          isOpen={openWindows['/'] && !minimizedWindows['/']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/') : handleMinimizeWindow('/')}
          onClose={() => handleCloseWindow('/')}
          zIndex={windowZIndex['/']}
          onFocus={() => bringWindowToFront('/')}
          initialPosition={windowPositions['/']}
          onPositionChange={(position) => updateWindowPosition('/', position)}
        />
        
        <SkillsPage 
          isOpen={openWindows['/skills'] && !minimizedWindows['/skills']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/skills') : handleMinimizeWindow('/skills')}
          onClose={() => handleCloseWindow('/skills')}
          zIndex={windowZIndex['/skills']}
          onFocus={() => bringWindowToFront('/skills')}
          initialPosition={windowPositions['/skills']}
          onPositionChange={(position) => updateWindowPosition('/skills', position)}
        />
        
        <ProficiencyPage 
          isOpen={openWindows['/proficiency'] && !minimizedWindows['/proficiency']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/proficiency') : handleMinimizeWindow('/proficiency')}
          onClose={() => handleCloseWindow('/proficiency')}
          zIndex={windowZIndex['/proficiency']}
          onFocus={() => bringWindowToFront('/proficiency')}
          initialPosition={windowPositions['/proficiency']}
          onPositionChange={(position) => updateWindowPosition('/proficiency', position)}
        />
        
        <ExperiencePage 
          isOpen={openWindows['/experience'] && !minimizedWindows['/experience']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/experience') : handleMinimizeWindow('/experience')}
          onClose={() => handleCloseWindow('/experience')}
          zIndex={windowZIndex['/experience']}
          onFocus={() => bringWindowToFront('/experience')}
          initialPosition={windowPositions['/experience']}
          onPositionChange={(position) => updateWindowPosition('/experience', position)}
        />
        
        <EducationPage 
          isOpen={openWindows['/education'] && !minimizedWindows['/education']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/education') : handleMinimizeWindow('/education')}
          onClose={() => handleCloseWindow('/education')}
          zIndex={windowZIndex['/education']}
          onFocus={() => bringWindowToFront('/education')}
          initialPosition={windowPositions['/education']}
          onPositionChange={(position) => updateWindowPosition('/education', position)}
        />
        
        <ProjectsPage 
          isOpen={openWindows['/projects'] && !minimizedWindows['/projects']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/projects') : handleMinimizeWindow('/projects')}
          onClose={() => handleCloseWindow('/projects')}
          zIndex={windowZIndex['/projects']}
          onFocus={() => bringWindowToFront('/projects')}
          initialPosition={windowPositions['/projects']}
          onPositionChange={(position) => updateWindowPosition('/projects', position)}
        />
        
        <FlappyDunkGame 
          isOpen={openWindows['/flappydunk'] && !minimizedWindows['/flappydunk']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/flappydunk') : handleMinimizeWindow('/flappydunk')}
          onClose={() => handleCloseWindow('/flappydunk')}
          zIndex={windowZIndex['/flappydunk']}
          onFocus={() => bringWindowToFront('/flappydunk')}
          initialPosition={windowPositions['/flappydunk']}
          onPositionChange={(position) => updateWindowPosition('/flappydunk', position)}
        />
        
        {/* Add Terminal Window */}
        <Terminal 
          isOpen={openWindows['/terminal'] && !minimizedWindows['/terminal']} 
          setIsOpen={(isOpen) => isOpen ? handleRestoreWindow('/terminal') : handleMinimizeWindow('/terminal')}
          onClose={() => handleCloseWindow('/terminal')}
          zIndex={windowZIndex['/terminal']}
          onFocus={() => bringWindowToFront('/terminal')}
          initialPosition={windowPositions['/terminal']}
          onPositionChange={(position) => updateWindowPosition('/terminal', position)}
        />
        
        {/* Hidden Routes for navigation */}
        <div style={{ display: 'none' }}>
          <Routes>
            <Route path="/desktop" element={<div />} />
            <Route path="/" element={<div />} />
            <Route path="/skills" element={<div />} />
            <Route path="/proficiency" element={<div />} />
            <Route path="/experience" element={<div />} />
            <Route path="/education" element={<div />} />
            <Route path="/projects" element={<div />} />
            <Route path="/flappydunk" element={<div />} />
            <Route path="/terminal" element={<div />} />
          </Routes>
        </div>
      </div>
      
      {/* Global Help Button */}
      <button 
        className="help-button"
        onClick={toggleHelpBox}
        aria-label="Help"
      >
        ?
      </button>

      {/* Global Help Box */}
      {showHelpBox && (
        <div className="help-box">
          <div className="help-header">
            <h2>Welcome to Portfolio OS</h2>
            <button 
              className="close-help-button"
              onClick={toggleHelpBox}
              aria-label="Close help"
            >
              ×
            </button>
          </div>
          
          <div className="help-content">
            <section className="help-section">
              <h3>Getting Started</h3>
              <p>This portfolio is designed to mimic an operating system interface. Here's how to navigate:</p>
              <ul>
                <li><strong>Navigation Bar:</strong> Use the icons at the bottom of the screen to open different sections.</li>
                <li><strong>Top Menu Bar:</strong> Access projects, resume, social links, and find settings</li>
                <li><strong>Windows:</strong> Interact with windows by dragging,  maximizing, or closing them.</li>
                <li><strong>Desktop Icons:</strong>Double-click on icons to open their respective windows.</li>
                <li><strong>Dark Mode:Toggle between light and dark themes in the Settings dropdown.</strong></li>


              </ul>
            </section>
          </div>
        </div>
      )}
      
      <NavBar 
        openWindows={openWindows}
        minimizedWindows={minimizedWindows}
        setMinimizedWindows={setMinimizedWindows}
        handleOpenWindow={handleOpenWindow}
        windowZIndex={windowZIndex}
      />
    </div>
  );
}

export default App;





