import React from 'react'

export default function IconEyeOpen({ className = "", onClick = () => { } }) {
  return (
    <span className={className} onClick={onClick}>
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.75 7C0.75 7 3.75 1 9 1C14.25 1 17.25 7 17.25 7C17.25 7 14.25 13 9 13C3.75 13 0.75 7 0.75 7Z" stroke="#717279" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9.25C10.2426 9.25 11.25 8.24264 11.25 7C11.25 5.75736 10.2426 4.75 9 4.75C7.75736 4.75 6.75 5.75736 6.75 7C6.75 8.24264 7.75736 9.25 9 9.25Z" stroke="#717279" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
