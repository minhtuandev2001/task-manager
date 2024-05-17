import React, { useEffect } from 'react'
import Sidebar from '../sidebar/Sidebar'
import HeaderBar from '../headerBar/HeaderBar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <div className='flex'>
        <Sidebar></Sidebar>
        <div className='w-full'>
          <HeaderBar></HeaderBar>
          <main className='p-3 bg-[#F6FAFB]'>
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </>
  )
}
