import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/hackathonPopup.css';

const HackathonPopup = ({ 
  title, 
  description,
  github,
  isOpen = false, 
  onClose, 
  zIndex = 9999
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [animationState, setAnimationState] = useState(isOpen ? 'open' : 'closed');
  const [isVisible, setIsVisible] = useState(false);
  const windowRef = useRef(null);
  const hasBeenCentered = useRef(false);

  const width = 700;
  const height = 450;

  useEffect(() => {
    if (windowRef.current && !hasBeenCentered.current) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const centerX = Math.max(0, (viewportWidth - width) / 2);
      const centerY = Math.max(0, (viewportHeight - height) / 2);
      
      const newPosition = { x: centerX, y: centerY };
      setPosition(newPosition);
      hasBeenCentered.current = true;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setAnimationState('opening');
      
      const visibilityTimer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      const timer = setTimeout(() => {
        if (windowRef.current) {
          setAnimationState('open');
        }
      }, 300);
      
      return () => {
        clearTimeout(visibilityTimer);
        clearTimeout(timer);
      };
    } else {
      setAnimationState('closing');
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        if (windowRef.current) {
          setAnimationState('closed');
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) {
      return;
    }
    
    if (animationState !== 'open') {
      return;
    }
    
    if (e.target.closest('.window-title-bar')) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      document.body.classList.add('dragging');
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - 50;
      
      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      };
      
      setPosition(newPosition);
    }
  }, [isDragging, dragOffset, width]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.classList.remove('dragging');
    }
  }, [isDragging]);

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
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (animationState === 'closed' && !isOpen) {
    return null;
  }

  const safePosition = position || { x: 0, y: 0 };

  return (
    <>
      {isOpen && <div className="hackathon-popup-overlay" onClick={onClose} />}
      <div
        ref={windowRef}
        className={`hackathon-popup-window ${animationState} ${isDragging ? 'dragging' : ''}`}
        style={{
          width: width,
          height: height,
          left: safePosition.x,
          top: safePosition.y,
          zIndex: zIndex,
          cursor: isDragging ? 'grabbing' : 'default',
          visibility: isVisible ? 'visible' : 'hidden'
        }}
      >
        <div 
          className="window-title-bar"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'move' }}
        >
          <div className="window-title">{title}</div>
          <div className="window-controls">
            <button className="window-control close" onClick={onClose}>
              <span>×</span>
            </button>
          </div>
        </div>
        <div className="window-content">
          <div className="hackathon-popup-body">
            <div className="hackathon-description">{description}</div>
            <a 
              href={github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hackathon-github-link"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HackathonPopup;
