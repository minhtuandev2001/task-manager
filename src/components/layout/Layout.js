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
    console.log("check da vao day")
    window.addEventListener('unload', function (e) {
      console.log("check socket dissss")
      socket.emit("disconnected", currentUser.id, false)
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
