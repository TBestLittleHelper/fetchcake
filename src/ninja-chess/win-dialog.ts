import { Chessground } from '@lichess-org/chessground'
import type { Config } from '@lichess-org/chessground/config'
import { Chess } from 'chessops/chess'
import { parseFen, makeFen } from 'chessops/fen'
import { parseUci } from 'chessops/util'
import type { Puzzle } from './types'
import type { Key } from '@lichess-org/chessground/types'

export function showWinDialog(puzzles: Puzzle[], cupName: string): void {
  const dialog = document.getElementById('winDialog') as HTMLDialogElement
  const title = document.getElementById('winDialogTitle')!
  const grid = document.getElementById('winDialogGrid')!

  title.textContent = `${cupName.charAt(0).toUpperCase()}${cupName.slice(1)} Cup Winner!`
  grid.innerHTML = ''

  puzzles.forEach((puzzle, index) => {
    const card = document.createElement('div')
    card.className = 'winPuzzleCard'

    const puzzleLink = document.createElement('a')
    puzzleLink.className = 'winPuzzleNum'
    puzzleLink.textContent = `#${index + 1}`
    puzzleLink.href = `https://lichess.org/training/${puzzle.puzzleId}`
    puzzleLink.target = '_blank'
    puzzleLink.rel = 'noopener noreferrer'

    const boardContainer = document.createElement('div')
    boardContainer.className = 'winBoard'

    const firstMove = puzzle.moves.split(' ')[0]
    const move = parseUci(firstMove)!

    const setup = parseFen(puzzle.fen).unwrap()
    const chess = Chess.fromSetup(setup).unwrap()
    const orientation = chess.turn

    chess.play(move)

    const fen = makeFen(chess.toSetup())

    const config: Config = {
      coordinates: false,
      viewOnly: true,
      disableContextMenu: true,
      fen,
      orientation,
      lastMove: [firstMove.substring(0, 2), firstMove.substring(2, 4)] as Key[],
    }

    Chessground(boardContainer, config)

    const timeLabel = document.createElement('span')
    timeLabel.className = 'winTimeLabel'
    timeLabel.textContent = `${(2 + Math.random() * 8).toFixed(1)}s`

    card.appendChild(puzzleLink)
    card.appendChild(boardContainer)
    card.appendChild(timeLabel)
    grid.appendChild(card)
  })

  dialog.showModal()
}
