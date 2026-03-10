import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroCard from './RetroCard';

const LEVELS = [
  { id: 1, title: 'Basic Chain', description: 'Build your first blockchain', icon: '🔗' },
  { id: 2, title: 'Consensus', description: 'Make miners agree', icon: '🤝' },
  { id: 3, title: 'Tamper Detection', description: 'Spot the hacker', icon: '🔍' },
  { id: 4, title: 'Proof of Work', description: 'Mine a block fast', icon: '⛏️' },
  { id: 5, title: 'Full Chain', description: 'Master the blockchain', icon: '🏆' },
];

export const LevelSelect = () => {
  const navigate = useNavigate();
  const { isLevelUnlocked, isLevelCompleted } = useGame();

  return (
    <div className="space-y-3" data-testid="level-select">
      {LEVELS.map((level, index) => {
        const unlocked = isLevelUnlocked(level.id);
        const completed = isLevelCompleted(level.id);

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => unlocked && navigate(`/level/${level.id}`)}
              disabled={!unlocked}
              className={`w-full text-left transition-all ${
                unlocked 
                  ? 'hover:scale-[1.02] cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              data-testid={`level-${level.id}-btn`}
            >
              <RetroCard 
                variant={completed ? 'glow' : 'default'}
                animate={false}
                className={`flex items-center gap-4 ${
                  completed ? 'border-success' : unlocked ? 'border-primary/50' : ''
                }`}
              >
                {/* Level Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                  completed 
                    ? 'bg-success/20' 
                    : unlocked 
                      ? 'bg-primary/20' 
                      : 'bg-slate-700'
                }`}>
                  {unlocked ? level.icon : <Lock size={20} className="text-slate-500" />}
                </div>

                {/* Level Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs text-slate-400">Level {level.id}</span>
                    {completed && (
                      <span className="bg-success/20 text-success text-[10px] font-pixel px-2 py-0.5 rounded">
                        DONE
                      </span>
                    )}
                  </div>
                  <h3 className={`font-pixel text-sm ${
                    completed ? 'text-success' : unlocked ? 'text-white' : 'text-slate-500'
                  }`}>
                    {level.title}
                  </h3>
                  <p className="font-mono text-xs text-slate-400">{level.description}</p>
                </div>

                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completed 
                    ? 'bg-success' 
                    : unlocked 
                      ? 'bg-primary/20' 
                      : 'bg-slate-700'
                }`}>
                  {completed ? (
                    <Check size={16} className="text-white" />
                  ) : unlocked ? (
                    <ChevronRight size={16} className="text-primary" />
                  ) : (
                    <Lock size={12} className="text-slate-500" />
                  )}
                </div>
              </RetroCard>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LevelSelect;
