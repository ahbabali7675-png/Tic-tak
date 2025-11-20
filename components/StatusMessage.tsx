import React from 'react';
import { WinResult, GameMode } from '../types';
import { Loader2 } from 'lucide-react';

interface StatusMessageProps {
  winner: WinResult | null;
  isXNext: boolean;
  isAiThinking: boolean;
  gameMode: GameMode;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ winner, isXNext, isAiThinking, gameMode }) => {
  
  if (winner) {
    if (winner.winner === 'Draw') {
      return (
        <div className="bg-slate-800 border border-slate-700 text-slate-200 p-4 rounded-xl text-center font-bold text-lg shadow-lg">
          It's a Draw! 🤝
        </div>
      );
    }
    return (
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-400 p-4 rounded-xl text-center font-bold text-xl shadow-[0_0_20px_rgba(34,197,94,0.2)] animate-pulse">
        Winner: {winner.winner === 'X' ? 'Player X' : (gameMode === GameMode.PvAI ? 'AI' : 'Player O')} 🎉
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 min-h-[64px]">
      {isAiThinking ? (
        <div className="flex items-center gap-3 text-indigo-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Gemini is thinking...</span>
        </div>
      ) : (
        <div className="text-slate-300 font-medium flex items-center gap-2">
          Current Turn: 
          <span className={`font-bold text-xl ${isXNext ? 'text-neon-pink' : 'text-neon-blue'}`}>
            {isXNext ? 'X' : 'O'}
          </span>
        </div>
      )}
    </div>
  );
};