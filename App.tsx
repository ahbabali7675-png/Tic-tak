import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { StatusMessage } from './components/StatusMessage';
import { Logo } from './components/Logo';
import { Player, BoardState, GameMode, WinResult } from './types';
import { getGeminiMove } from './services/geminiService';
import { soundManager } from './services/soundService';
import { MessageSquare, Sparkles } from 'lucide-react';

const INITIAL_BOARD: BoardState = Array(9).fill(null);

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PvP);
  const [winner, setWinner] = useState<WinResult | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [aiComment, setAiComment] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const checkWinner = useCallback((squares: BoardState): WinResult | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a] as Player, line: lines[i] };
      }
    }

    if (!squares.includes(null)) {
      return { winner: 'Draw', line: [] };
    }

    return null;
  }, []);

  const handleSquareClick = useCallback(async (index: number) => {
    if (board[index] || winner || isAiThinking) return;

    soundManager.playClick();

    // Human Move
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      return;
    }
    
    setIsXNext(!isXNext);
  }, [board, winner, isXNext, checkWinner, isAiThinking]);

  // Handle Win/Draw Sounds
  useEffect(() => {
    if (winner) {
      if (winner.winner === 'Draw') {
        soundManager.playDraw();
      } else {
        soundManager.playWin();
      }
    }
  }, [winner]);

  // AI Turn Effect
  useEffect(() => {
    const makeAiMove = async () => {
      if (gameMode === GameMode.PvAI && !isXNext && !winner) {
        setIsAiThinking(true);
        try {
          const aiResponse = await getGeminiMove(board);
          
          // Immediate update - Removed artificial delay
          if (aiResponse.comment) {
              setAiComment(aiResponse.comment);
          }

          const aiMoveIndex = aiResponse.move;
          
          setBoard(prev => {
            const newBoard = [...prev];
            // Safety check if user reset game or clicked rapidly
            if (newBoard[aiMoveIndex] === null) {
              newBoard[aiMoveIndex] = 'O';
              soundManager.playAiMove();
            }
            // Check win immediately after AI places
            const result = checkWinner(newBoard);
            if (result) setWinner(result);
            return newBoard;
          });

          setIsXNext(true);
          setIsAiThinking(false);

        } catch (error) {
          console.error("AI Move Failed", error);
          // Fallback to random empty square if AI fails
          const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
          if (emptyIndices.length > 0) {
             const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
             setBoard(prev => {
                const newBoard = [...prev];
                newBoard[randomMove] = 'O';
                soundManager.playAiMove();
                const result = checkWinner(newBoard);
                if (result) setWinner(result);
                return newBoard;
             });
             setIsXNext(true);
          }
          setIsAiThinking(false);
        }
      }
    };

    makeAiMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isXNext, gameMode, winner]); // board is excluded to prevent loops, handled inside logic by reading current state or passing it

  const resetGame = () => {
    soundManager.playReset();
    setBoard(INITIAL_BOARD);
    setIsXNext(true);
    setWinner(null);
    setAiComment("");
    setIsAiThinking(false);
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setMuted(newMuted);
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      
      <div className="w-full max-w-md h-full flex flex-col justify-between p-4 py-4">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-center gap-4 py-2">
          <Logo />
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-white leading-none">
              TIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">TAC</span> TOE
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-tight mt-0.5">
              {gameMode === GameMode.PvAI ? 'Gemini AI Edition' : 'Local PvP Mode'}
            </p>
          </div>
        </div>

        {/* AI Comment Bubble & Spacer */}
        <div className="shrink-0 min-h-[3rem] flex items-center justify-center">
          {gameMode === GameMode.PvAI && (
             <div className={`transition-opacity duration-300 ${aiComment ? 'opacity-100' : 'opacity-0'}`}>
               <div className="bg-slate-800/50 border border-slate-700 rounded-lg py-1.5 px-3 flex items-center gap-2 shadow-lg max-w-xs">
                 <MessageSquare className="w-3 h-3 text-neon-purple shrink-0" />
                 <p className="text-xs text-slate-300 italic line-clamp-2">
                   "{aiComment}"
                 </p>
               </div>
             </div>
          )}
        </div>

        {/* Game Board Area */}
        <div className="relative group shrink-0 flex justify-center my-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800">
            <Board 
              board={board} 
              onClick={handleSquareClick} 
              winningLine={winner?.line || null}
              isAiThinking={isAiThinking}
            />
          </div>
        </div>

        {/* Status & Controls */}
        <div className="space-y-4 shrink-0">
          <StatusMessage 
            winner={winner} 
            isXNext={isXNext} 
            isAiThinking={isAiThinking}
            gameMode={gameMode}
          />

          <GameControls 
            onReset={resetGame} 
            gameMode={gameMode} 
            onModeChange={handleModeChange} 
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </div>
        
        {/* Footer */}
        <div className="text-center shrink-0 opacity-50 hover:opacity-100 transition-opacity pb-2">
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;