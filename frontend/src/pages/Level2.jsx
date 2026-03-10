import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroButton from '../components/RetroButton';
import RetroCard from '../components/RetroCard';
import EducationalPopup from '../components/EducationalPopup';
import Header from '../components/Header';
import useGameSounds from '../hooks/useGameSounds';

const MINERS = [
  { id: 'miko', name: 'Miko', avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Miko&backgroundColor=d1d4f9' },
  { id: 'sam', name: 'Sam', avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Sam&backgroundColor=ffdfbf' },
  { id: 'zara', name: 'Zara', avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Zara&backgroundColor=c0aede' },
];

const BLOCK_OPTIONS = [
  { id: 'A', color: 'bg-red-500' },
  { id: 'B', color: 'bg-blue-500' },
  { id: 'C', color: 'bg-green-500' },
];

const CORRECT_VOTE = 'B'; // Majority should vote for B

export const Level2 = () => {
  const navigate = useNavigate();
  const { completeLevel, isLevelCompleted, XP_PER_LEVEL, isLevelUnlocked } = useGame();
  const { playClick, playLevelComplete, playError } = useGameSounds();
  
  const [showPopup, setShowPopup] = useState(true);
  const [votes, setVotes] = useState({});
  const [isComplete, setIsComplete] = useState(isLevelCompleted(2));
  const [showResult, setShowResult] = useState(false);

  // Redirect if level not unlocked
  useEffect(() => {
    if (!isLevelUnlocked(2)) {
      navigate('/');
    }
  }, [isLevelUnlocked, navigate]);

  const handleVote = (minerId, blockId) => {
    playClick();
    setVotes((prev) => ({ ...prev, [minerId]: blockId }));
  };

  const checkConsensus = useCallback(() => {
    const voteValues = Object.values(votes);
    if (voteValues.length < 3) {
      toast.error('All miners must vote!');
      return;
    }

    // Count votes
    const voteCounts = voteValues.reduce((acc, v) => {
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});

    // Find majority
    const majority = Object.entries(voteCounts).find(([, count]) => count >= 2);
    setShowResult(true);

    if (majority && majority[0] === CORRECT_VOTE) {
      playLevelComplete();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#BD00FF', '#FFD700'],
      });
      
      completeLevel(2);
      setIsComplete(true);
      
      toast.success(`Block Mined! +${XP_PER_LEVEL} XP`, {
        description: 'Badge Earned: Consensus King 👑',
        duration: 3000,
      });
    } else {
      playError();
      toast.error('No consensus reached!', {
        description: 'The majority must agree on Block B',
        duration: 2000,
      });
    }
  }, [votes, completeLevel, playLevelComplete, playError, XP_PER_LEVEL]);

  const resetVotes = () => {
    setVotes({});
    setShowResult(false);
    setIsComplete(false);
  };

  if (!isLevelUnlocked(2)) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <EducationalPopup 
        level={2}
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
            <span className="font-pixel text-xs text-slate-400">Level 2</span>
            <h1 className="font-pixel text-lg md:text-xl text-primary">Consensus</h1>
          </div>
          
          <div className="w-16" />
        </div>

        {/* Game Area */}
        <RetroCard variant="game" className="mb-6" data-testid="game-area">
          <div className="text-center mb-6">
            <p className="font-mono text-sm text-slate-300 mb-2">
              Help 3 miners agree on which block to add (hint: it's Block B!)
            </p>
            <p className="font-mono text-xs text-accent">
              At least 2 miners must vote the same for consensus
            </p>
          </div>

          {/* Block Options */}
          <div className="flex justify-center gap-4 mb-8">
            {BLOCK_OPTIONS.map((block) => (
              <div key={block.id} className="text-center">
                <div className={`w-16 h-16 ${block.color} border-4 border-black shadow-retro flex items-center justify-center`}>
                  <span className="font-pixel text-xl text-white">{block.id}</span>
                </div>
                <span className="font-mono text-xs text-slate-400 mt-1">Block {block.id}</span>
              </div>
            ))}
          </div>

          {/* Miners Voting */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {MINERS.map((miner) => (
              <div key={miner.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={miner.avatar} 
                    alt={miner.name}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                  />
                  <div>
                    <h3 className="font-pixel text-xs text-white">{miner.name}</h3>
                    <p className="font-mono text-[10px] text-slate-400">Miner</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {BLOCK_OPTIONS.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => handleVote(miner.id, block.id)}
                      className={`flex-1 py-2 px-3 rounded border-2 transition-all ${
                        votes[miner.id] === block.id
                          ? `${block.color} border-white scale-105`
                          : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                      }`}
                      data-testid={`vote-${miner.id}-${block.id}`}
                    >
                      <span className="font-pixel text-xs text-white">{block.id}</span>
                    </button>
                  ))}
                </div>

                {votes[miner.id] && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Check size={12} className="text-success" />
                    <span className="font-mono text-[10px] text-success">Voted!</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vote Summary */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/80 rounded-lg p-4 mb-6"
            >
              <h4 className="font-pixel text-xs text-slate-400 mb-2">Vote Results:</h4>
              <div className="flex justify-center gap-4">
                {BLOCK_OPTIONS.map((block) => {
                  const count = Object.values(votes).filter(v => v === block.id).length;
                  return (
                    <div key={block.id} className="text-center">
                      <div className={`w-10 h-10 ${block.color} rounded flex items-center justify-center mb-1`}>
                        <span className="font-pixel text-sm text-white">{count}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">Block {block.id}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {!isComplete ? (
              <>
                <RetroButton onClick={resetVotes} variant="ghost" data-testid="reset-votes-btn">
                  <RefreshCw size={16} className="mr-2" /> Reset
                </RetroButton>
                <RetroButton 
                  onClick={checkConsensus} 
                  variant="primary" 
                  disabled={Object.keys(votes).length < 3}
                  data-testid="check-consensus-btn"
                >
                  Check Consensus
                </RetroButton>
              </>
            ) : (
              <RetroButton onClick={() => navigate('/level/3')} variant="accent" data-testid="next-level-btn">
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
              <h2 className="font-pixel text-lg text-success mb-2">Consensus Reached!</h2>
              <p className="font-mono text-sm text-slate-300">
                The miners agreed! When most nodes agree on something, it becomes the truth on the blockchain.
              </p>
            </RetroCard>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Level2;
