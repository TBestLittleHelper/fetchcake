import type { Key } from '@lichess-org/chessground/types';

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

export interface GameState {
	solvedPuzzles: number;
	currentPuzzle: Puzzle;
	moves: string[];
	moveUci: string;
	solution: string[];
	attemptSquares: Key[];
	status: string;
}
