import type { Key } from '@lichess-org/chessground/types';

/**
 * Represents a chess puzzle from the Lichess database
 */
export interface Puzzle {
	puzzleId: string;
	fen: string;
	moves: string;
	rating: number;
	ratingDeviation: number;
	popularity: number;
	nbPlays: number;
	themes: string;
	gameUrl: string;
	openingTags: string;
}

/**
 * Represents the current game state in Ninja Chess
 */
export interface GameState {
	solvedPuzzles: number;
	currentPuzzle: Puzzle;
	moves: string[];
	moveUci: string;
	solution: string[];
	attemptSquares: Key[];
	status: string;
}
