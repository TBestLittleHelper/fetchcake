import './ninja-chess.css'

import { Chessground } from '@lichess-org/chessground';
import type { Config } from "@lichess-org/chessground/config";

import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { parseUci } from 'chessops/util';

import { getnbPuzzles, getPuzzleBatch } from './puzzle';
import type { Key } from '@lichess-org/chessground/types';
import type { Puzzle, GameState } from './types';
import type { DrawShape } from '@lichess-org/chessground/draw';
import { addLocalLeaderboardScore } from './leaders';

const nbPuzzles = getnbPuzzles();
const startIndex = Math.floor(Math.random() * (nbPuzzles - 30));
const maxSquaresAttempt = 16;

console.log("Start index:", startIndex);

const boardElement = document.querySelector<HTMLElement>('#board')
const progressElement = document.querySelector<HTMLProgressElement>("#ninjaGameProgress")

if (!boardElement || !progressElement) {
  throw new Error('Board or status element is missing from ninja-chess.html.')
}

progressElement.max = nbPuzzles;

const config: Config = {
  coordinates: true,
  viewOnly: true,
  disableContextMenu: true,
  highlight: {
    lastMove: true,
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

  // Remove oldest attempts
  while (gamestate.attemptSquares.length > maxSquaresAttempt) {
    gamestate.attemptSquares.shift();
  }

  const updatedShapes: DrawShape[] = gamestate.attemptSquares.map(sq => ({
    orig: sq,
    brush: 'paleBlue',
  }));

  ground.setShapes(updatedShapes);
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
    progressElement!.value = gamestate.solvedPuzzles;
    console.log("Puzzle solved! nb solved puzzles:", gamestate.solvedPuzzles)
    if (gamestate.solvedPuzzles >= nbPuzzles) {
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

  let setup = parseFen(gamestate.currentPuzzle.fen).unwrap()
  let move = parseUci(gamestate.moveUci)
  if (!move) {
    throw new Error(`Could not parse move: ${gamestate.moveUci}`)
  }
  chess = Chess.fromSetup(setup).unwrap()
  chess.play(move)
  console.log("Play " + gamestate.solution[0].toString())

  let fen = makeFen(chess.toSetup());
  ground.setShapes([]);
  ground.set({
    fen: fen,
    orientation: chess.turn,
    lastMove: [gamestate.moveUci.substring(0, 2),
    gamestate.moveUci.substring(2, 4)] as Key[]
  })
}

function endGame(): void {
  addLocalLeaderboardScore(gamestate.solvedPuzzles, 100) // todo time
  alert("Game completed!");
};
