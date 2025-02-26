import React, { useState, useEffect, useRef } from 'react';
import '../styles/windowBox.css';

const WindowBox = ({ 
  title, 
  children, 
  isOpen = true, 
  setIsOpen, 
  onClose, 
  zIndex = 10, 
  onFocus,
  width = 800,
  height = 600,
  initialPosition,
  onPositionChange,
  isLoading = false
}) => {
  // Initialize position with a default value to prevent undefined errors
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [animationState, setAnimationState] = useState(isOpen ? 'open' : 'minimized');
  const windowRef = useRef(null);
  const navbarRef = useRef(null);
  const lastValidPosition = useRef(position);
  const hasBeenCentered = useRef(false);
  // Add a flag to track if position change is from user dragging or programmatic
  const isUserDragging = useRef(false);

  // Find the navbar element to use as animation target
  useEffect(() => {
    navbarRef.current = document.querySelector('.navbar');
  }, []);

  // Center window on first render or when initialPosition is null
  useEffect(() => {
    // Always center the loading window immediately when component mounts
    if (windowRef.current && (isLoading || title === "Loading")) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate center position
      const centerX = Math.max(0, (viewportWidth - width) / 2);
      const centerY = Math.max(0, (viewportHeight - height) / 2); // Perfectly centered vertically
      
      const newPosition = { x: centerX, y: centerY };
      setPosition(newPosition);
      lastValidPosition.current = newPosition;
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
      hasBeenCentered.current = true;
      return;
    }
    
    // For other windows, center only if not centered yet or initialPosition is null
    if (windowRef.current && (!hasBeenCentered.current || initialPosition === null)) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate center position
      const centerX = Math.max(0, (viewportWidth - width) / 2);
      const centerY = Math.max(0, (viewportHeight - height) / 4); // Slightly above center
      
      if (initialPosition === null) {
        const newPosition = { x: centerX, y: centerY };
        setPosition(newPosition);
        lastValidPosition.current = newPosition;
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
        hasBeenCentered.current = true;
      }
    }
  }, [isOpen, initialPosition, onPositionChange, isLoading, title, width, height]);

  // Handle animation states when isOpen changes
  useEffect(() => {
    // Skip animations if the user is currently dragging
    if (isUserDragging.current) {
      return;
    }
    
    // Use a ref to track the current animation
    const animationRef = { current: null };
    
    if (isOpen) {
      // Skip animation if window is already open
      if (animationState === 'open') {
        return;
      }
      
      // Calculate starting position near the navbar
      const startPosition = getNavbarPosition();
      
      // Set initial position for animation
      setPosition(startPosition);
      
      // Start opening animation
      setAnimationState('opening');
      
      // After a small delay, set to open state
      animationRef.current = setTimeout(() => {
        // Check if component is still mounted
        if (windowRef.current) {
          setAnimationState('open');
          // Reset to proper position after animation
          if (!isMaximized && initialPosition) {
            setPosition(initialPosition);
            lastValidPosition.current = initialPosition;
          } else if (!isMaximized && !hasBeenCentered.current) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const centerPosition = { 
              x: Math.max(0, (viewportWidth - width) / 2), 
              y: Math.max(0, (viewportHeight - height) / 4)
            };
            setPosition(centerPosition);
            lastValidPosition.current = centerPosition;
            hasBeenCentered.current = true;
          }
        }
      }, 300); // Delay to ensure animation completes
    } else {
      // Start minimizing animation
      if (animationState === 'open') {
        // Calculate end position near the navbar
        const endPosition = getNavbarPosition();
        
        // Set position for animation
        setPosition(endPosition);
        
        // Start minimizing animation
        setAnimationState('minimizing');
        
        // After animation completes, set to minimized
        animationRef.current = setTimeout(() => {
          if (windowRef.current) {
            setAnimationState('minimized');
          }
        }, 300);
      }
    }
    
    // Cleanup function to cancel any pending animations
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isOpen, initialPosition, isMaximized, width, height]);

  // Get position near the navbar for animations
  const getNavbarPosition = () => {
    if (navbarRef.current) {
      const navbarRect = navbarRef.current.getBoundingClientRect();
      // Position near the center of the navbar
      return {
        x: navbarRect.left + navbarRect.width / 2 - 50,
        y: navbarRect.top - 50
      };
    }
    // Fallback position
    return { x: window.innerWidth / 2, y: 0 };
  };

  // Update parent component when position changes
  useEffect(() => {
    if (onPositionChange && !isDragging && animationState === 'open') {
      onPositionChange(position);
    }
  }, [position, isDragging, animationState, onPositionChange]);

  // Update position when initialPosition changes and is not null
  useEffect(() => {
    // Skip if user is currently dragging
    if (isUserDragging.current) {
      return;
    }
    
    if (!isMaximized && initialPosition !== null && initialPosition !== undefined && animationState === 'open') {
      setPosition(initialPosition);
      lastValidPosition.current = initialPosition;
    }
  }, [initialPosition, isMaximized, animationState]);

  const handleMouseDown = (e) => {
    // Prevent dragging when clicking on window controls
    if (e.target.closest('.window-controls')) {
      return;
    }
    
    if (onFocus) onFocus();
    
    // Only allow dragging when window is fully open
    if (animationState !== 'open' || isMaximized) {
      return;
    }
    
    if (e.target.closest('.window-title-bar')) {
      setIsDragging(true);
      isUserDragging.current = true; // Set the user dragging flag
      const rect = windowRef.current.getBoundingClientRect();
      
      // Store the drag offset - where in the title bar the user clicked
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // Add dragging class immediately to prevent transition animations
      document.body.classList.add('dragging');
      
      // Prevent text selection during drag
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Ensure window stays within viewport
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - 50; // Allow some overflow at bottom
      
      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      };
      
      // Update position
      setPosition(newPosition);
      lastValidPosition.current = newPosition;
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.classList.remove('dragging');
      
      if (onPositionChange) {
        onPositionChange(position);
      }
      
      // Reset the user dragging flag after a short delay
      // This ensures any position updates that happen immediately after
      // don't trigger animations
      setTimeout(() => {
        isUserDragging.current = false;
      }, 100);
    }
  };

  // Add and remove event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('dragging');
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('dragging');
    };
  }, [isDragging, position]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleMinimize = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const handleMaximize = () => {
    // Toggle maximized state
    setIsMaximized(prevState => !prevState);
    
    // When maximizing, save current position first
    if (!isMaximized) {
      // Save current position before maximizing
      lastValidPosition.current = { ...position };
      
      // Bring window to front when maximizing
      if (onFocus) {
        onFocus();
      }
    } else {
      // Restore position after un-maximizing
      setPosition(lastValidPosition.current);
      if (onPositionChange) {
        onPositionChange(lastValidPosition.current);
      }
    }
  };

  // Don't render if minimized and animation completed
  if (animationState === 'minimized' && !isOpen) {
    return null;
  }

  // Ensure position is always a valid object with x and y properties
  const safePosition = position || { x: 0, y: 0 };

  return (
    <div
      ref={windowRef}
      className={`window-box ${isMaximized ? 'maximized' : ''} ${animationState} ${isDragging ? 'dragging' : ''}`}
      style={{
        width: isMaximized ? '100%' : width,
        height: isMaximized ? 'calc(100vh - 60px)' : height,
        left: isMaximized ? 0 : safePosition.x,
        top: isMaximized ? 30 : safePosition.y,
        zIndex: zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onClick={onFocus}
    >
      <div 
        className="window-title-bar"
        onMouseDown={handleMouseDown}
        style={{ cursor: isMaximized ? 'default' : 'move' }}
      >
        <div className="window-title">{title}</div>
        <div className="window-controls">
          <button className="window-button minimize" onClick={handleMinimize}>
            <span>_</span>
          </button>
          <button className="window-button maximize" onClick={handleMaximize}>
            <span>□</span>
          </button>
          <button className="window-button close" onClick={handleClose}>
            <span>×</span>
          </button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default WindowBox;
