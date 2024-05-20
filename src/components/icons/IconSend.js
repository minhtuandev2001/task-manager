import React from 'react'

export default function IconSend({ className = "", onClick = () => { }, selected = false }) {
  return (
    <span className={className} onClick={onClick}>
      <svg
        width={22}
        height={24}
        viewBox="0 0 22 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.000244035 21.5767C0.000244114 23.3954 1.93618 24.5673 3.54868 23.7189L9.43618 20.6157L10.6315 10.2048L11.8315 20.6157L17.719 23.7189C19.3315 24.5673 21.2674 23.4001 21.2674 21.5767C21.2674 21.2486 21.2018 20.9204 21.0706 20.6157L12.7737 1.40637C11.9627 -0.468627 9.30493 -0.468626 8.49399 1.40637L0.197119 20.6157C0.065869 20.9204 0.00024402 21.2486 0.000244035 21.5767Z"
          fill="#2384FF"
        />
      </svg></span>
  )
}

// stroke={selected ? "white" : "#717279"}