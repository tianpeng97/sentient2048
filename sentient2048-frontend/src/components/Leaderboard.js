import React, { useState, useEffect } from 'react'
import accountsService from '../services/accounts'

const Leaderboard = () => {
  const [entries, setEntries] = useState([])

  const formatDate = (date) => {
    const result = new Date(date)
    return result.toDateString()
  }

  useEffect(() => {
    accountsService.getAll().then((res) => {
      setEntries(res)
    })
  }, [])

  // 2004-10-19 10:23:54
  // select username, highscore from accounts order by highscore desc, date_completed limit 10;

  // TODO ternary
  if (!entries.length) {
    return null
  } else {
    return (
      <table className="leaderboard w-full text-sm text-left text-gray-500">
        <caption className="text-xl uppercase">Leaderboard</caption>
        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
          <tr className="leaderboard-row">
            <th
              scope="col"
              className="px-6 py-3"
            >
              Rank
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Username
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              High Score
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Date Achieved
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row, index) => (
            <tr
              key={row.username}
              className="leaderboard-row border-b bg-gray-800 border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-white"
              >
                {index + 1}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-white"
              >
                {row.username}
              </th>
              <td className="px-6 py-4">{row.highscore}</td>
              <td className="px-6 py-4">{formatDate(row.date_completed)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default Leaderboard
