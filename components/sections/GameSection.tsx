"use client"
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Game Constants
const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 80;
const GIFT_SIZE = 40;
const INITIAL_LIVES = 3;

type GameState = 'start' | 'playing' | 'gameover';

type Gift = {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'normal' | 'golden';
  emoji: string;
};

export function GameSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [highScore, setHighScore] = useState(0);

  // Game state refs (to access in animation loop without triggering re-renders)
  const stateRef = useRef({
    basketX: 0,
    gifts: [] as Gift[],
    score: 0,
    lives: INITIAL_LIVES,
    frameId: 0,
    lastSpawnTime: 0,
    spawnRate: 1500, // ms
    baseSpeed: 3,
    keys: { left: false, right: false },
    isGameOver: false
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.frameId) cancelAnimationFrame(stateRef.current.frameId);
    };
  }, []);

  // Handle window resize and initial setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      // Make canvas full width of parent container
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = Math.min(window.innerHeight * 0.7, 600); // Responsive height
      // Initialize basket to center
      if (gameState === 'start') {
        stateRef.current.basketX = canvas.width / 2 - BASKET_WIDTH / 2;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Load high score
    const saved = localStorage.getItem('birthday_game_highscore');
    if (saved) setHighScore(parseInt(saved));

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Controls Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stateRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') stateRef.current.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') stateRef.current.keys.right = false;
    };

    // Mouse / Touch follow
    const handleMouseMove = (e: MouseEvent) => {
      if (stateRef.current.isGameOver) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      stateRef.current.basketX = Math.max(0, Math.min(x - BASKET_WIDTH / 2, canvas.width - BASKET_WIDTH));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (stateRef.current.isGameOver) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      stateRef.current.basketX = Math.max(0, Math.min(x - BASKET_WIDTH / 2, canvas.width - BASKET_WIDTH));
      // Prevent scrolling while touching canvas
      if (e.cancelable) e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    stateRef.current = {
      ...stateRef.current,
      gifts: [],
      score: 0,
      lives: INITIAL_LIVES,
      isGameOver: false,
      basketX: canvas.width / 2 - BASKET_WIDTH / 2,
      baseSpeed: 3,
      spawnRate: 1500,
      lastSpawnTime: performance.now()
    };

    setScore(0);
    setLives(INITIAL_LIVES);
    setGameState('playing');

    // Start loop
    if (stateRef.current.frameId) cancelAnimationFrame(stateRef.current.frameId);
    stateRef.current.frameId = requestAnimationFrame(gameLoop);
  };

  const gameLoop = (time: number) => {
    if (stateRef.current.isGameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const state = stateRef.current;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Keyboard Movement update
    if (state.keys.left) {
      state.basketX = Math.max(0, state.basketX - 8);
    }
    if (state.keys.right) {
      state.basketX = Math.min(canvas.width - BASKET_WIDTH, state.basketX + 8);
    }

    // Difficulty progression
    if (state.score > 0 && state.score % 10 === 0) {
      // Increase speed slightly
      state.baseSpeed = 3 + (state.score / 10) * 0.4;
      // Increase spawn rate (minimum 400ms)
      state.spawnRate = Math.max(400, 1500 - (state.score / 10) * 150);
    }

    // Spawn gifts
    if (time - state.lastSpawnTime > state.spawnRate) {
      const isGolden = Math.random() < 0.15; // 15% chance for golden
      const emojis = ['🎁', '🎀', '🧸', '💖'];

      state.gifts.push({
        id: Math.random(),
        x: Math.random() * (canvas.width - GIFT_SIZE),
        y: -GIFT_SIZE,
        speed: state.baseSpeed + (Math.random() * 2) + (isGolden ? 1.5 : 0),
        type: isGolden ? 'golden' : 'normal',
        emoji: isGolden ? '⭐' : emojis[Math.floor(Math.random() * emojis.length)]
      });
      state.lastSpawnTime = time;
    }

    // Update and Draw Gifts
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = state.gifts.length - 1; i >= 0; i--) {
      const gift = state.gifts[i];
      gift.y += gift.speed;

      // Draw gift
      ctx.fillText(gift.emoji, gift.x + GIFT_SIZE / 2, gift.y + GIFT_SIZE / 2);

      // Collision Detection
      const giftCenterX = gift.x + GIFT_SIZE / 2;
      const giftCenterY = gift.y + GIFT_SIZE / 2;

      const inBasketX = giftCenterX > state.basketX && giftCenterX < state.basketX + BASKET_WIDTH;
      // Check if it crosses the basket top edge
      const inBasketY = giftCenterY > canvas.height - BASKET_HEIGHT && giftCenterY < canvas.height - BASKET_HEIGHT + 30;

      if (inBasketX && inBasketY) {
        // Caught!
        state.score += gift.type === 'golden' ? 5 : 1;
        setScore(state.score);
        state.gifts.splice(i, 1);
      } else if (gift.y > canvas.height) {
        // Missed!
        state.lives -= 1;
        setLives(state.lives);
        state.gifts.splice(i, 1);

        if (state.lives <= 0) {
          gameOver();
          return; // Stop processing this frame
        }
      }
    }

    // Draw Basket
    ctx.font = '50px Arial';
    ctx.fillText('🧺', state.basketX + BASKET_WIDTH / 2, canvas.height - BASKET_HEIGHT / 2);

    state.frameId = requestAnimationFrame(gameLoop);
  };

  const gameOver = () => {
    stateRef.current.isGameOver = true;
    setGameState('gameover');
    if (stateRef.current.score > highScore) {
      setHighScore(stateRef.current.score);
      localStorage.setItem('birthday_game_highscore', stateRef.current.score.toString());
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-transparent py-20 overflow-hidden">

      {/* Title */}
      <div className="text-center z-10 mb-8">
        <h2 className="text-3xl md:text-5xl font-cursive text-pink-500 drop-shadow-sm font-bold tracking-wide">
          Catch the Gifts! 🎁
        </h2>
      </div>

      {/* Game Container */}
      <div className="relative w-full max-w-4xl px-4 z-10 flex flex-col items-center">

        {/* Top HUD */}
        {gameState === 'playing' && (
          <div className="w-full flex justify-between items-center bg-white/60 backdrop-blur-md px-6 py-3 rounded-t-2xl shadow-sm border border-pink-100">
            <div className="font-bold text-pink-500 text-xl md:text-2xl">
              Score: {score}
            </div>
            <div className="text-xl md:text-2xl flex gap-1">
              {[...Array(INITIAL_LIVES)].map((_, i) => (
                <span key={i} className={i < lives ? "opacity-100" : "opacity-20 grayscale"}>
                  💖
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="relative w-full bg-white/40 backdrop-blur-sm rounded-2xl md:rounded-b-2xl md:rounded-t-none border border-pink-100 shadow-[0_15px_40px_rgba(255,182,193,0.3)] overflow-hidden" style={{ height: '600px', maxHeight: '70vh' }}>

          <canvas
            ref={canvasRef}
            className="block w-full h-full cursor-none touch-none"
          />

          {/* Start Screen Overlay */}
          <AnimatePresence>
            {gameState === 'start' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
              >
                <div className="text-6xl mb-6 animate-bounce drop-shadow-md">🧺</div>
                <h3 className="text-2xl md:text-3xl text-pink-600 font-bold mb-2 font-cursive text-center">Ready to catch some gifts?</h3>
                <p className="text-gray-500 mb-8 max-w-xs text-center font-medium">
                  Catch the gifts (🎁, 🎀, 🧸) for 1 point. <br />
                  Golden stars (⭐) are worth 5 points! <br />
                  Don't let them hit the floor like me!
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 px-12 rounded-full shadow-lg hover:shadow-[0_10px_20px_rgba(244,114,182,0.4)] hover:scale-105 transition-all active:scale-95 text-lg"
                >
                  Start Game
                </button>
              </motion.div>
            )}

            {/* Game Over Overlay */}
            {gameState === 'gameover' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-20"
              >
                <h3 className="text-4xl md:text-5xl text-pink-600 font-bold mb-2 font-cursive">Game Over!</h3>

                <div className="bg-pink-50/80 p-6 md:p-8 rounded-3xl shadow-inner my-6 text-center w-64 md:w-72 border border-pink-100">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">Final Score</p>
                  <p className="text-6xl font-bold text-pink-500 drop-shadow-sm">{score}</p>
                </div>

                <div className="flex items-center gap-2 mb-8 bg-pink-100/50 px-4 py-2 rounded-full">
                  <span className="text-xl">🏆</span>
                  <p className="text-pink-600 font-bold">High Score: {highScore}</p>
                </div>

                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-[0_10px_20px_rgba(244,114,182,0.4)] hover:scale-105 transition-all active:scale-95 flex items-center gap-3 text-lg"
                >
                  <span className="text-xl">🔄</span> Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </section>
  )
}
