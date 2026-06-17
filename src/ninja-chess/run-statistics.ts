import type { CompletedRunStatistics, PuzzleStatistic } from "./types";

let inProgressRun: {
	Puzzles: PuzzleStatistic[];
	startTime: Date;
};

export function addPuzzleStatistic(puzzleID: string, squares: number) {
	if (!inProgressRun) {
		startStatisticsRun() //FIXME
	}

	const currentPuzzleStatistic = {
		puzzleID: puzzleID,
		endTime: new Date(),
		squares: squares
	};
	inProgressRun.Puzzles.push(currentPuzzleStatistic);
}

export function startStatisticsRun() {
	const startTime = new Date()
	inProgressRun = {
		Puzzles: [],
		startTime: startTime,
	};
}

export function endStatisticsRun(): CompletedRunStatistics {
	const completedRun: CompletedRunStatistics = {
		Puzzles: inProgressRun.Puzzles,
		startTime: inProgressRun.startTime,
		finishTime: new Date(),
	};
	return completedRun;
}

export function totalSquares(run: CompletedRunStatistics): number {
	return run.Puzzles.reduce((total, puzzle) => total + puzzle.squares, 0);
}
