import React from 'react'

export default function IconPlus({ className = "", onClick = () => { }, selected = false }) {
  return (
    <span className={className} onClick={onClick}>
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 1V15"
          stroke="#2384FF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 8H15"
          stroke="#2384FF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

// stroke={selected ? "white" : "#717279"}