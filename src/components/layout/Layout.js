import React, { useContext, useEffect } from 'react'
import Sidebar from '../sidebar/Sidebar'
import HeaderBar from '../headerBar/HeaderBar'
import { Outlet } from 'react-router-dom'
import { useSocket } from '../../context/socketContext'
import { AuthContext } from "../../context/authContext"
import { useSideBar } from '../../context/sideBarContext'
import Portal from '../portal/Portal'
import SidebarMobile from '../sidebar/SidebarMobile'
import { motion } from "framer-motion"
import { useDarkMode } from '../../context/darkModeContext'

export default function Layout() {
  const { currentUser } = useContext(AuthContext)
  const socket = useSocket()
  const { showSideBar, setShowSideBar } = useSideBar();
  const { darkMode, setDarkMode } = useDarkMode();

  console.log("check ", showSideBar)
  useEffect(() => {
    console.log("check da vao day")
    window.addEventListener('unload', function (e) {
      console.log("check socket dissss")
      socket.emit("disconnected", currentUser.id, false)
    });
  }, [socket, currentUser.id, currentUser.friendsList])
  return (
    <>
      <div className={`flex ${darkMode ? 'dark' : 'light'}`}>
        <Sidebar></Sidebar>
        <Portal
          visible={showSideBar}
          containerClassName="fixed inset-0 z-[999]"
          contentClassName="z-50 w-full max-w-[300px]"
          onClose={() => {
            console.log("check 1")
            setShowSideBar(false)
          }}
        >
          <motion.div
            animate={{
              opacity: [0, 1],
              x: [-300, 0]
            }}
            key="sideBar"
            exit={{
              opacity: [1, 0],
              x: [0, -300]
            }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          >
            <SidebarMobile></SidebarMobile>
          </motion.div>
        </Portal>
        <div className='w-full'>
          <HeaderBar></HeaderBar>
          <main className='p-3 bg-[#F6FAFB] dark:bg-bgDark/90'>
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </>
  )
}
