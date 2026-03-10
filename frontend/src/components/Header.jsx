import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../context/GameContext';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_1b7103cb-60b2-49d7-8677-886184523930/artifacts/3oc0w6yi_blockquest_logo_primary.png";

export const Header = () => {
  const { soundEnabled, setSoundEnabled, totalXP } = useGame();

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="home-link">
          <img src={LOGO_URL} alt="BlockQuest" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          {/* XP Badge */}
          <div className="bg-accent/20 border border-accent/50 rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-accent font-pixel text-[10px]">{totalXP} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-slate-400 hover:text-primary transition-colors p-2"
            data-testid="sound-toggle"
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Back to HQ */}
          <a
            href="https://blockquestofficial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-mono text-xs"
            data-testid="back-to-hq"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Back to HQ</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
