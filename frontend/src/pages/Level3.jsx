import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroButton from '../components/RetroButton';
import RetroCard from '../components/RetroCard';
import EducationalPopup from '../components/EducationalPopup';
import Header from '../components/Header';
import useGameSounds from '../hooks/useGameSounds';

const ORIGINAL_CHAIN = [
  { id: 1, color: 'red', hash: 'A1B2' },
  { id: 2, color: 'blue', hash: 'C3D4' },
  { id: 3, color: 'green', hash: 'E5F6' },
  { id: 4, color: 'yellow', hash: 'G7H8' },
];

const TAMPERED_INDEX = 2; // Block 3 is tampered (green → purple)
const TAMPERED_COLOR = 'purple';
const CORRECT_COLOR = 'green';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];
const COLOR_CLASSES = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500',
};

export const Level3 = () => {
  const navigate = useNavigate();
  const { completeLevel, isLevelCompleted, XP_PER_LEVEL, isLevelUnlocked } = useGame();
  const { playClick, playSuccess, playError, playLevelComplete } = useGameSounds();
  
  const [showPopup, setShowPopup] = useState(true);
  const [chain, setChain] = useState(() => 
    ORIGINAL_CHAIN.map((block, i) => ({
      ...block,
      color: i === TAMPERED_INDEX ? TAMPERED_COLOR : block.color,
      isTampered: i === TAMPERED_INDEX,
    }))
  );
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isComplete, setIsComplete] = useState(isLevelCompleted(3));
  const [showHint, setShowHint] = useState(false);

  // Redirect if level not unlocked
  useEffect(() => {
    if (!isLevelUnlocked(3)) {
      navigate('/');
    }
  }, [isLevelUnlocked, navigate]);

  const handleBlockClick = (blockId) => {
    playClick();
    setSelectedBlock(selectedBlock === blockId ? null : blockId);
  };

  const handleColorChange = (color) => {
    if (!selectedBlock) return;
    
    playClick();
    setChain((prev) => 
      prev.map((block) => 
        block.id === selectedBlock 
          ? { ...block, color, isTampered: color !== ORIGINAL_CHAIN.find(b => b.id === block.id)?.color }
          : block
      )
    );
  };

  const checkChain = () => {
    const isFixed = chain.every((block, i) => block.color === ORIGINAL_CHAIN[i].color);
    
    if (isFixed) {
      playLevelComplete();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#BD00FF', '#FFD700'],
      });
      
      completeLevel(3);
      setIsComplete(true);
      
      toast.success(`Block Mined! +${XP_PER_LEVEL} XP`, {
        description: 'Badge Earned: Tamper Detective 🔍',
        duration: 3000,
      });
    } else {
      playError();
      toast.error('Chain still has issues!', {
        description: 'Find and fix the tampered block',
        duration: 2000,
      });
    }
  };

  const resetChain = () => {
    setChain(ORIGINAL_CHAIN.map((block, i) => ({
      ...block,
      color: i === TAMPERED_INDEX ? TAMPERED_COLOR : block.color,
      isTampered: i === TAMPERED_INDEX,
    })));
    setSelectedBlock(null);
    setIsComplete(false);
    setShowHint(false);
  };

  if (!isLevelUnlocked(3)) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <EducationalPopup 
        level={3}
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
            <span className="font-pixel text-xs text-slate-400">Level 3</span>
            <h1 className="font-pixel text-lg md:text-xl text-primary">Tamper Detection</h1>
          </div>
          
          <div className="w-16" />
        </div>

        {/* Game Area */}
        <RetroCard variant="game" className="mb-6" data-testid="game-area">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="text-error" size={20} />
              <p className="font-mono text-sm text-error">
                ALERT: A hacker changed one block!
              </p>
            </div>
            <p className="font-mono text-xs text-slate-400">
              Click on a block to select it, then pick the correct color to fix it.
            </p>
          </div>

          {/* Original Chain Reference */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <h4 className="font-pixel text-xs text-slate-400 mb-2 flex items-center gap-2">
              <Shield size={14} className="text-success" />
              Original Chain:
            </h4>
            <div className="flex justify-center gap-2">
              {ORIGINAL_CHAIN.map((block, i) => (
                <React.Fragment key={block.id}>
                  <div className={`w-10 h-10 ${COLOR_CLASSES[block.color]} border-2 border-black flex items-center justify-center`}>
                    <span className="font-pixel text-[10px] text-white">{block.id}</span>
                  </div>
                  {i < ORIGINAL_CHAIN.length - 1 && (
                    <div className="w-4 h-1 bg-slate-500 self-center" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Current Chain (Editable) */}
          <div className="mb-6">
            <h4 className="font-pixel text-xs text-slate-400 mb-3 text-center">
              Current Chain (click to edit):
            </h4>
            <div className="flex justify-center gap-3">
              {chain.map((block, i) => (
                <React.Fragment key={block.id}>
                  <motion.button
                    onClick={() => handleBlockClick(block.id)}
                    className={`w-16 h-16 ${COLOR_CLASSES[block.color]} border-4 ${
                      selectedBlock === block.id 
                        ? 'border-primary ring-4 ring-primary/50' 
                        : block.isTampered 
                          ? 'border-error animate-pulse' 
                          : 'border-black'
                    } flex flex-col items-center justify-center shadow-retro transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`chain-block-${block.id}`}
                  >
                    <span className="font-pixel text-sm text-white">{block.id}</span>
                    <span className="font-mono text-[8px] text-white/70">{block.hash}</span>
                  </motion.button>
                  {i < chain.length - 1 && (
                    <div className={`w-6 h-1 self-center ${
                      chain[i].color !== ORIGINAL_CHAIN[i].color || chain[i+1].color !== ORIGINAL_CHAIN[i+1].color
                        ? 'bg-error'
                        : 'bg-success'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          {selectedBlock && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/80 rounded-lg p-4 mb-6"
            >
              <h4 className="font-pixel text-xs text-slate-400 mb-3 text-center">
                Change Block {selectedBlock} color to:
              </h4>
              <div className="flex justify-center gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-12 h-12 ${COLOR_CLASSES[color]} border-4 border-black shadow-retro hover:scale-110 transition-transform`}
                    data-testid={`color-${color}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Hint */}
          {!isComplete && (
            <div className="text-center mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
                data-testid="hint-btn"
              >
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-xs text-accent mt-2"
                >
                  Look at Block 3... it should be green, not purple!
                </motion.p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {!isComplete ? (
              <>
                <RetroButton onClick={resetChain} variant="ghost" data-testid="reset-chain-btn">
                  <RefreshCw size={16} className="mr-2" /> Reset
                </RetroButton>
                <RetroButton onClick={checkChain} variant="primary" data-testid="verify-chain-btn">
                  Verify Chain
                </RetroButton>
              </>
            ) : (
              <RetroButton onClick={() => navigate('/level/4')} variant="accent" data-testid="next-level-btn">
                Next Level →
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
              <h2 className="font-pixel text-lg text-success mb-2">Chain Restored!</h2>
              <p className="font-mono text-sm text-slate-300">
                You caught the hacker! Every block has a fingerprint (hash) that changes if tampered with. That's how blockchains detect cheaters!
              </p>
            </RetroCard>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Level3;
