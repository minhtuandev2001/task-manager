import React from 'react'

export default function Input({ name = "", type = "text", children, ...props }) {
  return (
    <div className='relative'>
      <input
        type={type}
        id={name}
        {...props}
        style={{
          paddingRight: children ? "40px" : "12px"
        }}
      />
      {children}
    </div>
  )
}