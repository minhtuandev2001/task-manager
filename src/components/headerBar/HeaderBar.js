import React, { useContext, useEffect, useRef, useState } from 'react'
import { IconBell, IconDelete } from '../icons'
import { AuthContext } from "../../context/authContext"
import Portal from '../portal/Portal'
import { motion } from "framer-motion"
import axios from 'axios'
import { BASE_URL } from '../../constans/url'
import { toast } from 'react-toastify'
import noNoti from "../../asset/images/no-noti.png"
import { useSocket } from '../../context/socketContext'
import moment from 'moment'

export default function HeaderBar() {
  const socket = useSocket()
  const { currentUser } = useContext(AuthContext)
  const bellRef = useRef(null)
  const loadNotiRef = useRef({})
  const [showModalNotification, setShowModalNotification] = useState(false)
  const [coords, setCoords] = useState({
    top: 0,
    left: 0
  })
  const [notificatios, setNotifications] = useState([])
  const handleShowNotification = () => {
    setCoords(bellRef.current.getBoundingClientRect())
    setShowModalNotification(true)
    loadNotiRef.current()
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
  loadNotiRef.current = () => {
    axios.get(`${BASE_URL}/notification`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      setNotifications(res.data?.data || [])
    }).catch((err) => {
      toast.error("load notification failed")
      console.log("check ", err.response?.data.messages)
    })
  }
  useEffect(() => {
    loadNotiRef.current();
  }, [])
  useEffect(() => {
    socket.on("CLIENT_ADD_FRIEND", (data) => {
      setNotifications(prevNotifi => [data, ...prevNotifi])
    })
    socket.on("CLIENT_ACCEPT_FRIEND", (data) => {
      setNotifications(prevNotifi => [data, ...prevNotifi])
    })
    socket.on("CREATE PROJECT", (project, noti, chat) => {
      console.log("check trong noti")
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
  }, [socket])
  return (
    <>
      <div className='flex items-center justify-between w-full px-4 h-14'>
        <p className='text-2xl font-semibold'>Hello, {currentUser.name}!</p>
        <div className="flex items-center gap-4 nav-info">
          <div
            ref={bellRef}
            onClick={handleShowNotification}
            className='relative flex items-center justify-center w-10 h-10 rounded-md cursor-pointer bg-icon'>
            <span className='bg-[#ED3159] text-xs font-medium text-white rounded-full w-auto min-w-[18px] h-[18px] absolute top-0 right-0 flex justify-center items-center'>{notificatios.length}</span>
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
            left: coords.left - 400 + coords.width
          }}
        >
          <p className='text-base font-medium'>Notification</p>
          <div className='w-full h-[400px] max-h-[400px] mt-2 overflow-scroll no-scrollbar'>
            {notificatios.length > 0 ? notificatios.map((item, index) => {
              return (
                <div key={index} className='p-2 transition-all rounded-md cursor-pointer hover:bg-gray-100'>
                  <div className='flex items-center gap-2'>
                    <img
                      className='w-10 h-10 rounded-full'
                      src={item?.infoUser.avatar} alt="" />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-semibold'>{item?.infoUser.username}</p>
                        <p className='text-sm font-medium text-gray-400'>{moment(item?.createdAt, "YYYY-MM-DD HH:mm Z").format("HH:mm").toString()}</p>
                      </div>
                      <p className='text-sm line-clamp-2'>{item.content}</p>
                    </div>
                    <IconDelete></IconDelete>
                  </div>
                </div>
              )
            }) : (
              <img className='mx-auto mt-20' src={noNoti} alt="" />
            )}
          </div>
        </motion.div>
      </Portal>
    </>
  )
}
