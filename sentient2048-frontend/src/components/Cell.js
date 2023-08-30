import React from 'react'

const Cell = ({ value }) => {
  return <div className={`cell w-full h-full value-${value}`}>{value}</div>
}

export default Cell
