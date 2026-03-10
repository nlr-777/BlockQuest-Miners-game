import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, Award, ExternalLink, Home } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RetroButton from '../components/RetroButton';
import RetroCard from '../components/RetroCard';
import Header from '../components/Header';

const GERRY_AVATAR = "https://api.dicebear.com/9.x/pixel-art/svg?seed=Gerry&backgroundColor=b6e3f4";

export const QuestComplete = () => {
  const navigate = useNavigate();
  const { isGameComplete, totalXP, badges } = useGame();

  // Redirect if game not complete
  useEffect(() => {
    if (!isGameComplete) {
      navigate('/');
      return;
    }

    // Celebration confetti
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00F0FF', '#BD00FF', '#FFD700'],
      });
      confetti({
        particleCount: 3,
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
  }, [isGameComplete, navigate]);

  const handleClaimReward = () => {
    window.location.href = `https://blockquestofficial.com?progress=mining_complete&xp=${totalXP}`;
  };

  if (!isGameComplete) return null;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🏆
          </motion.div>
          
          <h1 className="font-pixel text-2xl md:text-4xl text-accent mb-2 neon-text-gold">
            QUEST COMPLETE!
          </h1>
          <p className="font-pixel text-sm md:text-lg text-primary neon-text-cyan">
            You're a Blockchain Hero!
          </p>
        </motion.div>

        {/* Gerry Congratulations */}
        <RetroCard variant="game" className="mb-6" data-testid="gerry-congrats">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <motion.img 
              src={GERRY_AVATAR}
              alt="Gerry the Goat"
              className="w-24 h-24 rounded-full border-4 border-accent bg-cyan-200"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-pixel text-sm text-accent mb-2">Gerry says:</h2>
              <p className="font-mono text-sm text-slate-300 leading-relaxed">
                "WOW! You did it, miner! You built chains, reached consensus, caught hackers, 
                and mined blocks like a pro! Our treasures are safe forever thanks to YOU!"
              </p>
            </div>
          </div>
        </RetroCard>

        {/* Final Stats */}
        <RetroCard variant="glow" className="mb-6">
          <div className="text-center mb-6">
            <h3 className="font-pixel text-lg text-primary mb-4">Your Achievement</h3>
            
            {/* XP Total */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="text-accent" size={32} />
              <span className="font-pixel text-4xl text-accent neon-text-gold">{totalXP} XP</span>
              <Star className="text-accent" size={32} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <Trophy className="text-accent mx-auto mb-2" size={24} />
                <span className="font-pixel text-xs text-slate-400 block">Levels</span>
                <span className="font-pixel text-lg text-white">5/5</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <Award className="text-primary mx-auto mb-2" size={24} />
                <span className="font-pixel text-xs text-slate-400 block">Badges</span>
                <span className="font-pixel text-lg text-white">{badges.length}</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <Star className="text-secondary mx-auto mb-2" size={24} />
                <span className="font-pixel text-xs text-slate-400 block">Rank</span>
                <span className="font-pixel text-lg text-white">Hero</span>
              </div>
            </div>

            {/* Badges Display */}
            <div className="mb-6">
              <h4 className="font-pixel text-xs text-slate-400 mb-3">Badges Earned</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-slate-800 border-2 border-accent/50 rounded-lg px-4 py-3 flex items-center gap-2"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="font-mono text-xs text-slate-300">{badge.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </RetroCard>

        {/* What You Learned */}
        <RetroCard variant="glass" className="mb-6">
          <h3 className="font-pixel text-sm text-primary mb-4 text-center">What You Learned</h3>
          <div className="grid gap-3">
            {[
              { icon: '🔗', text: 'Blocks link together to form an unbreakable chain' },
              { icon: '🤝', text: 'Miners vote together to reach consensus' },
              { icon: '🔍', text: 'Tampering is instantly detected by changed hashes' },
              { icon: '⚡', text: 'Proof of work requires solving puzzles to add blocks' },
              { icon: '🏆', text: 'Blockchains keep our digital treasures safe!' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-mono text-sm text-slate-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </RetroCard>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <RetroButton 
            onClick={handleClaimReward}
            variant="accent" 
            size="lg"
            data-testid="claim-reward-main-btn"
          >
            <ExternalLink size={20} className="mr-2" />
            Return to HQ & Claim Reward 🐐
          </RetroButton>
          
          <RetroButton 
            onClick={() => navigate('/')}
            variant="ghost" 
            size="lg"
            data-testid="play-again-btn"
          >
            <Home size={20} className="mr-2" />
            Play Again
          </RetroButton>
        </div>

        {/* Footer Note */}
        <p className="text-center font-mono text-xs text-slate-500 mt-8">
          Your progress has been saved! Come back anytime to show off your skills.
        </p>
      </main>
    </div>
  );
};

export default QuestComplete;
