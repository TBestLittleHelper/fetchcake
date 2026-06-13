import samplePuzzleData from '../assets/sample_puzzle.json';

export function getPuzzleBatch(startIndex: number) {
	const puzzles = samplePuzzleData.puzzles.slice(startIndex, startIndex + 30);
	return puzzles;
}

export function getnbPuzzles() {
	console.log(samplePuzzleData.puzzles)
	return samplePuzzleData.puzzles.length;
}
