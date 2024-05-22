import React from 'react'

export default function IconMonitor({ className = "", onClick = () => { }, selected = false }) {
  return (
    <span className={className} onClick={onClick}>
      <svg
        width={22}
        height={20}
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15H19C20.1046 15 21 14.1046 21 13V3C21 1.89543 20.1046 1 19 1Z"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 19H15"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 15V19"
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