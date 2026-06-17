import samplePuzzleData from '../assets/sample_puzzle.json';

const nbPuzzles = 30;

export function getPuzzleBatch(startIndex: number) {
	const selected = new Set<number>();
	const puzzleDatabaseLength = samplePuzzleData.puzzles.length

	while (selected.size < nbPuzzles) {
		selected.add(Math.floor(Math.random() * puzzleDatabaseLength));
	}
	const indices = [...selected];
	const puzzles = indices.map(index => samplePuzzleData.puzzles[index]);

	return puzzles;
}

export function getnbPuzzles() {
	return nbPuzzles;
}
