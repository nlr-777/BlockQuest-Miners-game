import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroCard from './RetroCard';

export const ProgressDashboard = () => {
  const { totalXP, completionPercent, badges, completedLevels } = useGame();

  return (
    <RetroCard variant="game" className="mb-6" data-testid="progress-dashboard">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* XP Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="text-accent" size={20} />
            <span className="font-pixel text-xs text-slate-400">XP</span>
          </div>
          <motion.div 
            className="font-pixel text-xl md:text-2xl text-accent neon-text-gold"
            key={totalXP}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {totalXP}
          </motion.div>
        </div>

        {/* Completion */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Star className="text-primary" size={20} />
            <span className="font-pixel text-xs text-slate-400">Done</span>
          </div>
          <div className="font-pixel text-xl md:text-2xl text-primary neon-text-cyan">
            {Math.round(completionPercent)}%
          </div>
        </div>

        {/* Badges */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="text-secondary" size={20} />
            <span className="font-pixel text-xs text-slate-400">Badges</span>
          </div>
          <div className="font-pixel text-xl md:text-2xl text-secondary neon-text-purple">
            {badges.length}/5
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-mono text-xs text-slate-400">Progress</span>
          <span className="font-mono text-xs text-slate-400">{completedLevels.length}/5 Levels</span>
        </div>
        <div className="progress-container">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Badges Display */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              className="bg-slate-800 border-2 border-slate-600 rounded-lg px-3 py-2 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-lg">{badge.icon}</span>
              <span className="font-mono text-xs text-slate-300">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      )}
    </RetroCard>
  );
};

export default ProgressDashboard;
