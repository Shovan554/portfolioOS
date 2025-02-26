import React, { useState, useEffect } from 'react';
import '../styles/desktopIcon.css';

const DesktopIcon = ({ icon, title, onClick, position = { x: 20, y: 20 } }) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Update position if the prop changes
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const handleMouseDown = (e) => {
    // Prevent default to avoid text selection during drag
    e.preventDefault();
    
    // Calculate the offset of the mouse position relative to the icon position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    // Add event listeners for mouse move and mouse up
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Calculate new position based on mouse position and drag offset
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Update position
    setCurrentPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div 
      className="desktop-icon"
      style={{
        position: 'absolute',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 10 // Ensure it's above the desktop background
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="icon-image">
        <img src={icon} alt={title} />
      </div>
      <div className="icon-title">{title}</div>
    </div>
  );
};

export default DesktopIcon;
