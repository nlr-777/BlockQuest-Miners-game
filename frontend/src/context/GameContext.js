import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const GameContext = createContext(null);

const INITIAL_STATE = {
  xp: 0,
  currentLevel: 1,
  completedLevels: [],
  badges: [],
  playerId: null,
};

const BADGES = {
  1: { id: 'chain_starter', name: 'Chain Starter', icon: '🔗' },
  2: { id: 'consensus_king', name: 'Consensus King', icon: '👑' },
  3: { id: 'tamper_detective', name: 'Tamper Detective', icon: '🔍' },
  4: { id: 'hash_master', name: 'Hash Master', icon: '⚡' },
  5: { id: 'blockchain_hero', name: 'Blockchain Hero', icon: '🏆' },
};

const XP_PER_LEVEL = 50;

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load from localStorage and sync with backend
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // First check localStorage
        const saved = localStorage.getItem('blockquest_miners_progress');
        if (saved) {
          const parsed = JSON.parse(saved);
          setGameState(parsed);
          
          // If we have a playerId, try to sync with backend
          if (parsed.playerId) {
            try {
              const response = await axios.get(`${API_URL}/api/progress/${parsed.playerId}`);
              if (response.data && response.data.xp > parsed.xp) {
                setGameState(response.data);
                localStorage.setItem('blockquest_miners_progress', JSON.stringify(response.data));
              }
            } catch (e) {
              console.log('Could not sync with backend, using local data');
            }
          }
        } else {
          // Create new player
          try {
            const response = await axios.post(`${API_URL}/api/progress`, INITIAL_STATE);
            const newState = { ...INITIAL_STATE, playerId: response.data.id };
            setGameState(newState);
            localStorage.setItem('blockquest_miners_progress', JSON.stringify(newState));
          } catch (e) {
            console.log('Could not create player on backend, using local only');
            const newState = { ...INITIAL_STATE, playerId: `local_${Date.now()}` };
            setGameState(newState);
            localStorage.setItem('blockquest_miners_progress', JSON.stringify(newState));
          }
        }
      } catch (e) {
        console.error('Error loading progress:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Save progress to localStorage and backend
  const saveProgress = useCallback(async (newState) => {
    localStorage.setItem('blockquest_miners_progress', JSON.stringify(newState));
    
    if (newState.playerId && !newState.playerId.startsWith('local_')) {
      try {
        await axios.put(`${API_URL}/api/progress/${newState.playerId}`, newState);
      } catch (e) {
        console.log('Could not sync to backend');
      }
    }
  }, []);

  const completeLevel = useCallback((level) => {
    setGameState((prev) => {
      if (prev.completedLevels.includes(level)) {
        return prev;
      }

      const badge = BADGES[level];
      const newState = {
        ...prev,
        xp: prev.xp + XP_PER_LEVEL,
        completedLevels: [...prev.completedLevels, level],
        currentLevel: Math.min(level + 1, 5),
        badges: badge ? [...prev.badges, badge] : prev.badges,
      };

      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  const resetProgress = useCallback(async () => {
    const newState = { ...INITIAL_STATE, playerId: gameState.playerId };
    setGameState(newState);
    localStorage.setItem('blockquest_miners_progress', JSON.stringify(newState));
    
    if (gameState.playerId && !gameState.playerId.startsWith('local_')) {
      try {
        await axios.put(`${API_URL}/api/progress/${gameState.playerId}`, newState);
      } catch (e) {
        console.log('Could not reset on backend');
      }
    }
  }, [gameState.playerId]);

  const isLevelUnlocked = useCallback((level) => {
    if (level === 1) return true;
    return gameState.completedLevels.includes(level - 1);
  }, [gameState.completedLevels]);

  const isLevelCompleted = useCallback((level) => {
    return gameState.completedLevels.includes(level);
  }, [gameState.completedLevels]);

  const isGameComplete = gameState.completedLevels.length === 5;
  const totalXP = gameState.xp;
  const completionPercent = (gameState.completedLevels.length / 5) * 100;

  const value = {
    ...gameState,
    isLoading,
    soundEnabled,
    setSoundEnabled,
    completeLevel,
    resetProgress,
    isLevelUnlocked,
    isLevelCompleted,
    isGameComplete,
    totalXP,
    completionPercent,
    XP_PER_LEVEL,
    BADGES,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
