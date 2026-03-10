import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroButton from '../components/RetroButton';
import RetroCard from '../components/RetroCard';
import EducationalPopup from '../components/EducationalPopup';
import Header from '../components/Header';
import useGameSounds from '../hooks/useGameSounds';

const BLOCKS = [
  { id: 'red', color: 'bg-red-500', label: 'R', order: 1 },
  { id: 'blue', color: 'bg-blue-500', label: 'B', order: 2 },
  { id: 'green', color: 'bg-green-500', label: 'G', order: 3 },
];

const CORRECT_ORDER = ['red', 'blue', 'green'];

const SortableBlock = ({ block }) => {
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
      className={`puzzle-block ${block.color} ${isDragging ? 'scale-110 shadow-neon-cyan' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-testid={`block-${block.id}`}
    >
      <span className="text-white font-pixel text-lg drop-shadow-lg">{block.label}</span>
    </motion.div>
  );
};

export const Level1 = () => {
  const navigate = useNavigate();
  const { completeLevel, isLevelCompleted, XP_PER_LEVEL } = useGame();
  const { playDrop, playSuccess, playError, playLevelComplete } = useGameSounds();
  
  const [showPopup, setShowPopup] = useState(true);
  const [blocks, setBlocks] = useState(() => 
    [...BLOCKS].sort(() => Math.random() - 0.5)
  );
  const [isComplete, setIsComplete] = useState(isLevelCompleted(1));
  const [attempts, setAttempts] = useState(0);

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#BD00FF', '#FFD700'],
      });
      
      completeLevel(1);
      setIsComplete(true);
      
      toast.success(`Block Mined! +${XP_PER_LEVEL} XP`, {
        description: 'Badge Earned: Chain Starter 🔗',
        duration: 3000,
      });
    } else {
      playError();
      toast.error('Not quite right!', {
        description: 'Remember: Red → Blue → Green',
        duration: 2000,
      });
    }
  }, [blocks, completeLevel, playLevelComplete, playError, XP_PER_LEVEL]);

  const resetPuzzle = () => {
    setBlocks([...BLOCKS].sort(() => Math.random() - 0.5));
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <EducationalPopup 
        level={1}
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
            <span className="font-pixel text-xs text-slate-400">Level 1</span>
            <h1 className="font-pixel text-lg md:text-xl text-primary">Basic Chain</h1>
          </div>
          
          <div className="w-16" />
        </div>

        {/* Game Area */}
        <RetroCard variant="game" className="mb-6" data-testid="game-area">
          <div className="text-center mb-6">
            <p className="font-mono text-sm text-slate-300 mb-2">
              Drag the blocks to form a chain:
            </p>
            <div className="flex justify-center gap-2 mb-4">
              <span className="bg-red-500 w-8 h-8 rounded flex items-center justify-center font-pixel text-xs text-white">R</span>
              <span className="text-slate-400">→</span>
              <span className="bg-blue-500 w-8 h-8 rounded flex items-center justify-center font-pixel text-xs text-white">B</span>
              <span className="text-slate-400">→</span>
              <span className="bg-green-500 w-8 h-8 rounded flex items-center justify-center font-pixel text-xs text-white">G</span>
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
                <div className="flex justify-center gap-4 flex-wrap">
                  {blocks.map((block) => (
                    <SortableBlock key={block.id} block={block} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Chain Visual */}
          <div className="flex justify-center mb-6">
            {blocks.map((block, index) => (
              <React.Fragment key={block.id}>
                <div className={`w-12 h-12 ${block.color} border-2 border-black flex items-center justify-center`}>
                  <span className="font-pixel text-xs text-white">{index + 1}</span>
                </div>
                {index < blocks.length - 1 && (
                  <div className="w-8 h-1 bg-slate-500 self-center" />
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
                  Check Chain
                </RetroButton>
              </>
            ) : (
              <RetroButton onClick={() => navigate('/level/2')} variant="accent" data-testid="next-level-btn">
                Next Level →
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
              <h2 className="font-pixel text-lg text-success mb-2">Chain Built!</h2>
              <p className="font-mono text-sm text-slate-300">
                You created your first blockchain! Each block is now linked to the one before it.
              </p>
            </RetroCard>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Level1;
