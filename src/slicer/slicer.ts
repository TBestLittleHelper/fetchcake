import './slicer.css'

import { Chessground } from '@lichess-org/chessground';
import type { Config } from "@lichess-org/chessground/config";

const boardElement = document.querySelector<HTMLElement>('#board')

if (!boardElement) {
  throw new Error('Board element is missing from slicer.html.')
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

// Initialize slicer page
const container = document.querySelector<HTMLElement>('#slicerContainer')

if (!container) {
  throw new Error('Slicer markup is missing from slicer.html.')
}

// Slicer page functionality can be added here
