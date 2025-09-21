import React, { useRef, useEffect, useState } from 'react';
import { Users, Settings, Play, Square } from 'lucide-react';

// Types
interface Player {
  id: string;
  x: number;
  y: number;
  color: 'red' | 'blue';
  name: string;
  isMoving: boolean;
  direction: string;
}

interface GameState {
  isConnected: boolean;
  playerId: string;
  players: { [id: string]: Player };
  gameStarted: boolean;
  selectedColor: 'red' | 'blue' | null;
  playerName: string;
}

// Simulasi WebSocket untuk multiplayer
class GameConnection {
  private listeners: { [key: string]: Function[] } = {};
  private players: { [id: string]: Player } = {};
  
  constructor() {
    // Simulasi koneksi
    setTimeout(() => {
      this.emit('connected');
    }, 1000);
    
    // Simulasi pemain lain yang bergerak random
    setInterval(() => {
      Object.values(this.players).forEach(player => {
        if (Math.random() < 0.1) { // 10% chance to move
          const directions = ['up', 'down', 'left', 'right'];
          const direction = directions[Math.floor(Math.random() * directions.length)];
          const speed = 3;
          
          let newX = player.x;
          let newY = player.y;
          
          switch(direction) {
            case 'up': newY = Math.max(50, player.y - speed); break;
            case 'down': newY = Math.min(350, player.y + speed); break;
            case 'left': newX = Math.max(50, player.x - speed); break;
            case 'right': newX = Math.min(750, player.x + speed); break;
          }
          
          this.players[player.id] = { ...player, x: newX, y: newY };
          this.emit('player_moved', { playerId: player.id, x: newX, y: newY });
        }
      });
    }, 200);
  }
  
  on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  
  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  send(type: string, data: any) {
    console.log('Sending:', type, data);
    
    switch(type) {
      case 'join_game':
        const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
        const player: Player = {
          id: playerId,
          x: Math.random() * 700 + 50,
          y: Math.random() * 300 + 50,
          color: data.color,
          name: data.name,
          isMoving: false,
          direction: 'down'
        };
        
        this.players[playerId] = player;
        
        // Add some other random players
        if (Object.keys(this.players).length === 1) {
          const otherColor = data.color === 'red' ? 'blue' : 'red';
          const otherId = `bot_${Math.random().toString(36).substr(2, 9)}`;
          this.players[otherId] = {
            id: otherId,
            x: Math.random() * 700 + 50,
            y: Math.random() * 300 + 50,
            color: otherColor,
            name: 'Bot Player',
            isMoving: false,
            direction: 'down'
          };
        }
        
        this.emit('game_joined', { playerId, players: this.players });
        break;
        
      case 'move_player':
        if (this.players[data.playerId]) {
          this.players[data.playerId] = {
            ...this.players[data.playerId],
            x: data.x,
            y: data.y,
            isMoving: data.isMoving,
            direction: data.direction
          };
          this.emit('player_moved', data);
        }
        break;
    }
  }
}

const RPGMultiplayerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isConnected: false,
    playerId: '',
    players: {},
    gameStarted: false,
    selectedColor: null,
    playerName: ''
  });
  
  const [gameConnection, setGameConnection] = useState<GameConnection | null>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const PLAYER_SIZE = 30;
  const MOVE_SPEED = 3;

  useEffect(() => {
    const connection = new GameConnection();
    setGameConnection(connection);
    
    connection.on('connected', () => {
      setGameState(prev => ({ ...prev, isConnected: true }));
    });
    
    connection.on('game_joined', (data: { playerId: string; players: { [id: string]: Player } }) => {
      setGameState(prev => ({
        ...prev,
        playerId: data.playerId,
        players: data.players,
        gameStarted: true
      }));
    });
    
    connection.on('player_moved', (data: { playerId: string; x: number; y: number; isMoving: boolean; direction: string }) => {
      setGameState(prev => ({
        ...prev,
        players: {
          ...prev.players,
          [data.playerId]: {
            ...prev.players[data.playerId],
            x: data.x,
            y: data.y,
            isMoving: data.isMoving,
            direction: data.direction
          }
        }
      }));
    });
    
    return () => {
      // Cleanup
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set([...prev, e.key.toLowerCase()]));
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop for player movement
  useEffect(() => {
    if (!gameState.gameStarted || !gameConnection) return;
    
    const gameLoop = setInterval(() => {
      const currentPlayer = gameState.players[gameState.playerId];
      if (!currentPlayer) return;
      
      let newX = currentPlayer.x;
      let newY = currentPlayer.y;
      let direction = currentPlayer.direction;
      let isMoving = false;
      
      if (keys.has('arrowup') || keys.has('w')) {
        newY = Math.max(PLAYER_SIZE/2, currentPlayer.y - MOVE_SPEED);
        direction = 'up';
        isMoving = true;
      }
      if (keys.has('arrowdown') || keys.has('s')) {
        newY = Math.min(CANVAS_HEIGHT - PLAYER_SIZE/2, currentPlayer.y + MOVE_SPEED);
        direction = 'down';
        isMoving = true;
      }
      if (keys.has('arrowleft') || keys.has('a')) {
        newX = Math.max(PLAYER_SIZE/2, currentPlayer.x - MOVE_SPEED);
        direction = 'left';
        isMoving = true;
      }
      if (keys.has('arrowright') || keys.has('d')) {
        newX = Math.min(CANVAS_WIDTH - PLAYER_SIZE/2, currentPlayer.x + MOVE_SPEED);
        direction = 'right';
        isMoving = true;
      }
      
      if (newX !== currentPlayer.x || newY !== currentPlayer.y) {
        gameConnection.send('move_player', {
          playerId: gameState.playerId,
          x: newX,
          y: newY,
          isMoving,
          direction
        });
      }
    }, 16); // ~60 FPS
    
    return () => clearInterval(gameLoop);
  }, [gameState.gameStarted, gameConnection, gameState.playerId, gameState.players, keys]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.gameStarted) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw grid
      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
      
      // Draw players
      Object.values(gameState.players).forEach(player => {
        const isCurrentPlayer = player.id === gameState.playerId;
        
        // Player shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(
          player.x - PLAYER_SIZE/2 + 2,
          player.y - PLAYER_SIZE/2 + 2,
          PLAYER_SIZE,
          PLAYER_SIZE
        );
        
        // Player body
        const color = player.color === 'red' ? '#ef4444' : '#3b82f6';
        ctx.fillStyle = color;
        ctx.fillRect(
          player.x - PLAYER_SIZE/2,
          player.y - PLAYER_SIZE/2,
          PLAYER_SIZE,
          PLAYER_SIZE
        );
        
        // Current player highlight
        if (isCurrentPlayer) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.strokeRect(
            player.x - PLAYER_SIZE/2 - 2,
            player.y - PLAYER_SIZE/2 - 2,
            PLAYER_SIZE + 4,
            PLAYER_SIZE + 4
          );
        }
        
        // Player name
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          isCurrentPlayer ? `${player.name} (You)` : player.name,
          player.x,
          player.y - PLAYER_SIZE/2 - 8
        );
        
        // Movement indicator
        if (player.isMoving) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(player.x, player.y, PLAYER_SIZE/2 + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    };
    
    const animationLoop = () => {
      render();
      requestAnimationFrame(animationLoop);
    };
    
    animationLoop();
  }, [gameState.players, gameState.playerId, gameState.gameStarted]);

  const joinGame = () => {
    if (gameConnection && gameState.selectedColor && gameState.playerName.trim()) {
      gameConnection.send('join_game', {
        color: gameState.selectedColor,
        name: gameState.playerName.trim()
      });
    }
  };

  const checkPlayersNear = (): boolean => {
    const currentPlayer = gameState.players[gameState.playerId];
    if (!currentPlayer) return false;
    
    return Object.values(gameState.players).some(player => {
      if (player.id === gameState.playerId) return false;
      const distance = Math.sqrt(
        Math.pow(player.x - currentPlayer.x, 2) + 
        Math.pow(player.y - currentPlayer.y, 2)
      );
      return distance < PLAYER_SIZE * 1.5;
    });
  };

  if (!gameState.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Connecting to Server...</h2>
          <p className="text-white/80">Please wait while we establish connection</p>
        </div>
      </div>
    );
  }

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">🎮 RPG Multiplayer</h1>
            <p className="text-white/80">Choose your character and join the world</p>
          </div>
          
          {/* Player Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Player Name</label>
            <input
              type="text"
              value={gameState.playerName}
              onChange={(e) => setGameState(prev => ({ ...prev, playerName: e.target.value }))}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60"
              maxLength={12}
            />
          </div>
          
          {/* Color Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-4">Choose Your Color</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setGameState(prev => ({ ...prev, selectedColor: 'red' }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  gameState.selectedColor === 'red'
                    ? 'border-red-500 bg-red-500/20'
                    : 'border-white/30 hover:border-red-500/50'
                }`}
              >
                <div className="w-12 h-12 bg-red-500 rounded mx-auto mb-2"></div>
                <div className="text-sm font-medium">Red Player</div>
              </button>
              
              <button
                onClick={() => setGameState(prev => ({ ...prev, selectedColor: 'blue' }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  gameState.selectedColor === 'blue'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/30 hover:border-blue-500/50'
                }`}
              >
                <div className="w-12 h-12 bg-blue-500 rounded mx-auto mb-2"></div>
                <div className="text-sm font-medium">Blue Player</div>
              </button>
            </div>
          </div>
          
          {/* Join Button */}
          <button
            onClick={joinGame}
            disabled={!gameState.selectedColor || !gameState.playerName.trim()}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Play className="w-5 h-5" />
            <span>Join Game</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 text-white">
          <div>
            <h1 className="text-3xl font-bold">🎮 RPG Multiplayer World</h1>
            <p className="text-white/80">Use WASD or Arrow Keys to move</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{Object.keys(gameState.players).length} Players Online</span>
            </div>
            
            {checkPlayersNear() && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-3 py-1 text-yellow-200">
                💫 Player Nearby!
              </div>
            )}
          </div>
        </div>
        
        {/* Game Canvas */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-white/20 rounded-lg mx-auto block bg-gray-800"
          />
        </div>
        
        {/* Player List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Square className="w-4 h-4" />
              <span>Online Players</span>
            </h3>
            <div className="space-y-2">
              {Object.values(gameState.players).map(player => (
                <div
                  key={player.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    player.id === gameState.playerId
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'bg-white/5'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded ${
                      player.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <span className="text-white">
                    {player.name}
                    {player.id === gameState.playerId && ' (You)'}
                  </span>
                  {player.isMoving && (
                    <span className="text-green-400 text-sm">Moving</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Game Controls</span>
            </h3>
            <div className="space-y-2 text-white/80 text-sm">
              <div>• Use <kbd className="bg-white/20 px-2 py-1 rounded">WASD</kbd> or Arrow Keys to move</div>
              <div>• Move close to other players to interact</div>
              <div>• Your character has a golden outline</div>
              <div>• Explore the world and meet other players!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPGMultiplayerGame;