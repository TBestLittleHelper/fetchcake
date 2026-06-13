import './ninja-chess.css'

import { Chessground } from '@lichess-org/chessground';
import type { Config } from "@lichess-org/chessground/config";

import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { parseUci } from 'chessops/util';

import { getnbPuzzles, getPuzzleBatch } from './puzzle';
import type { Key } from '@lichess-org/chessground/types';
import type { Puzzle, GameState } from './types';

const nbPuzzles = getnbPuzzles();
const startIndex = Math.floor(Math.random() * (nbPuzzles - 30));
const maxSquaresAttempt = 16;

console.log("Start index:", startIndex);

const boardElement = document.querySelector<HTMLElement>('#board')
const statusElement = document.querySelector<HTMLElement>("#ninjaGameStatus")

if (!boardElement || !statusElement) {
  throw new Error('Board or status element is missing from ninja-chess.html.')
}

const config: Config = {
  coordinates: true,
  viewOnly: true,
  disableContextMenu: true,
  highlight: {
    lastMove: true,
    check: true
  }
}

const ground = Chessground(boardElement, config)

// Initialize game state
const puzzleBatch = getPuzzleBatch(startIndex)
const initialPuzzle = puzzleBatch[0]
const initialMoves = initialPuzzle.moves.split(" ")

const gamestate: GameState = {
  solvedPuzzles: 0,
  currentPuzzle: initialPuzzle,
  moves: initialMoves,
  moveUci: initialMoves[0],
  solution: initialMoves.slice(1),
  attemptSquares: [],
  status: ''
}

const addAttempt = (square: Key): void => {
  gamestate.attemptSquares.push(square);
  while (gamestate.attemptSquares.length > maxSquaresAttempt) {
    gamestate.attemptSquares.shift();
  }
};

let move = parseUci(gamestate.moveUci)
if (!move) {
  throw new Error(`Could not parse move: ${gamestate.moveUci}`)
}

gamestate.status = "Playing"

let setup = parseFen(gamestate.currentPuzzle.fen).unwrap()
let chess = Chess.fromSetup(setup).unwrap()

chess.play(move)
console.log("Last move:", gamestate.moveUci)

let fen = makeFen(chess.toSetup());

ground.set({ fen: fen, orientation: chess.turn, lastMove: [gamestate.moveUci.substring(0, 2), gamestate.moveUci.substring(2, 4)] as Key[] })

// Initialize Ninja Chess page
const container = document.querySelector<HTMLElement>('#ninjaChessContainer')

if (!container) {
  throw new Error('Ninja Chess markup is missing from ninja-chess.html.')
}

// Log square to console when position changes
let lastSquare: Key | null = null
const logSquareAtPos = (x: number, y: number) => {
  const square = ground.getKeyAtDomPos([x, y])
  if (!square || square === lastSquare) {
    return
  }
  lastSquare = square
  addAttempt(square)
  if (isSolved()) {
    gamestate.solvedPuzzles++;
    console.log("Puzzle solved! nb solved puzzles:", gamestate.solvedPuzzles)
    if (gamestate.solvedPuzzles > nbPuzzles) {
      endGame();
      return;
    }
    nextPuzzle(puzzleBatch, gamestate.solvedPuzzles)
  }
  console.log(square)
}

// Log square on mouse move
boardElement.addEventListener('mousemove', (event: MouseEvent) => {
  logSquareAtPos(event.clientX, event.clientY)
})

// Log square on touch/swipe
boardElement.addEventListener('touchmove', (event: TouchEvent) => {
  const touch = event.touches[0]
  logSquareAtPos(touch.clientX, touch.clientY)
})

function isSolved(): boolean {
  if (!gamestate.solution || gamestate.solution.length === 0) return false;

  // Get first move and convert to squares
  const firstMove = gamestate.solution[0];
  const fromSquare = firstMove.substring(0, 2) as Key;
  const toSquare = firstMove.substring(2, 4) as Key;

  // Check if attempt matches the two squares from the first move
  if (gamestate.attemptSquares.includes(fromSquare) && gamestate.attemptSquares.includes(toSquare)) {
    statusElement!.textContent = "Puzzle solved!";
    return true;
  }

  return false;
}

function nextPuzzle(puzzleBatch: Puzzle[], currentIndex: number): void {
  currentIndex++;
  if (currentIndex >= puzzleBatch.length) {
    currentIndex = 0;
  }
  gamestate.currentPuzzle = puzzleBatch[currentIndex];
  gamestate.moves = gamestate.currentPuzzle.moves.split(" ");
  gamestate.moveUci = gamestate.moves[0]
  gamestate.solution = gamestate.moves.slice(1)
  gamestate.attemptSquares = []
}

function endGame(): void {
  statusElement!.textContent = "Game completed!";
};
