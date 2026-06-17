import type { Key } from '@lichess-org/chessground/types';

export type PuzzleID = string;

export interface Puzzle {
	puzzleId: PuzzleID;
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

export interface CompletedRunStatistics {
	Puzzles: PuzzleStatistic[];
	startTime: Date
	finishTime: Date
}

export interface PuzzleStatistic {
	puzzleID: PuzzleID;
	endTime: Date
	squares: number
}
