import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroButton from '../components/RetroButton';
import RetroCard from '../components/RetroCard';
import EducationalPopup from '../components/EducationalPopup';
import Header from '../components/Header';
import useGameSounds from '../hooks/useGameSounds';

const TARGET_TAPS = 15;
const TIME_LIMIT = 5; // seconds

export const Level4 = () => {
  const navigate = useNavigate();
  const { completeLevel, isLevelCompleted, XP_PER_LEVEL, isLevelUnlocked } = useGame();
  const { playTap, playError, playLevelComplete } = useGameSounds();
  
  const [showPopup, setShowPopup] = useState(true);
  const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [nonce, setNonce] = useState('0000');
  const [isComplete, setIsComplete] = useState(isLevelCompleted(4));
  
  const intervalRef = useRef(null);
  const tapsRef = useRef(0);

  // Redirect if level not unlocked
  useEffect(() => {
    if (!isLevelUnlocked(4)) {
      navigate('/');
    }
  }, [isLevelUnlocked, navigate]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            // Check taps using ref to get current value
            if (tapsRef.current >= TARGET_TAPS) {
              // Win
              setGameState('won');
              playLevelComplete();
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00F0FF', '#BD00FF', '#FFD700'],
              });
              completeLevel(4);
              setIsComplete(true);
              toast.success(`Block Mined! +${XP_PER_LEVEL} XP`, {
                description: 'Badge Earned: Hash Master ⚡',
                duration: 3000,
              });
            } else {
              // Lose
              setGameState('lost');
              playError();
              toast.error('Too slow!', {
                description: `You needed ${TARGET_TAPS} taps, got ${tapsRef.current}`,
                duration: 2000,
              });
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [gameState, completeLevel, playLevelComplete, playError, XP_PER_LEVEL]);

  const startGame = () => {
    setGameState('playing');
    setTaps(0);
    tapsRef.current = 0;
    setTimeLeft(TIME_LIMIT);
    setNonce('0000');
  };

  const handleTap = useCallback(() => {
    if (gameState !== 'playing') return;
    
    playTap();
    const newTaps = tapsRef.current + 1;
    tapsRef.current = newTaps;
    setTaps(newTaps);
    
    // Update nonce display (fake hash computation)
    const newNonce = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    setNonce(newNonce);

    // Check for immediate win
    if (newTaps >= TARGET_TAPS) {
      clearInterval(intervalRef.current);
      setGameState('won');
      playLevelComplete();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#BD00FF', '#FFD700'],
      });
      completeLevel(4);
      setIsComplete(true);
      toast.success(`Block Mined! +${XP_PER_LEVEL} XP`, {
        description: 'Badge Earned: Hash Master ⚡',
        duration: 3000,
      });
    }
  }, [gameState, playTap, playLevelComplete, completeLevel, XP_PER_LEVEL]);

  const resetGame = () => {
    clearInterval(intervalRef.current);
    setGameState('ready');
    setTaps(0);
    tapsRef.current = 0;
    setTimeLeft(TIME_LIMIT);
    setNonce('0000');
  };

  if (!isLevelUnlocked(4)) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <EducationalPopup 
        level={4}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onStart={() => setShowPopup(false)}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Level Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"
            data-testid="back-btn"
          >
            <ArrowLeft size={20} />
            <span className="font-mono text-sm">Back</span>
          </button>
          
          <div className="text-center">
            <span className="font-pixel text-xs text-slate-400">Level 4</span>
            <h1 className="font-pixel text-lg md:text-xl text-primary">Proof of Work</h1>
          </div>
          
          <div className="w-16" />
        </div>

        {/* Game Area */}
        <RetroCard variant="game" className="mb-6" data-testid="game-area">
          <div className="text-center mb-6">
            <p className="font-mono text-sm text-slate-300 mb-2">
              Tap fast to "hash" the block! Miners race to solve puzzles.
            </p>
            <p className="font-mono text-xs text-accent">
              Get {TARGET_TAPS} taps in {TIME_LIMIT} seconds to mine the block!
            </p>
          </div>

          {/* Stats Display */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/80 rounded-lg p-4 text-center">
              <span className="font-mono text-xs text-slate-400 block mb-1">Taps</span>
              <motion.span 
                key={taps}
                className="font-pixel text-2xl text-primary"
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
              >
                {taps}
              </motion.span>
              <span className="font-mono text-xs text-slate-500">/{TARGET_TAPS}</span>
            </div>
            
            <div className="bg-slate-800/80 rounded-lg p-4 text-center">
              <span className="font-mono text-xs text-slate-400 block mb-1">Time</span>
              <span className={`font-pixel text-2xl ${timeLeft <= 2 ? 'text-error' : 'text-accent'}`}>
                {timeLeft}s
              </span>
            </div>
            
            <div className="bg-slate-800/80 rounded-lg p-4 text-center">
              <span className="font-mono text-xs text-slate-400 block mb-1">Nonce</span>
              <span className="font-pixel text-2xl text-secondary">{nonce}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="progress-container">
              <motion.div 
                className="progress-fill"
                animate={{ width: `${(taps / TARGET_TAPS) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Mining Button */}
          <div className="flex justify-center mb-6">
            {gameState === 'ready' && (
              <RetroButton onClick={startGame} variant="primary" size="lg" data-testid="start-mining-btn">
                <Zap size={20} className="mr-2" />
                Start Mining!
              </RetroButton>
            )}

            {gameState === 'playing' && (
              <motion.button
                onClick={handleTap}
                className="w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-full border-8 border-black shadow-neon-cyan flex flex-col items-center justify-center active:scale-95 transition-transform"
                whileTap={{ scale: 0.9 }}
                data-testid="tap-btn"
              >
                <Zap size={48} className="text-black" />
                <span className="font-pixel text-xs text-black mt-2">TAP!</span>
              </motion.button>
            )}

            {(gameState === 'won' || gameState === 'lost') && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  {gameState === 'won' ? '⚡' : '💔'}
                </motion.div>
                <h3 className={`font-pixel text-xl mb-4 ${
                  gameState === 'won' ? 'text-success' : 'text-error'
                }`}>
                  {gameState === 'won' ? 'BLOCK MINED!' : 'TRY AGAIN!'}
                </h3>
              </div>
            )}
          </div>

          {/* Hash Animation (fake) */}
          {gameState === 'playing' && (
            <div className="bg-black/50 rounded-lg p-3 font-mono text-[10px] text-primary overflow-hidden">
              <motion.div
                animate={{ x: [0, -20, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Computing hash: 0x{nonce}...{Math.random().toString(16).slice(2, 10)}
              </motion.div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-6">
            {gameState !== 'playing' && !isComplete && (
              <RetroButton onClick={resetGame} variant="ghost" data-testid="reset-game-btn">
                <RefreshCw size={16} className="mr-2" /> Reset
              </RetroButton>
            )}
            
            {isComplete && (
              <RetroButton onClick={() => navigate('/level/5')} variant="accent" data-testid="next-level-btn">
                Final Level →
              </RetroButton>
            )}
          </div>
        </RetroCard>

        {/* Success Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RetroCard variant="glow" className="text-center">
              <h2 className="font-pixel text-lg text-success mb-2">Block Hashed!</h2>
              <p className="font-mono text-sm text-slate-300">
                You solved the puzzle! Real miners use powerful computers to find special numbers (nonces) that make valid hashes. The first to solve it wins!
              </p>
            </RetroCard>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Level4;
