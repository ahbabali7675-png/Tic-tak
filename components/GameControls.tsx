import React from 'react';
import { GameMode } from '../types';
import { RotateCcw, Bot, Users, Volume2, VolumeX } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  onReset, 
  gameMode, 
  onModeChange, 
  isMuted, 
  onToggleMute 
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="flex-1 flex p-1 bg-slate-800 rounded-lg border border-slate-700">
          <button
            onClick={() => onModeChange(GameMode.PvP)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
              gameMode === GameMode.PvP 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            PvP
          </button>
          <button
            onClick={() => onModeChange(GameMode.PvAI)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
              gameMode === GameMode.PvAI 
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI
          </button>
        </div>

        <button
          onClick={onToggleMute}
          className={`px-3 rounded-lg border border-slate-700 flex items-center justify-center transition-colors ${
            isMuted 
              ? 'bg-slate-800 text-slate-500 hover:text-slate-300' 
              : 'bg-slate-800 text-neon-blue hover:bg-slate-700'
          }`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 hover:shadow-lg"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Board
      </button>
    </div>
  );
};