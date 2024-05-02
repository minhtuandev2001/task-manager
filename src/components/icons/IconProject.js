import React from 'react'

export default function IconProject({ className = "", onClick = () => { }, selected = false }) {
  return (
    <span className={className} onClick={onClick}>
      <svg
        width={27}
        height={20}
        viewBox="0 0 27 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.1667 17C25.1667 17.5304 24.9121 18.0391 24.4588 18.4142C24.0056 18.7893 23.3909 19 22.75 19H3.41667C2.77573 19 2.16104 18.7893 1.70783 18.4142C1.25461 18.0391 1 17.5304 1 17V3C1 2.46957 1.25461 1.96086 1.70783 1.58579C2.16104 1.21071 2.77573 1 3.41667 1H9.45833L11.875 4H22.75C23.3909 4 24.0056 4.21071 24.4588 4.58579C24.9121 4.96086 25.1667 5.46957 25.1667 6V17Z"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.2083 9V15"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.58331 12H16.8333"
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