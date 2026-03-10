import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroButton from '../components/RetroButton';
import RetroCard from '../components/RetroCard';
import ProgressDashboard from '../components/ProgressDashboard';
import LevelSelect from '../components/LevelSelect';
import Header from '../components/Header';
import useGameSounds from '../hooks/useGameSounds';

const GERRY_AVATAR = "https://api.dicebear.com/9.x/pixel-art/svg?seed=Gerry&backgroundColor=b6e3f4";
const CHARACTER_GROUP = "https://customer-assets.emergentagent.com/job_blockquest-miners/artifacts/jlet8u1c_generated_image_20260128_052106_1.png";

export const StartScreen = () => {
  const navigate = useNavigate();
  const { isLoading, completedLevels, resetProgress, isGameComplete } = useGame();
  const { playClick } = useGameSounds();

  const handleStart = () => {
    playClick();
    const nextLevel = completedLevels.length > 0 
      ? Math.min(Math.max(...completedLevels) + 1, 5)
      : 1;
    navigate(`/level/${nextLevel}`);
  };

  const handleReset = () => {
    playClick();
    if (window.confirm('Reset all progress? This cannot be undone!')) {
      resetProgress();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-pixel text-2xl md:text-4xl text-primary mb-2 neon-text-cyan">
            BlockQuest Miners
          </h1>
          <p className="font-pixel text-xs md:text-sm text-secondary">
            Build the Unbreakable Chain!
          </p>
        </motion.div>

        {/* Gerry Introduction */}
        <RetroCard variant="game" className="mb-6" data-testid="gerry-intro">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <motion.img 
              src={GERRY_AVATAR}
              alt="Gerry the Goat"
              className="w-24 h-24 rounded-full border-4 border-primary bg-cyan-200"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-pixel text-sm text-accent mb-2">Gerry the Goat says:</h2>
              <p className="font-mono text-sm text-slate-300 leading-relaxed">
                "Hey there, miner! Help me build blocks so our treasures stay safe forever! 
                Each block links to the last — that's the power of blockchain!"
              </p>
            </div>
          </div>
        </RetroCard>

        {/* Character Squad Preview */}
        <RetroCard variant="glass" className="mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img 
              src={CHARACTER_GROUP}
              alt="BlockQuest Squad"
              className="w-full md:w-1/2 rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-pixel text-sm text-primary mb-2">Meet the Squad!</h3>
              <p className="font-mono text-xs text-slate-400 mb-3">
                Miko, Sam, Zara, Ollie & Lila are here to help you learn blockchain!
              </p>
              <div className="flex flex-wrap gap-2">
                {['Miko 🎨', 'Sam 🛡️', 'Zara ⚡', 'Ollie 🎮', 'Lila 🤝'].map((char) => (
                  <span key={char} className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-300">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </RetroCard>

        {/* Progress Dashboard */}
        {completedLevels.length > 0 && <ProgressDashboard />}

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <RetroButton 
            onClick={handleStart} 
            variant="primary" 
            size="lg"
            data-testid="start-game-btn"
          >
            <Play size={20} className="inline mr-2" />
            {completedLevels.length > 0 ? 'Continue Quest' : 'Start Mining!'}
          </RetroButton>

          {completedLevels.length > 0 && (
            <RetroButton 
              onClick={handleReset} 
              variant="ghost" 
              size="lg"
              data-testid="reset-btn"
            >
              <RotateCcw size={20} className="inline mr-2" />
              Reset
            </RetroButton>
          )}
        </div>

        {/* Level Select */}
        <div className="mb-8">
          <h2 className="font-pixel text-sm text-center text-slate-400 mb-4">Select Level</h2>
          <LevelSelect />
        </div>

        {/* Quest Complete Redirect */}
        {isGameComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <RetroButton
              onClick={() => window.location.href = 'https://blockquestofficial.com?progress=mining_complete&xp=250'}
              variant="accent"
              size="lg"
              data-testid="claim-reward-btn"
            >
              Return to HQ & Claim Reward 🐐
            </RetroButton>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <a 
            href="https://blockquestofficial.com"
            className="font-mono text-xs text-slate-500 hover:text-primary transition-colors"
            data-testid="footer-hq-link"
          >
            ← Back to BlockQuest HQ
          </a>
        </div>
      </footer>
    </div>
  );
};

export default StartScreen;
