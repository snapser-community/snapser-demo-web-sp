import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SnapserManager, User } from '@/services/SnapserManager';

interface Position {
  x: number;
  y: number;
}

interface CarRacingGameProps {
  user: User;
  onLogout: () => void;
}

const CarRacingGame: React.FC<CarRacingGameProps> = ({ user, onLogout }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();

  const [carPosition, setCarPosition] = useState<Position>({ x: 400, y: 300 });
  const [carRotation, setCarRotation] = useState(0);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [lastLapTime, setLastLapTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const keysPressed = useRef<Set<string>>(new Set());
  const startTime = useRef<number>(0);
  const lastLapStartTime = useRef<number>(0);

  // Track dimensions
  const trackCenterX = 400;
  const trackCenterY = 300;
  const trackRadius = 200;
  const trackWidth = 60;

  // Car physics
  const carSpeed = 3;
  const rotationSpeed = 0.05;

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    const userData = await SnapserManager.getUserData(user.id);
    if (userData.fastestThreeLapTime) {
      setBestTime(userData.fastestThreeLapTime);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameFinished, carPosition, carRotation]);

  const gameLoop = () => {
    updateCarPosition();
    checkLapCompletion();
    draw();

    if (gameStarted && !gameFinished) {
      setGameTime(Date.now() - startTime.current);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updateCarPosition = () => {
    let newX = carPosition.x;
    let newY = carPosition.y;
    let newRotation = carRotation;

    if (keysPressed.current.has('a')) {
      newRotation -= rotationSpeed;
    }
    if (keysPressed.current.has('d')) {
      newRotation += rotationSpeed;
    }
    if (keysPressed.current.has('w')) {
      newX += Math.cos(newRotation) * carSpeed;
      newY += Math.sin(newRotation) * carSpeed;
    }
    if (keysPressed.current.has('s')) {
      newX -= Math.cos(newRotation) * carSpeed;
      newY -= Math.sin(newRotation) * carSpeed;
    }

    // Keep car on track (simple collision detection)
    const distanceFromCenter = Math.sqrt(
      Math.pow(newX - trackCenterX, 2) + Math.pow(newY - trackCenterY, 2)
    );

    if (distanceFromCenter > trackRadius + trackWidth/2 || distanceFromCenter < trackRadius - trackWidth/2) {
      // Don't update position if off track
      setCarRotation(newRotation);
      return;
    }

    setCarPosition({ x: newX, y: newY });
    setCarRotation(newRotation);
  };

  const checkLapCompletion = () => {
    // Simple lap detection - check if car crosses start line
    const startLineX = trackCenterX + trackRadius;
    const tolerance = 20;

    if (Math.abs(carPosition.x - startLineX) < tolerance &&
        Math.abs(carPosition.y - trackCenterY) < tolerance) {

      const now = Date.now();
      if (now - lastLapStartTime.current > 3000) { // Prevent multiple triggers
        setLapsCompleted(prev => {
          const newLaps = prev + 1;
          if (newLaps <= 3) {
            const lapTime = now - lastLapStartTime.current;
            setLastLapTime(lapTime);
            lastLapStartTime.current = now;

            if (newLaps === 3) {
              finishRace();
            }
          }
          return newLaps;
        });
      }
    }
  };

  const finishRace = async () => {
    setGameFinished(true);
    const totalTime = Date.now() - startTime.current;

    // Save laps to leaderboard
    await SnapserManager.saveLapsCompleted(user.id, 3);

    // Save best time if it's a new record
    if (!bestTime || totalTime < bestTime) {
      setBestTime(totalTime);
      await SnapserManager.saveFastestTime(user.id, totalTime / 1000);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = trackWidth;
    ctx.beginPath();
    ctx.arc(trackCenterX, trackCenterY, trackRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw track center line
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(trackCenterX, trackCenterY, trackRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw start/finish line
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(trackCenterX + trackRadius - trackWidth/2, trackCenterY - 15);
    ctx.lineTo(trackCenterX + trackRadius + trackWidth/2, trackCenterY + 15);
    ctx.stroke();

    // Draw car
    ctx.save();
    ctx.translate(carPosition.x, carPosition.y);
    ctx.rotate(carRotation);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(-10, -5, 20, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, -3, 3, 6);
    ctx.restore();
  };

  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setLapsCompleted(0);
    setGameTime(0);
    setCarPosition({ x: trackCenterX + trackRadius, y: trackCenterY });
    setCarRotation(0);
    startTime.current = Date.now();
    lastLapStartTime.current = Date.now();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameFinished(false);
    setLapsCompleted(0);
    setGameTime(0);
    setLastLapTime(0);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Car Racing Game</h1>
            <p className="text-gray-300">Welcome, {user.username}!</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-4 rounded-lg">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-600 rounded bg-gray-900 w-full max-w-full"
              />

              {/* Game Controls */}
              <div className="mt-4 text-center">
                {!gameStarted ? (
                  <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                    Start Race
                  </Button>
                ) : gameFinished ? (
                  <div className="space-y-2">
                    <p className="text-green-400 text-lg font-bold">Race Completed!</p>
                    <p className="text-white">Final Time: {formatTime(gameTime)}</p>
                    <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
                      Race Again
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-300">Use WASD keys to control your car</p>
                )}
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="space-y-4">
            {/* Current Race Stats */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">Current Race</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Laps:</span>
                  <span className="text-white">{lapsCompleted}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Time:</span>
                  <span className="text-white">{formatTime(gameTime)}</span>
                </div>
                {lastLapTime > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Last Lap:</span>
                    <span className="text-yellow-400">{formatTime(lastLapTime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Best */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">Personal Best</h3>
              <div className="text-center">
                {bestTime ? (
                  <div>
                    <p className="text-2xl font-bold text-green-400">
                      {formatTime(bestTime)}
                    </p>
                    <p className="text-xs text-gray-400">3 laps</p>
                  </div>
                ) : (
                  <p className="text-gray-400">No time set yet</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">Controls</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p><kbd className="bg-gray-700 px-2 py-1 rounded">W</kbd> - Forward</p>
                <p><kbd className="bg-gray-700 px-2 py-1 rounded">S</kbd> - Backward</p>
                <p><kbd className="bg-gray-700 px-2 py-1 rounded">A</kbd> - Turn Left</p>
                <p><kbd className="bg-gray-700 px-2 py-1 rounded">D</kbd> - Turn Right</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRacingGame;
