import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, Trophy, Star } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroButton from '../components/RetroButton';
import RetroCard from '../components/RetroCard';
import EducationalPopup from '../components/EducationalPopup';
import Header from '../components/Header';
import useGameSounds from '../hooks/useGameSounds';

const BLOCKS = [
  { id: 'genesis', color: 'bg-primary', label: 'G', order: 1, hash: '0000' },
  { id: 'block1', color: 'bg-red-500', label: '1', order: 2, hash: 'A1B2' },
  { id: 'block2', color: 'bg-blue-500', label: '2', order: 3, hash: 'C3D4' },
  { id: 'block3', color: 'bg-green-500', label: '3', order: 4, hash: 'E5F6' },
  { id: 'block4', color: 'bg-yellow-400', label: '4', order: 5, hash: 'G7H8' },
];

const CORRECT_ORDER = ['genesis', 'block1', 'block2', 'block3', 'block4'];

const SortableBlock = ({ block, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-14 h-14 md:w-16 md:h-16 ${block.color} border-4 border-black shadow-retro flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${isDragging ? 'scale-110 shadow-neon-cyan' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-testid={`block-${block.id}`}
    >
      <span className="text-white font-pixel text-sm drop-shadow-lg">{block.label}</span>
      <span className="text-white/70 font-mono text-[8px]">{block.hash}</span>
    </motion.div>
  );
};

export const Level5 = () => {
  const navigate = useNavigate();
  const { completeLevel, isLevelCompleted, XP_PER_LEVEL, isLevelUnlocked, totalXP } = useGame();
  const { playDrop, playSuccess, playError, playLevelComplete } = useGameSounds();
  
  const [showPopup, setShowPopup] = useState(true);
  const [blocks, setBlocks] = useState(() => 
    [...BLOCKS].sort(() => Math.random() - 0.5)
  );
  const [isComplete, setIsComplete] = useState(isLevelCompleted(5));
  const [attempts, setAttempts] = useState(0);

  // Redirect if level not unlocked
  useEffect(() => {
    if (!isLevelUnlocked(5)) {
      navigate('/');
    }
  }, [isLevelUnlocked, navigate]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      playDrop();
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, [playDrop]);

  const checkOrder = useCallback(() => {
    const currentOrder = blocks.map((b) => b.id);
    const isCorrect = currentOrder.every((id, index) => id === CORRECT_ORDER[index]);
    setAttempts((a) => a + 1);

    if (isCorrect) {
      playLevelComplete();
      
      // Big celebration!
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00F0FF', '#BD00FF', '#FFD700'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00F0FF', '#BD00FF', '#FFD700'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
      
      completeLevel(5);
      setIsComplete(true);
      
      toast.success(`Block Mined! +${XP_PER_LEVEL} XP`, {
        description: 'Badge Earned: Blockchain Hero 🏆',
        duration: 3000,
      });
    } else {
      playError();
      toast.error('Not quite right!', {
        description: 'Genesis block (G) comes first, then 1, 2, 3, 4',
        duration: 2000,
      });
    }
  }, [blocks, completeLevel, playLevelComplete, playError, XP_PER_LEVEL]);

  const resetPuzzle = () => {
    setBlocks([...BLOCKS].sort(() => Math.random() - 0.5));
    setIsComplete(false);
  };

  if (!isLevelUnlocked(5)) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <EducationalPopup 
        level={5}
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
            <span className="font-pixel text-xs text-accent">FINAL LEVEL</span>
            <h1 className="font-pixel text-lg md:text-xl text-primary">Full Chain</h1>
          </div>
          
          <div className="w-16" />
        </div>

        {/* Game Area */}
        <RetroCard variant="game" className="mb-6" data-testid="game-area">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="text-accent" size={24} />
              <p className="font-mono text-sm text-slate-300">
                Build the complete 5-block chain!
              </p>
            </div>
            <p className="font-mono text-xs text-accent">
              Genesis (G) → Block 1 → Block 2 → Block 3 → Block 4
            </p>
          </div>

          {/* Target Order Reference */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <h4 className="font-pixel text-xs text-slate-400 mb-2 text-center">Correct Order:</h4>
            <div className="flex justify-center items-center gap-1 flex-wrap">
              {BLOCKS.map((block, i) => (
                <React.Fragment key={block.id}>
                  <div className={`w-8 h-8 ${block.color} border-2 border-black flex items-center justify-center`}>
                    <span className="font-pixel text-[10px] text-white">{block.label}</span>
                  </div>
                  {i < BLOCKS.length - 1 && (
                    <span className="text-slate-500 text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-6 mb-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={blocks} strategy={horizontalListSortingStrategy}>
                <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
                  {blocks.map((block, index) => (
                    <SortableBlock key={block.id} block={block} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Chain Visual with Links */}
          <div className="flex justify-center items-center mb-6 overflow-x-auto pb-2">
            {blocks.map((block, index) => (
              <React.Fragment key={block.id}>
                <div className={`w-10 h-10 ${block.color} border-2 border-black flex flex-col items-center justify-center flex-shrink-0`}>
                  <span className="font-pixel text-[10px] text-white">{block.label}</span>
                </div>
                {index < blocks.length - 1 && (
                  <div className="w-4 md:w-6 h-1 bg-slate-500 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {!isComplete ? (
              <>
                <RetroButton onClick={resetPuzzle} variant="ghost" data-testid="reset-puzzle-btn">
                  <RefreshCw size={16} className="mr-2" /> Reset
                </RetroButton>
                <RetroButton onClick={checkOrder} variant="primary" data-testid="check-chain-btn">
                  Complete Chain
                </RetroButton>
              </>
            ) : (
              <RetroButton onClick={() => navigate('/complete')} variant="accent" size="lg" data-testid="claim-reward-btn">
                <Star size={20} className="mr-2" />
                Claim Your Reward!
              </RetroButton>
            )}
          </div>

          {attempts > 0 && !isComplete && (
            <p className="text-center font-mono text-xs text-slate-500 mt-4">
              Attempts: {attempts}
            </p>
          )}
        </RetroCard>

        {/* Success Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RetroCard variant="glow" className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="font-pixel text-xl text-accent mb-2 neon-text-gold">BLOCKCHAIN HERO!</h2>
              <p className="font-mono text-sm text-slate-300 mb-4">
                You've mastered the basics of blockchain! Chains link blocks, miners agree, tampering is detected, and puzzles secure it all.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Star className="text-accent" size={20} />
                <span className="font-pixel text-lg text-accent">Total: {totalXP + XP_PER_LEVEL} XP</span>
                <Star className="text-accent" size={20} />
              </div>
            </RetroCard>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Level5;
