import type { Key } from '@lichess-org/chessground/types';

type PuzzleID = string;

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

interface PuzzleStatistic {
	puzzleID: PuzzleID;
	endTime: Date
	squares: number
}
