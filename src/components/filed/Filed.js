import React from 'react'

export default function Filed({ children, className }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
