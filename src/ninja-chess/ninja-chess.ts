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
import { addPuzzleStatistic, endStatisticsRun, totalSquares } from './run-statistics';

const chessClockSound = new Audio("./sound/chessClock.m4a");

const nbPuzzles = getnbPuzzles();
const maxSquaresAttempt = 9;

const boardElement = document.querySelector<HTMLElement>('#board')
const progressElement = document.querySelector<HTMLProgressElement>("#ninjaGameProgress")

if (!boardElement || !progressElement) {
  throw new Error('Board or status element is missing from ninja-chess.html.')
}

progressElement.max = nbPuzzles;

// Initialize game state
const puzzleBatch = getPuzzleBatch()
const initialPuzzle = puzzleBatch[0]
const initialMoves = initialPuzzle.moves.split(" ")

const gamestate: GameState = {
  solvedPuzzles: 0,
  currentPuzzle: initialPuzzle,
  currentPuzzleTotalSquares: 0,
  moves: initialMoves,
  moveUci: initialMoves[0],
  solution: initialMoves.slice(1),
  attemptSquares: [],
  status: ''
}


function loadPuzzle() {
  const setup = parseFen(gamestate.currentPuzzle.fen).unwrap()
  const move = parseUci(gamestate.moveUci)
  if (!move) {
    throw new Error(`Could not parse move: ${gamestate.moveUci}`)
  }
  const chess = Chess.fromSetup(setup).unwrap()
  chess.play(move)
  const fen = makeFen(chess.toSetup())
  return { chess, fen }
}


const addAttempt = (square: Key): void => {
  gamestate.currentPuzzleTotalSquares++;
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

const puzzle = loadPuzzle()

gamestate.status = "Playing"

const config: Config = {
  coordinates: true,
  viewOnly: true,
  disableContextMenu: true,
  highlight: {
    lastMove: true,
  },
  fen: puzzle.fen,
  orientation: puzzle.chess.turn,
  lastMove: [gamestate.moveUci.substring(0, 2), gamestate.moveUci.substring(2, 4)] as Key[]

}
const ground = Chessground(boardElement, config)
ground.set(config)

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
    chessClockSound.play().catch(console.error)
    gamestate.solvedPuzzles++;
    progressElement.value = gamestate.solvedPuzzles;
    console.log("Puzzle solved! nb solved puzzles:", gamestate.solvedPuzzles)
    if (gamestate.solvedPuzzles >= nbPuzzles) {
      endGame();
      return;
    }
    nextPuzzle(puzzleBatch, gamestate.solvedPuzzles)
  }
}

// Log square on pointermove ( mouse, touch or pen )
boardElement.addEventListener('pointermove', (event: PointerEvent) => {
  logSquareAtPos(event.clientX, event.clientY)
})

function isSolved(): boolean {
  if (gamestate.solution.length === 0) return false;

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
  addPuzzleStatistic(gamestate.currentPuzzle.puzzleId, gamestate.currentPuzzleTotalSquares)

  lastSquare = null;

  currentIndex++;
  if (currentIndex >= puzzleBatch.length) {
    currentIndex = 0;
  }
  gamestate.currentPuzzle = puzzleBatch[currentIndex];
  gamestate.currentPuzzleTotalSquares = 0;
  gamestate.moves = gamestate.currentPuzzle.moves.split(" ");
  gamestate.moveUci = gamestate.moves[0]
  gamestate.solution = gamestate.moves.slice(1)
  gamestate.attemptSquares = []

  const puzzle = loadPuzzle()

  console.log("Play " + gamestate.solution[0].toString())

  ground.setShapes([]);
  ground.set({
    fen: puzzle.fen,
    orientation: puzzle.chess.turn,
    lastMove: [gamestate.moveUci.substring(0, 2),
    gamestate.moveUci.substring(2, 4)] as Key[]
  })
}

function endGame(): void {
  const completedRunStats = endStatisticsRun()

  const runTotalSquares = totalSquares(completedRunStats);
  const time = completedRunStats.finishTime.getTime() - completedRunStats.startTime.getTime()

  addLocalLeaderboardScore(runTotalSquares, time)
  alert("Game completed! " + time.toString() + "  " + runTotalSquares);
};
