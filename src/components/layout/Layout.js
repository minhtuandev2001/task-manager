import React, { useContext, useEffect } from 'react'
import Sidebar from '../sidebar/Sidebar'
import HeaderBar from '../headerBar/HeaderBar'
import { Outlet } from 'react-router-dom'
import { useSocket } from '../../context/socketContext'
import { AuthContext } from "../../context/authContext"
export default function Layout() {
  const { currentUser } = useContext(AuthContext)
  const socket = useSocket()
  useEffect(() => {
    window.addEventListener('beforeunload', function (e) {
      socket.emit("disconnected", currentUser.id, currentUser.friendsList, false)
    });
  }, [socket, currentUser.id, currentUser.friendsList])
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
