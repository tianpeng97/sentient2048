import React from 'react'
import Cell from './Cell'

const Body = ({ isStarted, gameOver, message, board, size }) => {
  if (isStarted) {
    return (
      <div
        className="flex flex-col md:flex-row md:pb-10 justify-center md:gap-4"
        id="game-body"
      >
        <div className="md:px-4 flex flex-col md:rounded-lg">
          <div className="flex justify-center items-center sm:px-4 px-4 sm:pb-4">
            {gameOver && (
              <div
                className={`game-over-${gameOver} prevent-select grid aspect-[1] w-full h-full p-2 sm:p-4 md:p-0 mb-2 sm:mb-0 sm:w-[60vh] sm:h-[60vh] md:w-[50vh] md:h-[50vh] lg:w-[65vh] lg:h-[65vh]`}
              >
                {message}
              </div>
            )}
            <div
              id="game"
              className="prevent-select grid aspect-[1] w-full h-full p-2 sm:p-4 md:p-0 mb-2 sm:mb-0 sm:w-[60vh] sm:h-[60vh] md:w-[50vh] md:h-[50vh] lg:w-[65vh] lg:h-[65vh]"
            >
              {board.map((e, row) => (
                <div key={row}>
                  {board.map((e, cell) => (
                    <Cell
                      key={`cell-${row}-${cell}`}
                      value={board[row][cell]}
                      size={size}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Body
