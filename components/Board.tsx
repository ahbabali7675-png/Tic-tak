import React from 'react';
import { Square } from './Square';
import { BoardState } from '../types';

interface BoardProps {
  board: BoardState;
  onClick: (index: number) => void;
  winningLine: number[] | null;
  isAiThinking: boolean;
}

export const Board: React.FC<BoardProps> = ({ board, onClick, winningLine, isAiThinking }) => {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {board.map((square, index) => (
        <Square
          key={index}
          value={square}
          onClick={() => onClick(index)}
          isWinningSquare={winningLine?.includes(index) ?? false}
          disabled={square !== null || (winningLine !== null) || isAiThinking}
        />
      ))}
    </div>
  );
};