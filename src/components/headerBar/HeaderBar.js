import React, { useContext, useEffect, useRef, useState } from 'react'
import { IconBell } from '../icons'
import { AuthContext } from "../../context/authContext"
import Portal from '../portal/Portal'
import { motion } from "framer-motion"

export default function HeaderBar() {
  const { currentUser } = useContext(AuthContext)
  const bellRef = useRef(null)
  const [showModalNotification, setShowModalNotification] = useState(false)
  const [coords, setCoords] = useState({
    top: 0,
    left: 0
  })
  const handleShowNotification = () => {
    console.log("check ", bellRef.current.getBoundingClientRect());
    setCoords(bellRef.current.getBoundingClientRect())
    setShowModalNotification(true)
  }
  useEffect(() => {
    const handleOffNotification = () => {
      setShowModalNotification(false)
    }
    window.addEventListener("resize", handleOffNotification)
    return () => {
      window.removeEventListener("resize", handleOffNotification)
    }
  }, [])
  return (
    <>
      <div className='w-full h-14 flex justify-between items-center px-4'>
        <p className='text-2xl font-semibold'>Hello, {currentUser.name}!</p>
        <div className="nav-info flex items-center gap-4">
          <div
            ref={bellRef}
            onClick={handleShowNotification}
            className='w-10 h-10 rounded-md bg-icon flex justify-center items-center cursor-pointer'>
            <IconBell></IconBell>
          </div>
          <img
            className='w-10 h-10 rounded-full select-none'
            src={currentUser.avatar} alt="" />
        </div>
      </div>
      <Portal
        visible={showModalNotification}
        containerClassName='fixed inset-0 z-[999]'
        contentClassName='w-full h-full'
        classOverlay='bg-opacity-5'
        onClose={() => setShowModalNotification(false)}
      >
        <motion.div
          animate={{
            y: [-50, 0],
            opacity: [0, 1]
          }}
          key="notification"
          exit={{
            y: [0, -50],
            opacity: [1, 0]
          }}
          transition={{ duration: 0.2 }}
          className='relative bg-white w-full max-w-[400px] rounded-md p-3 shadow-md mt-2'
          style={{
            top: coords.top + coords.height,
            left: coords.left - 400
          }}
        >
          <p className='text-base font-medium'>Notification</p>
          <div className='w-full h-[400px] max-h-[400px] mt-2'>
            <div className='bg-red-100 py-2 cursor-pointer hover:bg-gray-100 transition-all'>
              <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, quae.</p>
            </div>
          </div>
        </motion.div>
      </Portal>
    </>
  )
}
