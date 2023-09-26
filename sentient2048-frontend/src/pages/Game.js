import React, { useContext, useEffect, useState } from 'react'
import Board from '../components/Board'
import Header from '../components/Header'
import { socket } from '../socket'
import { UserContext } from '../components/UserContext'
import accountsService from '../services/accounts'
import Leaderboard from '../components/Leaderboard'

const Game = () => {
  const [score, setScore] = useState(0)
  const [highestScore, setHighestScore] = useState(0)
  const { user } = useContext(UserContext)

  const handleScore = async () => {
    if (user) {
      if (score > highestScore) {
        const date = new Date()
        await accountsService.update(user.id, {
          highscore: score,
          date_completed: date,
        })
        socket.emit('update', user.id)
      }
    }
  }

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (user) {
      accountsService.get(user.id).then((res) => {
        setHighestScore(res.highscore)
      })
    }
  }, [user])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="w-full sm:px-12 md:px-4">
        <Board
          highestScore={highestScore}
          handleScore={handleScore}
          score={score}
          setScore={setScore}
        />
        <Leaderboard socket={socket} />
      </div>
    </div>
  )
}

export default Game
