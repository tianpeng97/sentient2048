import { useEffect, useState, useContext } from 'react'
import { UserContext } from './UserContext'
import Body from './Body'

const Board = ({ highestScore, handleScore, score, setScore }) => {
  const { user } = useContext(UserContext)
  const size = 4
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [newGame, setNewGame] = useState(false) // toggle value

  // init game
  useEffect(() => {
    document.body.addEventListener('keydown', (event) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(
          event.code
        ) > -1
      ) {
        event.preventDefault()
      }
    })

    document.body.addEventListener('keydown', handleKeyPress)
    return () => document.body.removeEventListener('keydown', handleKeyPress)
  })

  useEffect(() => {
    handleScore()
  }, [score])

  useEffect(() => {
    addRandom2Cells()
  }, [newGame])

  // Direction vertical sont inverted car upper-left corner est coord(0, 0)
  const handleKeyPress = (event) => {
    if (board.length && !gameOver) {
      if (event.key === 'ArrowDown') {
        sweep({ x: 1, y: 0 }) // right
      } else if (event.key === 'ArrowUp') {
        sweep({ x: -1, y: 0 }) // left
      } else if (event.key === 'ArrowRight') {
        sweep({ x: 0, y: 1 }) // down
      } else if (event.key === 'ArrowLeft') {
        sweep({ x: 0, y: -1 }) // up
      }
    }
  }

  // New Game
  const initGame = () => {
    let newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(null))

    setBoard(newBoard)
    setNewGame(!newGame)
    setScore(0)
    setGameOver(false)
    setMessage('')
  }

  // retourne Array de cells vides
  const getNullCells = () => {
    let nullCells = []
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (!board[y][x]) nullCells.push({ x: x, y: y })
      }
    }
    return nullCells
  }

  // Retourne {x,y} d'une cellule random
  const getRandomCell = () => {
    let nullCells = getNullCells()

    if (nullCells.length) {
      return nullCells[Math.floor(Math.random() * nullCells.length)]
    } else {
      return null
    }
  }

  // Ajoute un nombre dans une cases libre random
  const addRandomCell = () => {
    let nullCells = getNullCells()
    if (nullCells.length) {
      let value = Math.random() < 0.8 ? 2 : 4
      let cellPosition = getRandomCell()
      let newBoard = [...board]
      newBoard[cellPosition.y][cellPosition.x] = value
      setBoard(newBoard)
    }
  }

  const addRandom2Cells = () => {
    addRandomCell()
    addRandomCell()
  }

  // Les positions a "lire" selon la direction du sweep
  const initSweep = (vector) => {
    let positions = {
      x: [...Array(size).keys()],
      y: [...Array(size).keys()],
    }

    // On merge du plus loin, note que upper-left est {0, 0}
    if (vector.x === 1) positions.x = positions.x.reverse()
    if (vector.y === 1) positions.y = positions.y.reverse()

    return positions
  }

  // Retourne value pour chaque cellule
  const getCellValue = (cellPosition) => {
    if (isCellPositionAllowed(cellPosition)) {
      return board[cellPosition.y][cellPosition.x]
    } else {
      return null
    }
  }

  // Si la position {x, y} est valide dans la table
  const isCellPositionAllowed = (cellPosition) => {
    return (
      cellPosition.x >= 0 &&
      cellPosition.x < size &&
      cellPosition.y >= 0 &&
      cellPosition.y < size
    )
  }

  const move = (
    board,
    merges,
    movement,
    cellValue,
    currentPosition,
    newPosition
  ) => {
    let newBoard = [...board]
    let newMerge = [...merges]

    // movement
    if (movement === true) {
      newBoard[currentPosition.y][currentPosition.x] = null
      newBoard[newPosition.y][newPosition.x] = cellValue
    } else {
      // merges
      newBoard[newPosition.y][newPosition.x] = cellValue * 2
      newMerge[newPosition.y][newPosition.x] = true
      newBoard[currentPosition.y][currentPosition.x] = null
      newMerge[currentPosition.y][currentPosition.x] = false
    }

    return { newBoard: newBoard, merges: newMerge }
  }

  // Can this cell be merged with another
  const isMergeable = () => {
    let cellValue
    let directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ]

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let cellPosition = { x: x, y: y }
        cellValue = getCellValue(cellPosition)

        if (cellValue !== null) {
          for (const direction of directions) {
            let newCellPosition = { x: x + direction.x, y: y + direction.y }
            let newCellValue = getCellValue(newCellPosition)

            if (newCellValue && newCellValue === cellValue) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  // Est-ce que la cell est libre
  const isCellNull = (cellPosition) => {
    return !board[cellPosition.y][cellPosition.x]
  }

  // Nouvelle position possible et celle qui devrait etre utiliser pour merge apres sweep
  const getNewPositions = (cellPosition, direction) => {
    let newCellPosition

    do {
      newCellPosition = cellPosition
      cellPosition = {
        x: newCellPosition.x + direction.x,
        y: newCellPosition.y + direction.y,
      }
    } while (isCellPositionAllowed(cellPosition) && isCellNull(cellPosition))

    return {
      newCellPosition: newCellPosition,
      mergeReferencePosition: cellPosition,
    }
  }

  // Jeu fini quand plus de cells vides et plus de merge possible
  const isGameOver = () => {
    return !getNullCells().length && !isMergeable()
  }

  // Mouvements des cellules selon une direction {x, y}
  const sweep = (vector) => {
    if (!board.length) {
      return null
    }

    let positions = initSweep(vector)
    let merges = Array(size)
      .fill()
      .map(() => Array(size).fill(false))
    let newBoard = [...board]
    let moved = false

    positions.y.forEach((y) =>
      positions.x.forEach((x) => {
        let cellPosition = { x: x, y: y }
        let cellValue = getCellValue(cellPosition)

        // pas d'action pour cell vide
        if (cellValue !== null) {
          let { newCellPosition, mergeReferencePosition } = getNewPositions(
            cellPosition,
            vector
          )

          let mergeReferenceValue = getCellValue(mergeReferencePosition)

          // Maximum de 1 merge pour 2 cellule
          if (
            mergeReferenceValue !== null &&
            mergeReferenceValue === cellValue &&
            !merges[mergeReferencePosition.y][mergeReferencePosition.x]
          ) {
            ;({ newBoard, merges } = move(
              newBoard,
              merges,
              false,
              cellValue,
              cellPosition,
              mergeReferencePosition
            ))

            let newScore = score + cellValue * 2
            setScore(newScore)
            if (cellValue * 2 === 2048) {
              setGameOver(true)
              setMessage('GAME WON!')
            }
          } else {
            ;({ newBoard, merges } = move(
              newBoard,
              merges,
              true,
              cellValue,
              cellPosition,
              newCellPosition
            ))
          }

          let newCellValue = getCellValue(cellPosition)
          if (!moved) {
            if (cellValue !== newCellValue) {
              moved = true
            }
          }
        }
      })
    )
    setBoard(newBoard)

    if (moved) {
      if (!gameOver) {
        addRandomCell()
      }

      // have to check after adding cell
      if (isGameOver()) {
        setGameOver(true)
        setMessage('GAME LOST.')
      }
    }
  }

  return (
    <>
      <div className="game-info">
        <div className="row">
          <div className="col-5">
            <div
              className="title text-center"
              id="game-head"
            >
              <label>2048 Game</label>
              <div className="flex flex-row w-full space-x-4">
                <div
                  id="game-score"
                  className="flex-1"
                >
                  Score : {score}
                </div>
                {user && (
                  <div
                    id="high-score"
                    className="flex-1"
                  >
                    Previous Highest Score : {highestScore}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-1">
            <div className="settings">
              <div
                className="form-group"
                id="board-size"
              >
                <div className="row">
                  <div className="col flex flex-col">
                    <button
                      id="game-new"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        initGame()
                      }}
                    >
                      New Game
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Body
        isStarted={board.length}
        gameOver={gameOver}
        message={message}
        board={board}
        size={size}
      />
    </>
  )
}

export default Board
