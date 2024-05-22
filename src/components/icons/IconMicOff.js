import React from 'react'

export default function IconMicOff({ className = "", onClick = () => { }, selected = false }) {
  return (
    <span className={className} onClick={onClick}>
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1.00293L23 23.0029"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 9.00302V12.003C9.00052 12.596 9.17675 13.1755 9.50643 13.6684C9.83611 14.1612 10.3045 14.5453 10.8523 14.7722C11.4002 14.999 12.0029 15.0584 12.5845 14.9429C13.1661 14.8273 13.7005 14.542 14.12 14.123M15 9.34302V4.00302C15.0007 3.25905 14.725 2.54134 14.2264 1.98922C13.7277 1.4371 13.0417 1.08996 12.3015 1.0152C11.5613 0.940427 10.8197 1.14336 10.2207 1.58461C9.62172 2.02586 9.20805 2.67393 9.06 3.40302"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9999 16.9529C16.0237 17.9494 14.7721 18.6314 13.4056 18.9115C12.039 19.1917 10.62 19.0571 9.33044 18.5252C8.0409 17.9933 6.9397 17.0882 6.16811 15.9261C5.39652 14.764 4.98974 13.3978 4.99994 12.0029V10.0029M18.9999 10.0029V12.0029C18.9996 12.4154 18.9628 12.827 18.8899 13.2329"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 19.0029V23.0029"
          stroke={selected ? "white" : "#717279"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 23.0029H16"
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