import React, { useContext, useEffect, useRef, useState } from 'react'
import { IconBell, IconDelete, IconList } from '../icons'
import { AuthContext } from "../../context/authContext"
import Portal from '../portal/Portal'
import { motion } from "framer-motion"
import axios from 'axios'
import { BASE_URL } from '../../constans/url'
import { toast } from 'react-toastify'
import noNoti from "../../asset/images/no-noti.png"
import { useSocket } from '../../context/socketContext'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { useSideBar } from '../../context/sideBarContext'
import Button from '../button/Button'

export default function HeaderBar() {
  const socket = useSocket()
  const { currentUser } = useContext(AuthContext);
  const { showSideBar, setShowSideBar } = useSideBar();
  const bellRef = useRef(null)
  const loadNotiRef = useRef({})
  const [showModalNotification, setShowModalNotification] = useState(false)

  const [coords, setCoords] = useState({
    top: 0,
    left: 0
  })
  const [notificatios, setNotifications] = useState([])
  const handleShowNotification = () => {
    console.log(bellRef.current.getBoundingClientRect())
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
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("UPDATE PROJECT", (noti) => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("UPDATE STAR", noti => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("DONE PROJECT", noti => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("DELETE PROJECT", noti => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("CREATE CHAT", (chat, noti) => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("CREATE TASK", (noti) => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("UPDATE TASK", (noti) => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
    socket.on("DELETE TASK", (noti) => {
      setNotifications(prevNotifi => [noti, ...prevNotifi])
    })
  }, [socket])
  const [showPopup, setShowPopup] = useState(false)
  return (
    <>
      <div className='flex items-center justify-between w-full px-4 h-14 dark:bg-bgDark'>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setShowSideBar(true)}
            className='phone:block tablet:hidden button-default w-10 h-10 rounded-md font-medium mb-0'><IconList></IconList></Button>
          <p className='text-2xl font-semibold phone:text-xl dark:text-white'>Hello, {currentUser.name}!</p>
        </div>
        <div className="flex items-center gap-4 nav-info">
          <div
            ref={bellRef}
            onClick={handleShowNotification}
            className='relative flex items-center justify-center w-10 h-10 rounded-md cursor-pointer bg-icon dark:bg-gray-500/30 '>
            <span className='bg-[#ED3159] text-xs font-medium text-white rounded-full w-auto min-w-[18px] h-[18px] absolute top-0 right-0 flex justify-center items-center'>{notificatios.length}</span>
            <IconBell></IconBell>
          </div>
          <img
            onMouseMove={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
            className='w-10 h-10 rounded-full select-none cursor-pointer'
            src={currentUser.avatar} alt="" />
          {showPopup && <div
            className='absolute top-[46px] right-[12px] rounded-sm transition-all cursor-pointer flex flex-col z-10 '
            onMouseMove={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
          >
            <div className='w-[40px] h-[10px] self-end'></div>
            <ul
              className='w-[250px] h-auto min-h-[200px] p-3 bg-white shadow-md dark:bg-bgDark/90 rounded-md'>
              <NavLink to={`/profile/${currentUser.id}`}>
                <li className='text-base p-2 hover:bg-gray-100 rounded-sm font-medium text-gray-900 dark:text-white dark:hover:bg-gray-100/50'>Profile</li>
              </NavLink>
            </ul>
          </div>}
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
          className='absolute bg-white dark:bg-bgDark w-full max-w-[400px] phone:max-w-[300px] phone1.5:max-w-[350px] right-[calc(32px+40px)] rounded-md p-3 shadow-md mt-2'
          style={{
            top: coords.top + coords.height,
          }}
        >
          <p className='text-base font-medium dark:text-white'>Notification</p>
          <div
            className='w-full h-[400px] max-h-[400px] mt-2 overflow-scroll no-scrollbar'>
            {notificatios.length > 0 ? notificatios.map((item, index) => {
              return (
                <div key={index} className='p-2 transition-all rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100/50'>
                  <div className='flex items-center gap-2'>
                    <img
                      className='w-10 h-10 rounded-full'
                      src={item?.infoUser.avatar} alt="" />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-semibold dark:text-white'>{item?.infoUser.username}</p>
                        <p className='text-sm font-medium text-gray-400 dark:text-white'>{moment(item?.createdAt, "YYYY-MM-DD HH:mm Z").format("HH:mm").toString()}</p>
                      </div>
                      <p className='text-sm line-clamp-2 dark:text-white'>{item.content}</p>
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
