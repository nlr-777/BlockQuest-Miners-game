import { useCallback } from 'react';
import { useGame } from '../context/GameContext';

// Simple sound effects using Web Audio API
const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || window.webkitAudioContext)();
  }
  return null;
};

let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = createAudioContext();
  }
  return audioContext;
};

const playTone = (frequency, duration, type = 'square', volume = 0.1) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log('Audio playback failed:', e);
  }
};

export const useGameSounds = () => {
  const { soundEnabled } = useGame();

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    playTone(800, 0.1, 'square', 0.08);
  }, [soundEnabled]);

  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    // Play a happy arpeggio
    setTimeout(() => playTone(523, 0.15, 'square', 0.1), 0);     // C5
    setTimeout(() => playTone(659, 0.15, 'square', 0.1), 100);   // E5
    setTimeout(() => playTone(784, 0.15, 'square', 0.1), 200);   // G5
    setTimeout(() => playTone(1047, 0.3, 'square', 0.1), 300);   // C6
  }, [soundEnabled]);

  const playError = useCallback(() => {
    if (!soundEnabled) return;
    playTone(200, 0.3, 'sawtooth', 0.1);
  }, [soundEnabled]);

  const playLevelComplete = useCallback(() => {
    if (!soundEnabled) return;
    // Play victory fanfare
    setTimeout(() => playTone(523, 0.1, 'square', 0.1), 0);
    setTimeout(() => playTone(659, 0.1, 'square', 0.1), 100);
    setTimeout(() => playTone(784, 0.1, 'square', 0.1), 200);
    setTimeout(() => playTone(1047, 0.2, 'square', 0.12), 300);
    setTimeout(() => playTone(784, 0.1, 'square', 0.1), 500);
    setTimeout(() => playTone(1047, 0.4, 'square', 0.15), 600);
  }, [soundEnabled]);

  const playDrop = useCallback(() => {
    if (!soundEnabled) return;
    playTone(400, 0.1, 'sine', 0.08);
  }, [soundEnabled]);

  const playTap = useCallback(() => {
    if (!soundEnabled) return;
    playTone(1000, 0.05, 'square', 0.06);
  }, [soundEnabled]);

  return {
    playClick,
    playSuccess,
    playError,
    playLevelComplete,
    playDrop,
    playTap,
  };
};

export default useGameSounds;
