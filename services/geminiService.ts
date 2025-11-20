import { GoogleGenAI, Type } from "@google/genai";
import { BoardState, AiMoveResponse } from '../types';

// Ideally, this would be in a proper backend to hide the key, but for this demo architecture:
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const getGeminiMove = async (board: BoardState): Promise<AiMoveResponse> => {
  if (!apiKey) {
    console.warn("API Key missing. Returning random move.");
    return getFallbackMove(board);
  }

  const boardStr = JSON.stringify(board);
  // Ultra-compact prompt for maximum speed
  const prompt = `Play O. Board:${boardStr}. Win or Block.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 50, // Absolute minimum tokens for JSON
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for zero-latency response
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            move: { type: Type.INTEGER, description: "0-8" },
            comment: { type: Type.STRING, description: "Max 2 words" }
          },
          required: ["move", "comment"],
          propertyOrdering: ["move", "comment"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const result = JSON.parse(text) as AiMoveResponse;
    
    // Validate move
    if (board[result.move] !== null) {
       console.warn("AI tried to play on occupied square, falling back.");
       return getFallbackMove(board);
    }

    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackMove(board);
  }
};

const getFallbackMove = (board: BoardState): AiMoveResponse => {
  const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(v => v !== null) as number[];
  const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  return {
    move: randomMove,
    comment: "..."
  };
};