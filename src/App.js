import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LoadingPage from './pages/LoadingPage';
import Desktop from './pages/Desktop';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import ProficiencyPage from './pages/ProficiencyPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import ProjectsPage from './pages/ProjectsPage';
import NavBar from './components/navBar';
import TopMenuBar from './components/TopMenuBar';
import './App.css';
import './styles/darkMode.css'; // Import the dark mode styles

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [minimizedWindows, setMinimizedWindows] = useState({
    '/': false,
    '/skills': false,
    '/proficiency': false,
    '/experience': false,
    '/education': false,
    '/projects': false
  });
  
  // Track open windows - initialize all as closed
  const [openWindows, setOpenWindows] = useState({
    '/': false,
    '/skills': false,
    '/proficiency': false,
    '/experience': false,
    '/education': false,
    '/projects': false
  });
  
  // Track z-index for each window
  const [windowZIndex, setWindowZIndex] = useState({
    '/': 10,
    '/skills': 11,
    '/proficiency': 12,
    '/experience': 13,
    '/education': 14,
    '/projects': 15
  });
  
  // Track window positions - initialize with centered positions
  // We'll use null to indicate that the window should be centered on first open
  const [windowPositions, setWindowPositions] = useState({
    '/': null,
    '/skills': null,
    '/proficiency': null,
    '/experience': null,
    '/education': null,
    '/projects': null
  });
  
  // Current highest z-index
  const [highestZIndex, setHighestZIndex] = useState(15);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle loading complete
  const handleLoadingComplete = () => {
    console.log("Loading complete");
    setIsLoading(false);
    
    // Navigate to desktop instead of home
    navigate('/desktop', { replace: true });
  };
  
  // Bring window to front
  const bringWindowToFront = (path) => {
    console.log(`Bringing window to front: ${path}`);
    const newZIndex = highestZIndex + 1;
    setWindowZIndex({...windowZIndex, [path]: newZIndex});
    setHighestZIndex(newZIndex);
  };
  
  // Handle window closing
  const handleCloseWindow = (path) => {
    console.log(`Closing window: ${path}`);
    setOpenWindows({...openWindows, [path]: false});
    
    // Find another open window to navigate to, excluding home page
    const openPaths = Object.keys(openWindows)
      .filter(p => p !== path && p !== '/' && openWindows[p] && !minimizedWindows[p]);
    
    console.log("Open paths after closing (excluding home):", openPaths);
    
    if (openPaths.length > 0) {
      console.log("Navigating to another open window:", openPaths[0]);
      navigate(openPaths[0], { replace: true });
    } else {
      console.log("No open windows left, navigating to desktop");
      // Navigate to desktop to show just the background
      navigate('/desktop', { replace: true });
    }
  };
  
  // Handle window opening
  const handleOpenWindow = (path) => {
    console.log(`Opening window: ${path}`);
    
    // If window is not open, open it
    if (!openWindows[path]) {
      setOpenWindows(prev => {
        console.log("Current openWindows state:", prev);
        console.log("Setting", path, "to true");
        return {...prev, [path]: true};
      });
      setMinimizedWindows({...minimizedWindows, [path]: false});
      bringWindowToFront(path);
    }
    
    // Update URL without triggering the useEffect
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };
  
  // Bring window to front when navigating to it
  useEffect(() => {
    if (!isLoading) {
      const path = location.pathname;
      console.log(`Navigation effect triggered for path: ${path}`);
      console.log("Current openWindows state:", openWindows);
      
      // Skip for desktop path
      if (path === '/desktop') {
        return;
      }
      
      // Only open the window if it's not already open AND the path is not empty
      if (path && path !== '' && !openWindows[path]) {
        console.log(`Opening window from navigation effect: ${path}`);
        setOpenWindows(prev => ({...prev, [path]: true}));
      }
      
      // Always unminimize the window when navigating to it, but only if it exists
      if (path && minimizedWindows[path]) {
        setMinimizedWindows({...minimizedWindows, [path]: false});
      }
      
      // Only bring window to front if it's a valid path
      if (path && windowZIndex[path]) {
        bringWindowToFront(path);
      }
    }
  }, [location.pathname, isLoading]);
  
  // Function to handle window minimizing
  const handleMinimizeWindow = (path) => {
    console.log(`Minimizing window: ${path}`);
    setMinimizedWindows({...minimizedWindows, [path]: true});
  };
  
  // Function to handle window restoring
  const handleRestoreWindow = (path) => {
    console.log(`Restoring window: ${path}`);
    setMinimizedWindows({...minimizedWindows, [path]: false});
    bringWindowToFront(path);
  };
  
  // Function to update window position
  const updateWindowPosition = (path, position) => {
    setWindowPositions({...windowPositions, [path]: position});
  };

  // Find the window with the highest z-index (the one on top)
  const getTopWindowPath = () => {
    let topPath = '';
    let highestZ = -1;
    
    Object.keys(windowZIndex).forEach(path => {
      if (openWindows[path] && !minimizedWindows[path] && windowZIndex[path] > highestZ) {
        highestZ = windowZIndex[path];
        topPath = path;
      }
    });
    
    return topPath;
  };

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
        {/* Background Grid - Always visible */}
        <div className="grid-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.2,
          zIndex: 1
        }}></div>
        
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
        
        {/* Hidden Routes for navigation */}
        <div style={{ display: 'none' }}>
          <Routes>
            <Route path="/desktop" element={<Desktop />} />
            <Route path="/" element={<div />} />
            <Route path="/skills" element={<div />} />
            <Route path="/proficiency" element={<div />} />
            <Route path="/experience" element={<div />} />
            <Route path="/education" element={<div />} />
            <Route path="/projects" element={<div />} />
            {/* Add a catch-all route that redirects to desktop */}
            <Route path="*" element={<div />} />
          </Routes>
        </div>
      </div>
      <NavBar 
        minimizedWindows={minimizedWindows}
        setMinimizedWindows={setMinimizedWindows}
        openWindows={openWindows}
        handleOpenWindow={handleOpenWindow}
        windowZIndex={windowZIndex}
      />
    </div>
  );
}

export default App;
