import samplePuzzleData from '../assets/sample_puzzle.json';

type status = "won" | "inProgress";

export function getPuzzleBatch() {
	// todo random start / end
	const puzzles = samplePuzzleData.puzzles.slice(0, 30);
	return puzzles;
}

export function startPuzzleGame() {
	let status: status = "inProgress"
	return status
}
