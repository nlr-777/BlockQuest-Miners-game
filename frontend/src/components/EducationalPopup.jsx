import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import RetroButton from './RetroButton';

const LEVEL_EDUCATION = {
  1: {
    title: "What is a Blockchain?",
    content: "A blockchain is like a chain of LEGO blocks! Each block connects to the one before it. Once connected, you can't change them without breaking the whole chain. That's what makes it super safe!",
    tip: "Drag the blocks in the right order to build your first chain!",
  },
  2: {
    title: "What is Consensus?",
    content: "Imagine you and your friends voting on what game to play. If most people agree, that's the winner! Blockchains work the same way - computers vote to agree on what's real.",
    tip: "Help the miners vote together to agree on the block order!",
  },
  3: {
    title: "Tamper Detection",
    content: "Each block has a special fingerprint (called a hash). If someone tries to change a block, the fingerprint changes and everyone knows it's been tampered with!",
    tip: "Find the hacked block and fix it to restore the chain!",
  },
  4: {
    title: "Proof of Work",
    content: "Miners have to solve a puzzle to add new blocks. It's like a race! The first one to solve it gets to add the block. This puzzle-solving uses lots of computer power.",
    tip: "Tap fast to solve the hash puzzle and mine your block!",
  },
  5: {
    title: "Build the Full Chain!",
    content: "Now you know all the secrets! Blocks link together, everyone agrees, no one can cheat, and miners solve puzzles. Put it all together to become a Blockchain Hero!",
    tip: "Use everything you've learned to build the ultimate chain!",
  },
};

export const EducationalPopup = ({ level, isOpen, onClose, onStart }) => {
  const education = LEVEL_EDUCATION[level] || LEVEL_EDUCATION[1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-primary rounded-xl max-w-md w-full p-6 relative shadow-neon-cyan"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              data-testid="close-popup"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Lightbulb className="text-primary" size={24} />
              </div>
              <h2 className="font-pixel text-lg text-primary">{education.title}</h2>
            </div>

            <p className="font-mono text-sm text-slate-300 mb-4 leading-relaxed">
              {education.content}
            </p>

            <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4 mb-6">
              <p className="font-mono text-sm text-accent">
                <span className="font-bold">TIP:</span> {education.tip}
              </p>
            </div>

            <div className="flex justify-center">
              <RetroButton 
                onClick={onStart} 
                variant="primary"
                data-testid="start-level-btn"
              >
                Let's Go!
              </RetroButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EducationalPopup;
