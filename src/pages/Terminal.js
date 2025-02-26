import React, { useRef, useEffect, useState } from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/terminal.css';

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
          { type: 'output', content: '  date - Display current date and time' }
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
        
      case '':
        return [];
        
      default:
        return [{ type: 'error', content: `Command not found: ${command}` }];
    }
  };

  // Handle command submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the command to output
    const newOutput = [
      ...output,
      { type: 'command', content: `${currentDirectory} $ ${input}` }
    ];
    
    // Execute the command and get results
    const results = executeCommand(input);
    
    // Update the output state
    if (results === null) {
      // If clear command was executed, don't add anything to output
      // Output is already cleared by setOutput([]) in executeCommand
    } else {
      // For other commands, update with results
      setOutput([...newOutput, ...(results || [])]);
    }
    
    // Clear the input
    setInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 0);
  };

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const inputElement = document.querySelector('.terminal-input');
        if (inputElement) {
          inputElement.focus();
        }
      }, 100);
    }
  }, [isOpen]);
  
  return (
    <WindowBox 
      title="Terminal" 
      isOpen={isOpen} 
      setIsOpen={setIsOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialPosition={initialPosition}
      onPositionChange={onPositionChange}
      width={700}
      height={500}
    >
      <div className="terminal-container" ref={terminalRef}>
        <div className="terminal-content">
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
        </div>
      </div>
    </WindowBox>
  );
};

export default Terminal;
