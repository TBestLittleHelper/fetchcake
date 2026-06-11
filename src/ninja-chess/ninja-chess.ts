import './ninja-chess.css'

import { Chessground } from '@lichess-org/chessground';
import type { Config } from "@lichess-org/chessground/config";

import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { parseUci } from 'chessops/util';

import { getPuzzleBatch } from './puzzle';

let puzzleBatch = getPuzzleBatch()
let currentPuzzle = puzzleBatch?.puzzles[0]
if (!currentPuzzle) {
  alert('No puzzles found!')
  throw new Error('No puzzle available.')
}

const boardElement = document.querySelector<HTMLElement>('#board')

if (!boardElement) {
  throw new Error('Board element is missing from ninja-chess.html.')
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

const maxSquares = 16;

let moves = currentPuzzle.Moves.split(" ");
let moveUci = moves[0]
let solution = moves.slice(1)

let attempt: string[] = []

const addAttempt = (square: string) => {
  attempt.push(square);
  while (attempt.length > maxSquares) {
    attempt.shift();
  }
};

let move = parseUci(moveUci)
if (!move) {
  throw new Error(`Could not parse move: ${moveUci}`)
}

let setup = parseFen(currentPuzzle.FEN).unwrap()
let chess = Chess.fromSetup(setup).unwrap()
chess.play(move)
console.log("Last move:", moveUci)

let fen = makeFen(chess.toSetup())
ground.set({ fen: fen })

// Initialize Ninja Chess page
const container = document.querySelector<HTMLElement>('#ninjaChessContainer')

if (!container) {
  throw new Error('Ninja Chess markup is missing from ninja-chess.html.')
}

// Log square to console when position changes
let lastSquare: string | null = null
const logSquareAtPos = (x: number, y: number) => {
  const square = ground.getKeyAtDomPos([x, y])
  if (!square || square === lastSquare) {
    return
  }
  lastSquare = square
  addAttempt(square)
  if (isSolved()) {
    console.log("Puzzle solved!")
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

function isSolved() {
  if (!solution || solution.length === 0) return false;

  // Get first move and convert to squares
  const firstMove = solution[0];
  const fromSquare = firstMove.substring(0, 2);
  const toSquare = firstMove.substring(2, 4);

  // Check if attempt matches the two squares from the first move
  if (attempt.includes(fromSquare) &&
    attempt.includes(toSquare)
  )
    return true;
}
