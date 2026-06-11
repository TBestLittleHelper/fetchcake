import './ninja-chess.css'

import { Chessground } from '@lichess-org/chessground';
import type { Config } from "@lichess-org/chessground/config";

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
const dailyFen = "4rq2/pp6/6k1/8/7Q/3p4/PPP3PP/4R2K w - - 6 31"

ground.set({ fen: dailyFen })

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
