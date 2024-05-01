import React from 'react'
import { NavLink } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className='flex items-center justify-between p-5'>
      <div className="logo">
        Logo
      </div>
      <div className="nav text-base flex items-center gap-x-5">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </div>
  )
}
