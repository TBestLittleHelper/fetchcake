// Get chess puzzles
/*
SELECT *
FROM train
WHERE NbPlays > 200000
  AND Popularity > 90
ORDER BY NbPlays DESC
LIMIT 10;
*/

const exampleBatch = {
	"puzzles": [
		{
			'PuzzleId': '000hf',
			'GameId': '71ygsFeE/black#38',
			'FEN': 'r1bqk2r/pp1nbNp1/2p1p2p/8/2BP4/1PN3P1/P3QP1P/3R1RK1 b kq - 0 19',
			'Moves': 'e8f7 e2e6 f7f8 e6f7',
			'Rating': 1575,
			'RatingDeviation': 75,
			'Popularity': 92,
			'NbPlays': 674,
			'Themes': ['mate', 'mateIn2', 'middlegame', 'short'],
			'OpeningTags': ['Horwitz_Defense', 'Horwitz_Defense_Other_variations']
		},
	]
}

export function getPuzzleBatch() {
	return exampleBatch;
}
