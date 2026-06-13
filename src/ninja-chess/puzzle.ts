import samplePuzzleData from '../assets/sample_puzzle.json';

const nbPuzzles = 30;

export function getPuzzleBatch(startIndex: number) {
	let puzzles = samplePuzzleData.puzzles.slice(startIndex, startIndex + nbPuzzles);
	// Shuffle them, in case someone gets the same index more then once
	puzzles = shuffle(puzzles)
	return puzzles;
}

export function getnbPuzzles() {
	return nbPuzzles;
}

// https://bost.ocks.org/mike/shuffle/
// Fisher–Yates shuffle
function shuffle(array: any[]): any[] {
	let m = array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {

		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}
