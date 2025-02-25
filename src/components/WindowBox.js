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
  initialPosition = null,
  onPositionChange,
  isLoading = false
}) => {
  console.log(`WindowBox ${title} rendering, isOpen:`, isOpen);
  
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef(null);
  const prevPositionRef = useRef(position);
  const hasBeenCentered = useRef(false);
  
  // Center window on first render or when initialPosition is null
  useEffect(() => {
    if (windowRef.current && (!hasBeenCentered.current || initialPosition === null)) {
      const windowWidth = windowRef.current.offsetWidth;
      const windowHeight = windowRef.current.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate center position
      const centerX = Math.max(0, (viewportWidth - windowWidth) / 2);
      const centerY = Math.max(0, (viewportHeight - windowHeight) / 4); // Slightly above center
      
      // For loading page, always center it
      if (isLoading || title === "Loading" || initialPosition === null) {
        const newPosition = { x: centerX, y: centerY };
        setPosition(newPosition);
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
        hasBeenCentered.current = true;
      }
    }
  }, [isOpen, initialPosition]);
  
  // Update position when initialPosition changes and is not null
  useEffect(() => {
    if (!isMaximized && initialPosition !== null) {
      setPosition(initialPosition);
    }
  }, [initialPosition, isMaximized]);
  
  // Handle dragging
  const handleMouseDown = (e) => {
    if (onFocus) onFocus();
    
    if (e.target.closest('.window-title-bar') && !e.target.closest('.window-controls')) {
      if (!isMaximized) {
        setIsDragging(true);
        const rect = windowRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      e.preventDefault();
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Ensure window stays within viewport
      const newPosition = {
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      };
      
      setPosition(newPosition);
      prevPositionRef.current = newPosition;
      
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMaximized && onPositionChange) {
      // Restore previous position
      onPositionChange(prevPositionRef.current);
    }
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      ref={windowRef}
      className={`window-box ${isMaximized ? 'maximized' : ''}`} 
      style={{
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 30 : `${position.y}px`,
        zIndex: zIndex
      }}
      onMouseDown={handleMouseDown}
      onClick={onFocus}
    >
      <div className="window-title-bar">
        <div className="window-title">{title}</div>
        <div className="window-controls">
          <button 
            className="window-control minimize"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            −
          </button>
          <button 
            className="window-control maximize"
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
          >
            □
          </button>
          <button 
            className="window-control close"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
          >
            ×
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
