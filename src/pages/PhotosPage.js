import React, { useState } from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/photosPage.css';
import resumePDF from '../assets/resume.pdf';
import gameIcon from '../assets/icons/game.png';
import terminalIcon from '../assets/icons/terminal.png';
import photosIcon from '../assets/icons/projects.png';

const PhotosPage = ({ isOpen, setIsOpen, onClose, zIndex, onFocus, initialPosition, onPositionChange }) => {
  const [activeFolder, setActiveFolder] = useState('Pictures');
  
  const folders = [
    { id: 'Desktop', name: 'Desktop', icon: '🖥️' },
    { id: 'Downloads', name: 'Downloads', icon: '⬇️' },
    { id: 'Documents', name: 'Documents', icon: '📄' },
    { id: 'Pictures', name: 'Pictures', icon: '🖼️' },
    { id: 'Music', name: 'Music', icon: '🎵' },
    { id: 'Videos', name: 'Videos', icon: '🎥' },
  ];

  const folderContents = {
    'Desktop': [
      { name: 'Flappy Dunk', type: 'app', icon: gameIcon, action: () => window.handleOpenWindow('/flappydunk') },
      { name: 'Terminal', type: 'app', icon: terminalIcon, action: () => window.handleOpenWindow('/terminal') },
      { name: 'Photos', type: 'app', icon: photosIcon, action: () => setActiveFolder('Pictures') },
    ],
    'Downloads': [],
    'Documents': [
      { name: 'resume.pdf', type: 'pdf', icon: '📕', link: resumePDF },
    ],
    'Pictures': [],
    'Music': [],
    'Videos': []
  };

  const currentFiles = folderContents[activeFolder] || [];

  const handleFileClick = (file) => {
    if (file.action) {
      file.action();
    } else if (file.link) {
      window.open(file.link, '_blank');
    } else {
      alert(`Opening ${file.name}... (Feature coming soon)`);
    }
  };

  return (
    <WindowBox
      title={`File Explorer - ${activeFolder}`}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialPosition={initialPosition}
      onPositionChange={onPositionChange}
      width={850}
      height={550}
    >
      <div className="explorer-container">
        {/* Top Toolbar */}
        <div className="explorer-toolbar">
          <div className="nav-buttons">
            <button className="nav-btn" onClick={() => setActiveFolder('Desktop')}>←</button>
            <button className="nav-btn">→</button>
            <button className="nav-btn">↑</button>
          </div>
          <div className="address-bar">
            <span className="folder-icon">📁</span>
            <input type="text" readOnly value={`This PC > ${activeFolder}`} />
            <button className="refresh-btn">↻</button>
          </div>
          <div className="search-bar">
            <input type="text" placeholder={`Search ${activeFolder}`} />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="explorer-menu">
          <span>File</span>
          <span>Home</span>
          <span>Share</span>
          <span>View</span>
        </div>

        <div className="explorer-main">
          {/* Sidebar */}
          <div className="explorer-sidebar">
            <div className="sidebar-section">Quick access</div>
            {folders.map((folder) => (
              <div 
                key={folder.id} 
                className={`sidebar-item ${activeFolder === folder.id ? 'active' : ''}`}
                onClick={() => setActiveFolder(folder.id)}
              >
                <span className="item-icon">{folder.icon}</span>
                <span className="item-name">{folder.name}</span>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="explorer-content">
            {currentFiles.length > 0 ? (
              <div className="content-grid">
                {currentFiles.map((file, index) => (
                  <div key={index} className="file-item" onDoubleClick={() => handleFileClick(file)}>
                    <div className="file-icon">
                      <div className={`file-visual ${file.type}`}>
                        {typeof file.icon === 'string' && file.icon.length > 2 ? (
                          <img src={file.icon} alt={file.name} className="file-icon-img" />
                        ) : (
                          <span className="file-emoji">{file.icon}</span>
                        )}
                      </div>
                    </div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-folder">
                <p>This folder is empty.</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="explorer-status">
          <span>{currentFiles.length} items</span>
        </div>
      </div>
    </WindowBox>
  );
};

export default PhotosPage;
