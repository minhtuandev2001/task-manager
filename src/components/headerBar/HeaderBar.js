import React from 'react'
import { IconBell } from '../icons'

export default function HeaderBar() {
  return (
    <div className='w-full h-14 flex justify-between items-center px-4'>
      <p className='text-2xl font-medium'>Hello, Minh tuan !</p>
      <div className="nav-info flex items-center gap-4">
        <div className='w-10 h-10 rounded-md bg-icon flex justify-center items-center'>
          <IconBell></IconBell>
        </div>
        <img
          className='w-10 h-10 rounded-full'
          src="https://images.unsplash.com/photo-1714385998351-341d070aa79e?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div>
    </div>
  )
}
