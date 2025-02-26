import React, { useRef, useEffect, useState } from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/terminal.css';
import cheeseburgerGif from '../assets/gif/cheeseburger.gif';
import codeGif from '../assets/gif/code.gif';
import duckGif from '../assets/gif/duck.gif';
import runGif from '../assets/gif/run.gif';
import planetGif from '../assets/gif/planet.gif';

const Terminal = ({ 
  isOpen = false, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  const terminalRef = useRef(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'welcome', content: 'Welcome to Portfolio OS Terminal' },
    { type: 'welcome', content: "Type 'help' to see available commands" },
  ]);
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [currentAnimation, setCurrentAnimation] = useState(null); // Track current animation
  
  // Define available animations
  const animations = [
    { name: 'cheeseburger', gif: cheeseburgerGif, text: 'Mmm, cheeseburger!' },
    { name: 'code', gif: codeGif, text: 'Coding in progress...' },
    { name: 'duck', gif: duckGif, text: 'Quack quack!' },
    { name: 'run', gif: runGif, text: 'Run, run, run!' },
    { name: 'planet', gif: planetGif, text: 'Exploring the cosmos...' }
  ];

  // Function to get a random animation
  const getRandomAnimation = () => {
    const randomIndex = Math.floor(Math.random() * animations.length);
    return animations[randomIndex];
  };

  // Define the file system structure
  const fileSystem = {
    '/': {
      type: 'directory',
      content: ['skills', 'education', 'experience', 'projects', 'about.txt'],
    },
    '/skills': {
      type: 'directory',
      content: ['programming.txt', 'web_development.txt', 'database.txt', 'hardware.txt'],
    },
    '/education': {
      type: 'directory',
      content: ['education.txt'],
    },
    '/experience': {
      type: 'directory',
      content: ['experience.txt'],
    },
    '/projects': {
      type: 'directory',
      content: ['portfolio_os.txt', 'cougar_hacks.txt', 'lotus_wear.txt'],
    },
    '/about.txt': {
      type: 'file',
      content: "I'm Shovan Raut, a software developer passionate about creating intuitive and engaging user experiences. This portfolio showcases my projects and skills in a unique OS-inspired interface."
    },
    '/skills/programming.txt': {
      type: 'file',
      content: "Programming Languages:\n- Python\n- SQL\n- C/C++ (Arduino)"
    },
    '/skills/web_development.txt': {
      type: 'file',
      content: "Web Development:\n- HTML\n- CSS\n- JavaScript\n- React"
    },
    '/skills/database.txt': {
      type: 'file',
      content: "Database Management:\n- Oracle\n- SQLite"
    },
    '/skills/hardware.txt': {
      type: 'file',
      content: "Hardware & IoT:\n- Arduino"
    },
    '/education/education.txt': {
      type: 'file',
      content: "Education:\n- Caldwell University\n  Computer Science, 2022-Present\n- Kathmandu Model College\n  Computer Science, 2018-2020"
    },
    '/experience/experience.txt': {
      type: 'file',
      content: "Experience:\n\n1. CogAI\n   Research Assistant (Part time) (Sep 2023 - Current)\n   Designed and implemented experiments to evaluate the impact of backpropagation on CNN performance. Worked on a device enhancing mobility and environmental awareness for visually impaired individuals.\n\n2. STEM Advance Project\n   Summer Researcher (May 2024 - August 2024)\n   Conducted research as part of the STEM Advance Project at Caldwell, New Jersey, focusing on innovative solutions and technological advancements.\n\n3. South Dakota Science Olympiad\n   Media Analyst (Sep 2022 - Dec 2022)\n   Built a website for the science Olympiad team. Managed social media accounts.\n\n4. E Automations\n   Junior Developer (Jan 2022 - Jul 2022)\n   Automated data import to a database built in Visual Basic. Developed a SaaS framework."
    },
    '/projects/portfolio_os.txt': {
      type: 'file',
      content: "Portfolio OS:\nA creative portfolio website designed to mimic an operating system interface. Built with React.js, CSS3, and JavaScript."
    },
    '/projects/cougar_hacks.txt': {
      type: 'file',
      content: "Cougar Hacks:\nA hackathon website. Visit: https://www.cougarhacks.com/"
    },
    '/projects/lotus_wear.txt': {
      type: 'file',
      content: "Lotus Wear:\nAn e-commerce platform. Visit: https://lotus-wear-f372053a3005.herokuapp.com/"
    }
  };

  // Function to handle command execution
  const executeCommand = (cmd) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    switch(command) {
      case 'help':
        return [
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '  help - Show this help message' },
          { type: 'output', content: '  ls, dir - List directory contents' },
          { type: 'output', content: '  cd [directory] - Change directory' },
          { type: 'output', content: '  cat, type [file] - Display file contents' },
          { type: 'output', content: '  pwd - Print working directory' },
          { type: 'output', content: '  clear - Clear the terminal' },
          { type: 'output', content: '  whoami - Display user information' },
          { type: 'output', content: '  date - Display current date and time' },
          { type: 'output', content: '  animation - Show a random animation' },
          { type: 'output', content: '  shutdown - Shutdown the system' },
          { type: 'output', content: '  refresh - Refresh the page' }
        ];
        
      case 'ls':
      case 'dir':
        if (fileSystem[currentDirectory]) {
          const contents = fileSystem[currentDirectory].content;
          return [
            { type: 'output', content: `Contents of ${currentDirectory}:` },
            ...contents.map(item => {
              const path = currentDirectory === '/' ? `/${item}` : `${currentDirectory}/${item}`;
              const isDir = fileSystem[path] && fileSystem[path].type === 'directory';
              return { 
                type: 'output', 
                content: `  ${item}${isDir ? '/' : ''}` 
              };
            })
          ];
        } else {
          return [{ type: 'error', content: `Directory not found: ${currentDirectory}` }];
        }
        
      case 'cd':
        if (args.length < 2) {
          setCurrentDirectory('/');
          return [{ type: 'output', content: 'Changed to root directory' }];
        }
        
        let newPath;
        if (args[1] === '..') {
          // Go up one directory
          if (currentDirectory === '/') {
            return [{ type: 'output', content: 'Already at root directory' }];
          }
          const parts = currentDirectory.split('/').filter(Boolean);
          parts.pop();
          newPath = parts.length === 0 ? '/' : '/' + parts.join('/');
        } else if (args[1].startsWith('/')) {
          // Absolute path
          newPath = args[1];
        } else {
          // Relative path
          newPath = currentDirectory === '/' ? `/${args[1]}` : `${currentDirectory}/${args[1]}`;
        }
        
        // Remove trailing slash if not root
        if (newPath !== '/' && newPath.endsWith('/')) {
          newPath = newPath.slice(0, -1);
        }
        
        if (fileSystem[newPath] && fileSystem[newPath].type === 'directory') {
          setCurrentDirectory(newPath);
          return [{ type: 'output', content: `Changed to ${newPath}` }];
        } else {
          return [{ type: 'error', content: `Directory not found: ${newPath}` }];
        }
        
      case 'cat':
      case 'type':
        if (args.length < 2) {
          return [{ type: 'error', content: 'Usage: cat [file]' }];
        }
        
        let filePath;
        if (args[1].startsWith('/')) {
          // Absolute path
          filePath = args[1];
        } else {
          // Relative path
          filePath = currentDirectory === '/' ? `/${args[1]}` : `${currentDirectory}/${args[1]}`;
        }
        
        if (fileSystem[filePath] && fileSystem[filePath].type === 'file') {
          const content = fileSystem[filePath].content;
          return content.split('\n').map(line => ({ type: 'output', content: line }));
        } else {
          return [{ type: 'error', content: `File not found: ${filePath}` }];
        }
        
      case 'pwd':
        return [{ type: 'output', content: currentDirectory }];
        
      case 'clear':
        // Completely clear the output array instead of just setting it to an empty array in the return
        setOutput([]);
        return null; // Return null instead of an empty array
        
      case 'whoami':
        return [{ type: 'output', content: 'Shovan Raut - Software Developer' }];
        
      case 'date':
        return [{ type: 'output', content: new Date().toString() }];
        
      case 'animation':
        const randomAnim = getRandomAnimation();
        setCurrentAnimation(randomAnim);
        return [{ type: 'output', content: randomAnim.text }];
        
      case 'shutdown':
        return [
          { type: 'output', content: 'Initiating system shutdown...' },
          { type: 'output', content: 'Please wait while the system shuts down.' }
        ].concat(initiateShutdown());
        
      case 'refresh':
        return [
          { type: 'output', content: 'Refreshing page...' }
        ].concat(refreshPage());
        
      case '':
        return [];
        
      default:
        return [{ type: 'error', content: `Command not found: ${command}` }];
    }
  };

  // Function to initiate system shutdown
  const initiateShutdown = () => {
    console.log("Initiating shutdown sequence");
    
    // Close all open windows if the global function exists
    if (window.closeAllWindows) {
      window.closeAllWindows();
    }
    
    // Create a shutdown screen with the same design as ShutdownScreen.js
    setTimeout(() => {
      // Check if dark mode is enabled
      const isDarkMode = document.body.classList.contains('dark-mode');
      
      // Create the main container
      const shutdownScreen = document.createElement('div');
      shutdownScreen.className = 'shutdown-screen';
      shutdownScreen.style.position = 'fixed';
      shutdownScreen.style.top = '0';
      shutdownScreen.style.left = '0';
      shutdownScreen.style.width = '100%';
      shutdownScreen.style.height = '100%';
      shutdownScreen.style.zIndex = '10000';
      
      // Set background image based on dark mode
      shutdownScreen.style.backgroundImage = isDarkMode ? 
        'url(/assets/images/dark.jpg)' : 
        'url(/assets/images/windows.jpg)';
      shutdownScreen.style.backgroundSize = 'cover';
      shutdownScreen.style.backgroundPosition = 'center';
      shutdownScreen.style.backgroundRepeat = 'no-repeat';
      
      // Create the overlay
      const overlay = document.createElement('div');
      overlay.className = 'shutdown-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      overlay.style.backdropFilter = 'blur(10px)';
      overlay.style.WebkitBackdropFilter = 'blur(10px)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.animation = 'fadeIn 0.5s ease-out forwards';
      
      // Create the content container
      const content = document.createElement('div');
      content.className = 'shutdown-content';
      content.style.textAlign = 'center';
      content.style.color = 'white';
      content.style.maxWidth = '500px';
      content.style.padding = '20px';
      content.style.backgroundColor = 'transparent';
      content.style.borderRadius = '10px';
      content.style.zIndex = '10000';
      
      // Create the title
      const title = document.createElement('h1');
      title.className = 'shutdown-title';
      title.textContent = 'Shutting Down';
      title.style.fontSize = '2.5rem';
      title.style.marginBottom = '30px';
      title.style.fontWeight = '300';
      title.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.8)';
      title.style.color = 'white';
      
      // Create the progress container
      const progressContainer = document.createElement('div');
      progressContainer.className = 'shutdown-progress-container';
      progressContainer.style.position = 'relative';
      progressContainer.style.margin = '0 auto';
      progressContainer.style.width = '120px';
      progressContainer.style.height = '120px';
      
      // Create SVG for circular progress
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("class", "circular-progress-circle");
      svg.setAttribute("viewBox", "0 0 120 120");
      svg.style.width = '100%';
      svg.style.height = '100%';
      
      // Create background circle
      const bgCircle = document.createElementNS(svgNS, "circle");
      bgCircle.setAttribute("class", "circular-progress-background");
      bgCircle.setAttribute("cx", "60");
      bgCircle.setAttribute("cy", "60");
      bgCircle.setAttribute("r", "54");
      bgCircle.style.fill = 'none';
      bgCircle.style.stroke = 'rgba(255, 255, 255, 0.2)';
      bgCircle.style.strokeWidth = '8px';
      
      // Create progress circle
      const progressCircle = document.createElementNS(svgNS, "circle");
      progressCircle.setAttribute("class", "circular-progress-value");
      progressCircle.setAttribute("cx", "60");
      progressCircle.setAttribute("cy", "60");
      progressCircle.setAttribute("r", "54");
      progressCircle.style.fill = 'none';
      progressCircle.style.strokeWidth = '8px';
      progressCircle.style.stroke = '#0078d7';
      progressCircle.style.strokeDasharray = '339.292';
      progressCircle.style.strokeDashoffset = '339.292';
      progressCircle.style.transition = 'stroke-dashoffset 0.1s linear';
      
      // Create rotation group
      const rotationGroup = document.createElementNS(svgNS, "g");
      rotationGroup.setAttribute("class", "circular-progress-rotation");
      rotationGroup.style.animation = 'rotate 2s linear infinite';
      rotationGroup.style.transformOrigin = 'center';
      
      // Create dot in rotation group
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", "60");
      dot.setAttribute("cy", "6");
      dot.setAttribute("r", "4");
      dot.setAttribute("fill", "#0078d7");
      
      // Create progress text
      const progressText = document.createElement('div');
      progressText.className = 'circular-progress-text';
      progressText.style.position = 'absolute';
      progressText.style.top = '50%';
      progressText.style.left = '50%';
      progressText.style.transform = 'translate(-50%, -50%)';
      progressText.style.fontSize = '1.5rem';
      progressText.style.fontWeight = '500';
      progressText.style.color = '#fff';
      progressText.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
      progressText.textContent = '0%';
      
      // Create message
      const message = document.createElement('p');
      message.className = 'shutdown-message';
      message.style.fontSize = '1.2rem';
      message.style.color = '#fff';
      message.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
      message.style.marginTop = '20px';
      message.textContent = 'Please wait while the system shuts down...';
      
      // Assemble the elements
      rotationGroup.appendChild(dot);
      svg.appendChild(bgCircle);
      svg.appendChild(progressCircle);
      svg.appendChild(rotationGroup);
      progressContainer.appendChild(svg);
      progressContainer.appendChild(progressText);
      
      content.appendChild(title);
      content.appendChild(progressContainer);
      content.appendChild(message);
      
      overlay.appendChild(content);
      shutdownScreen.appendChild(overlay);
      document.body.appendChild(shutdownScreen);
      
      // Variables to track sound and progress completion
      let soundCompleted = false;
      let progressCompleted = false;
      let audioElement = null;
      
      // Function to complete the shutdown process
      const completeShutdown = () => {
        console.log("Completing shutdown process");
        window.location.reload();
      };
      
      // Try to play shutdown sound with better error handling
      const playShutdownSound = () => {
        try {
          console.log("Attempting to play shutdown sound");
          
          // Create audio element
          audioElement = new Audio('/assets/sounds/shutdown.mp3');
          audioElement.volume = 0.7;
          
          // Add event listener for when sound finishes
          audioElement.addEventListener('ended', () => {
            console.log("Shutdown sound finished playing");
            soundCompleted = true;
            
            // If progress is already complete, finish shutdown
            if (progressCompleted) {
              completeShutdown();
            }
          });
          
          // Play with promise handling
          const playPromise = audioElement.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Shutdown sound playing successfully");
                
                // Set a fallback timer for 5 seconds in case the 'ended' event doesn't fire
                setTimeout(() => {
                  if (!soundCompleted) {
                    console.log("Fallback timer for sound triggered");
                    soundCompleted = true;
                    if (progressCompleted) {
                      completeShutdown();
                    }
                  }
                }, 5000);
              })
              .catch(error => {
                console.error("Error playing shutdown sound:", error);
                // Mark as completed anyway to not block shutdown
                soundCompleted = true;
              });
          }
        } catch (error) {
          console.error("Error with audio setup:", error);
          // Mark as completed anyway to not block shutdown
          soundCompleted = true;
        }
      };
      
      // Try to play the sound
      playShutdownSound();
      
      // Also try again after a short delay (sometimes helps with browser restrictions)
      setTimeout(() => {
        if (!soundCompleted && audioElement === null) {
          console.log("Retrying sound playback after delay");
          playShutdownSound();
        }
      }, 500);
      
      // Add click handler to help trigger sound on some browsers
      shutdownScreen.addEventListener('click', () => {
        if (!soundCompleted && audioElement === null) {
          playShutdownSound();
        }
      });
      
      // Animate the progress
      let progress = 0;
      const circumference = 2 * Math.PI * 54; // 2πr where r is 54
      
      const progressInterval = setInterval(() => {
        progress += 2.5; // Increase by 2.5% each time
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          progressCompleted = true;
          
          // Only complete shutdown if sound has finished
          if (soundCompleted) {
            completeShutdown();
          } else {
            console.log("Progress complete, waiting for sound to finish");
          }
          
          return;
        }
        
        // Update the progress circle
        const strokeDashoffset = circumference - (progress * circumference / 100);
        progressCircle.style.strokeDashoffset = strokeDashoffset;
        
        // Update the progress text
        progressText.textContent = `${Math.floor(progress)}%`;
      }, 100); // 10 updates per second
      
      // Absolute fallback timer - 10 seconds max for the entire shutdown process
      setTimeout(() => {
        console.log("Absolute fallback timer triggered - forcing shutdown");
        clearInterval(progressInterval);
        completeShutdown();
      }, 10000);
      
    }, 500);
    
    return [];
  };

  // Function to refresh the page
  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    return [];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the command to the output
    const newOutput = [...output, { type: 'command', content: `${currentDirectory} $ ${input}` }];
    
    // Execute the command and get the result
    const result = executeCommand(input);
    
    // Update the output with the result
    if (result) {
      setOutput([...newOutput, ...result]);
    } else {
      setOutput(newOutput);
    }
    
    // Clear the input
    setInput('');
    
    // Scroll to the bottom of the terminal
    if (terminalRef.current) {
      setTimeout(() => {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }, 0);
    }
  };

  // Add event listener for ESC key to close animations
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && currentAnimation) {
        setCurrentAnimation(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentAnimation]);

  // Auto-focus the input when the terminal is opened
  useEffect(() => {
    if (isOpen && terminalRef.current) {
      const inputElement = terminalRef.current.querySelector('.terminal-input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [isOpen]);

  return (
    <WindowBox 
      title="Terminal" 
      isOpen={isOpen} 
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialPosition={initialPosition}
      onPositionChange={onPositionChange}
      width={600}
      height={500}
    >
      <div className="terminal-container" ref={terminalRef}>
        <div className="terminal-content">
          {currentAnimation && (
            <div className="animation-container">
              <img 
                src={currentAnimation.gif} 
                alt={currentAnimation.name} 
                className="animation-gif" 
              />
              <p className="animation-text">Press ESC to close</p>
            </div>
          )}
          
          {!currentAnimation && (
            <>
              <div className="terminal-output">
                {output.map((line, index) => (
                  <p key={index} className={`terminal-line ${line.type}`}>{line.content}</p>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="terminal-input-line">
                <span className="terminal-prompt">{currentDirectory} $ </span>
                <input 
                  type="text" 
                  className="terminal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                />
              </form>
            </>
          )}
        </div>
      </div>
    </WindowBox>
  );
};

export default Terminal;













