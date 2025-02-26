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
import NavBar from './components/navBar';
import TopMenuBar from './components/TopMenuBar';
import './App.css';
import './styles/darkMode.css'; // Import the dark mode styles
import './styles/desktop.css'; // Import the desktop styles for help button and help box

function App() {
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
    '/flappydunk': false
  });
  
  // Add state for help box
  const [showHelpBox, setShowHelpBox] = useState(false);
  
  // Toggle help box function
  const toggleHelpBox = () => {
    setShowHelpBox(!showHelpBox);
  };
  
  // Track open windows - initialize all as closed
  const [openWindows, setOpenWindows] = useState({
    '/': false,
    '/skills': false,
    '/proficiency': false,
    '/experience': false,
    '/education': false,
    '/projects': false,
    '/flappydunk': false
  });
  
  // Track z-index for each window
  const [windowZIndex, setWindowZIndex] = useState({
    '/': 10,
    '/skills': 11,
    '/proficiency': 12,
    '/experience': 13,
    '/education': 14,
    '/projects': 15,
    '/flappydunk': 16
  });
  
  // Track window positions - initialize with centered positions
  // We'll use null to indicate that the window should be centered on first open
  const [windowPositions, setWindowPositions] = useState({
    '/': null,
    '/skills': null,
    '/proficiency': null,
    '/experience': null,
    '/education': null,
    '/projects': null,
    '/flappydunk': null
  });
  
  // Current highest z-index
  const [highestZIndex, setHighestZIndex] = useState(16);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Add a useEffect to log the loading state
  useEffect(() => {
    console.log("Current loading state:", isLoading);
  }, [isLoading]);
  
  // Handle loading complete
  const handleLoadingComplete = () => {
    console.log("Loading complete called");
    
    // Ensure loading screen shows for at least 3 seconds
    const currentTime = Date.now();
    const timeElapsed = currentTime - loadingStartTime;
    const minimumLoadingTime = 3000; // 3 seconds minimum
    
    if (timeElapsed < minimumLoadingTime) {
      const remainingTime = minimumLoadingTime - timeElapsed;
      console.log(`Waiting ${remainingTime}ms before completing loading`);
      
      setTimeout(() => {
        console.log("Minimum loading time reached, completing loading");
        setIsLoading(false);
        navigate('/desktop', { replace: true });
      }, remainingTime);
    } else {
      console.log("Minimum loading time already elapsed, completing loading immediately");
      setIsLoading(false);
      navigate('/desktop', { replace: true });
    }
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
  
  // Add a debounce ref to prevent multiple window opens
  const isNavigating = useRef(false);
  const navigationTimeout = useRef(null);
  
  // Handle window opening with debouncing
  const handleOpenWindow = (path) => {
    console.log(`Opening window: ${path}`);
    
    // If already navigating, cancel
    if (isNavigating.current) {
      console.log("Navigation already in progress, ignoring request");
      return;
    }
    
    // Set navigating flag
    isNavigating.current = true;
    
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
    
    // Clear navigation flag after a short delay
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
    }
    
    navigationTimeout.current = setTimeout(() => {
      isNavigating.current = false;
    }, 500); // Prevent new navigation for 500ms
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
      
      // Skip if already navigating
      if (isNavigating.current) {
        console.log("Navigation already in progress, skipping effect");
        return;
      }
      
      // Set navigating flag
      isNavigating.current = true;
      
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
      
      // Clear navigation flag after a short delay
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      
      navigationTimeout.current = setTimeout(() => {
        isNavigating.current = false;
      }, 500); // Prevent new navigation for 500ms
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
                <li><strong>Windows:</strong> Interact with windows by dragging, resizing, minimizing, or closing them.</li>
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
