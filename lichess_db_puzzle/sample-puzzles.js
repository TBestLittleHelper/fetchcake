#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { Chess } from "chessops";
import { parseFen } from 'chessops/fen';


const inputFile = path.join('lichess_db_puzzle', 'lichess_db_puzzle.csv');
const outputFile = path.join('src', 'assets', 'sample_puzzle.json');

async function samplePuzzles() {
	const puzzles = [];
	let headerLine = null;

	const fileStream = fs.createReadStream(inputFile);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	console.log('Reading and filtering puzzles...');

	for await (const line of rl) {
		// First line is header
		if (headerLine === null) {
			headerLine = line;
			continue;
		}

		// Parse CSV line (basic parsing - handles most cases)
		const parts = line.split(',');

		if (parts.length < 7) continue; // Skip malformed lines

		try {
			const puzzleId = parts[0];
			const fen = parts[1];
			const moves = parts[2];
			const rating = parseInt(parts[3]);
			const ratingDeviation = parseInt(parts[4]);
			const popularity = parseInt(parts[5]);
			const nbPlays = parseInt(parts[6]);
			const themes = parts[7] || '';
			const gameUrl = parts[8] || '';
			const openingTags = parts[9] || '';

			// Apply filters
			if (nbPlays > 10000 && popularity > 80 && rating > 1700) {
				const setup = parseFen(fen).unwrap()
				const chess = Chess.fromSetup(setup).unwrap();
				// We only want all puzzles to have the same side to play.
				// As all puzzle's first move is for the last move of the opponent, the actual puzzle is opposite of what we filter for
				if (chess.turn === 'white') {
					continue;
				}

				puzzles.push({
					puzzleId,
					fen,
					moves,
					rating,
					ratingDeviation,
					popularity,
					nbPlays,
					themes,
					gameUrl,
					openingTags
				});
			}
		} catch (e) {
			// Skip lines that can't be parsed
			continue;
		}
	}

	console.log(`Found ${puzzles.length} puzzles matching criteria`);

	// Sort by popularity descending and take top
	const numberOfPuzzles = 1000;
	const topPuzzles = puzzles
		.sort((a, b) => b.popularity - a.popularity)
		.slice(0, numberOfPuzzles);

	// Write to output file as JSON
	const jsonOutput = JSON.stringify({ puzzles: topPuzzles }, null, 2);
	fs.writeFileSync(outputFile, jsonOutput);

	console.log(`\nSample created with ${topPuzzles.length} puzzles`);
	console.log(`Output written to: ${outputFile}`);
}

samplePuzzles().catch(err => {
	console.error('Error:', err);
	process.exit(1);
});
