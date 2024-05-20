import React from 'react'

export default function IconSmile({ className = "", onClick = () => { }, selected = false }) {
  return (
    <span className={className} onClick={onClick}>
      <svg
        width={22}
        height={22}
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 13C7 13 8.5 15 11 15C13.5 15 15 13 15 13"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 8H8.01"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 8H14.01"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

    </span>
  )
}

// stroke={selected ? "white" : "#717279"}