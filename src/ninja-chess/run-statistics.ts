import type { CompletedRunStatistics, PuzzleStatistic } from "./types";

type InProgressRun = {
	puzzles: PuzzleStatistic[];
	startTime: Date;
}
let inProgressRun: InProgressRun | null = null;

export function addPuzzleStatistic(puzzleID: string, squares: number) {
	if (!inProgressRun) {
		throw new Error("No in-progress statistics run");
	}

	const currentPuzzleStatistic = {
		puzzleID,
		endTime: new Date(),
		squares
	};
	inProgressRun.puzzles.push(currentPuzzleStatistic);
}

export function startStatisticsRun() {
	const startTime = new Date()
	inProgressRun = {
		puzzles: [],
		startTime: startTime,
	};
}

export function endStatisticsRun(): CompletedRunStatistics {
	if (!inProgressRun) {
		throw new Error("No in-progress statistics run");
	}
	const completedRun: CompletedRunStatistics = {
		Puzzles: inProgressRun.puzzles,
		startTime: inProgressRun.startTime,
		finishTime: new Date(),
	};
	inProgressRun = null;
	return completedRun;
}

export function totalSquares(run: CompletedRunStatistics): number {
	return run.Puzzles.reduce((total, puzzle) => total + puzzle.squares, 0);
}
