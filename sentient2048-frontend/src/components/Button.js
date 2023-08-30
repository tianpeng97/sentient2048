import React from 'react'

const Button = ({ text, onClick }) => {
  return (
    <div
      className="w-24 text-center sm:py-1 sm:px-2 rounded-md button-style text-slate-100"
      onClick={onClick}
    >
      {text}
    </div>
  )
}

export default Button
