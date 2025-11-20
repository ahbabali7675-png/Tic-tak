import React from 'react';
import { Player } from '../types';
import { X, Circle } from 'lucide-react';

interface SquareProps {
  value: Player | null;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

export const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  return (
    <button
      className={`
        relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl text-4xl transition-all duration-300
        ${value === null ? 'hover:bg-slate-800' : ''}
        ${isWinningSquare 
          ? 'bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)] border-green-500/50 scale-105 z-10' 
          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'}
        border-2
        disabled:cursor-default
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square occupied by ${value}` : "Empty square"}
    >
      {value === 'X' && (
        <X 
          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-neon-pink animate-pop drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]`} 
          strokeWidth={2.5}
        />
      )}
      {value === 'O' && (
        <Circle 
          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-neon-blue animate-pop drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]`} 
          strokeWidth={3}
        />
      )}
    </button>
  );
};