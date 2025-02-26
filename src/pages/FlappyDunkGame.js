import React, { useEffect, useRef, useState } from 'react';
import WindowBox from '../components/WindowBox';
import '../styles/flappyDunkGame.css';
import gameIcon from '../assets/icons/game.png'; // Import the game icon to use as the player

const FlappyDunkGame = ({ 
  isOpen = false, 
  setIsOpen, 
  onClose, 
  zIndex, 
  onFocus,
  initialPosition,
  onPositionChange
}) => {
  const canvasRef = useRef(null);
  const gameIconRef = useRef(null);
  const [gameIconLoaded, setGameIconLoaded] = useState(false);
  
  // Preload the game icon
  useEffect(() => {
    const img = new Image();
    img.src = gameIcon;
    img.onload = () => {
      gameIconRef.current = img;
      setGameIconLoaded(true);
    };
  }, []);
  
  // Initialize game when component mounts
  useEffect(() => {
    if (!isOpen || !gameIconLoaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Game variables
    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    let highScore = localStorage.getItem('flappyDunkHighScore') || 0;
    
    // Player variables
    const player = {
      x: canvas.width / 4,
      y: canvas.height / 2,
      width: 40,
      height: 40,
      velocity: 0,
      gravity: 0.1,
      jump: -4
    };
    
    // Obstacle variables
    const obstacles = [];
    const obstacleWidth = 10;
    const gapHeight = 150;
    const obstacleSpacing = 300;
    
    // Create initial obstacles
    function createObstacles() {
      obstacles.length = 0;
      for (let i = 0; i < 3; i++) {
        const x = canvas.width + i * obstacleSpacing;
        const gapY = Math.random() * (canvas.height - gapHeight - 100) + 50;
        obstacles.push({ x, gapY, passed: false });
      }
    }
    
    // Draw player
    function drawPlayer() {
      ctx.drawImage(
        gameIconRef.current,
        player.x - player.width / 2,
        player.y - player.height / 2,
        player.width,
        player.height
      );
    }
    
    // Draw obstacles
    function drawObstacles() {
      obstacles.forEach(obstacle => {
      
        ctx.fillStyle = '#4A90E2';
        ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.gapY);
        
        // Draw bottom obstacle
        ctx.fillRect(
          obstacle.x,
          obstacle.gapY + gapHeight,
          obstacleWidth,
          canvas.height - (obstacle.gapY + gapHeight)
        );
      });
    }
    
    // Draw score
    function drawScore() {
      ctx.font = '24px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, 50);
      ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 80);
    }
    
    // Draw start screen
    function drawStartScreen() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '36px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText('Flappy Dunk', canvas.width / 2, canvas.height / 2 - 50);
      
      ctx.font = '24px Arial';
      ctx.fillText('Click or Press Space to Start', canvas.width / 2, canvas.height / 2);
      
      if (gameOver) {
        ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
      }
    }
    
    // Update game state
    function update() {
      if (!gameStarted || gameOver) return;
      
      // Update player position
      player.velocity += player.gravity;
      player.y += player.velocity;
      
      // Check for collisions with canvas boundaries
      if (player.y - player.height / 2 < 0) {
        player.y = player.height / 2;
        player.velocity = 0;
      }
      
      if (player.y + player.height / 2 > canvas.height) {
        gameOver = true;
        updateHighScore();
      }
      
      // Update obstacles
      obstacles.forEach(obstacle => {
        obstacle.x -= 1.5; // Move obstacles to the left
        
        // Check if player passed through obstacle
        if (!obstacle.passed && player.x > obstacle.x + obstacleWidth) {
          score++;
          obstacle.passed = true;
        }
        
        // Check for collisions with obstacles
        if (
          player.x + player.width / 2 > obstacle.x && 
          player.x - player.width / 2 < obstacle.x + obstacleWidth
        ) {
          // Check if player is within the gap
          if (
            player.y - player.height / 2 < obstacle.gapY || 
            player.y + player.height / 2 > obstacle.gapY + gapHeight
          ) {
            gameOver = true;
            updateHighScore();
          }
        }
      });
      
      // Remove obstacles that are off screen and add new ones
      if (obstacles[0].x < -obstacleWidth) {
        obstacles.shift();
        const lastObstacle = obstacles[obstacles.length - 1];
        const x = lastObstacle.x + obstacleSpacing;
        const gapY = Math.random() * (canvas.height - gapHeight - 100) + 50;
        obstacles.push({ x, gapY, passed: false });
      }
    }
    
    // Update high score
    function updateHighScore() {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyDunkHighScore', highScore);
      }
    }
    
    // Game loop
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawObstacles();
      drawPlayer();
      drawScore();
      
      if (!gameStarted || gameOver) {
        drawStartScreen();
      } else {
        update();
      }
      
      requestAnimationFrame(gameLoop);
    }
    
    // Handle user input
    function handleInput() {
      if (gameOver) {
        resetGame();
        return;
      }
      
      if (!gameStarted) {
        gameStarted = true;
        return;
      }
      
      player.velocity = player.jump;
    }
    
    // Reset game
    function resetGame() {
      gameStarted = false;
      gameOver = false;
      score = 0;
      player.y = canvas.height / 2;
      player.velocity = 0;
      createObstacles();
    }
    
    // Event listeners
    function handleClick() {
      handleInput();
    }
    
    function handleKeyDown(e) {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent space from scrolling the page
        handleInput();
      }
    }
    
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    
    // Initialize game
    createObstacles();
    gameLoop();
    
    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, gameIconLoaded]);
  
  return (
    <WindowBox 
      title="Flappy Dunk" 
      isOpen={isOpen} 
      setIsOpen={setIsOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialPosition={initialPosition}
      onPositionChange={onPositionChange}
      width={800}
      height={550}
    >
      <div className="flappy-dunk-container">
        <canvas 
          ref={canvasRef} 
          width={760} 
          height={470} 
          className="flappy-dunk-canvas"
        />
      </div>
    </WindowBox>
  );
};

export default FlappyDunkGame;
