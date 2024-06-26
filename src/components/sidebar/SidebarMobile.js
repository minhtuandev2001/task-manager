import React, { useContext, useEffect, useRef, useState } from 'react'
import { IconLogo, IconLogout, IconMessage, IconMetting, IconMoon, IconProject, IconSendMail, IconSun, IconTask, IconUsers } from '../icons'
import { motion } from "framer-motion"
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMessageNoti } from '../../context/messageNotiContext';
import axios from 'axios';
import { BASE_URL } from '../../constans/url';
import { AuthContext } from "../../context/authContext";
import { useSocket } from '../../context/socketContext';
import { useDarkMode } from '../../context/darkModeContext';

const action = [
  {
    title: "My Project",
    to: "/",
    icon: <IconProject />,
    iconActive: <IconProject selected={true} />,
  },
  {
    title: "Chat",
    to: "/chat",
    icon: <IconMessage />,
    iconActive: <IconMessage selected={true} />,
  },
  {
    title: "Metting",
    to: "/meeting",
    icon: <IconMetting />,
    iconActive: <IconMetting selected={true} />,
  },
  {
    title: "Tasks",
    to: "/task",
    icon: <IconTask />,
    iconActive: <IconTask selected={true} />,
  },
  {
    title: "Send Mail",
    to: "/sendMail",
    icon: <IconSendMail />,
    iconActive: <IconSendMail selected={true} />,
  },
  {
    title: "Friends",
    to: "/friends",
    icon: <IconUsers />,
    iconActive: <IconUsers selected={true} />,
  },
];

export default function SidebarMobile() {
  const navigate = useNavigate();
  let location = useLocation();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const socket = useSocket();
  const [selected, setSelected] = useState(location.pathname);
  const { countMessageUnRead, setCountMessageUnRead } = useMessageNoti();
  const loadChatRef = useRef(null);
  loadChatRef.current = () => {
    axios.get(`${BASE_URL}/chat`, {
      headers: {
        "Authorization": `Bearer ${currentUser.token}`
      }
    }).then((res) => {
      setCountMessageUnRead(res.data?.data || [])
    }).catch((err) => {
      console.log("check ", err)
    })
  }
  useEffect(() => {
    loadChatRef.current();
  }, [])

  // sẽ hoạt động khi bạn không ở trang chát
  // nếu bạn ở trang chat thì đã cập nhật ở trang chat và chuyển qua nhờ context
  useEffect(() => {
    // nhận tin nhắn và cập nhật số lượng thông báo ở sidebar
    socket.on("server return message noti", message => {
      if (message.infoSender._id !== currentUser.id) { // những client khác nhận được thôi
        // cập nhật lại danh sách chat, cập nhật lại tin nhắn mới nhất có thể có 
        loadChatRef.current()
        // cập nhật lại số lượng thông báo tin nhắn
        setCountMessageUnRead(prevChats => prevChats.map((chat) => {
          if (chat._id === message.room_chat_id) {
            if (chat.latestMessage?.usersRead) {
              chat.latestMessage.usersRead = [...chat.latestMessage.usersRead.filter(item => item !== currentUser.id)];
            }
            console.log("check 1", chat)
          }
          return chat
        }))
      }
    })
  }, [socket, currentUser, setCountMessageUnRead])

  const handleLogout = () => {
    setCurrentUser(null)
    navigate("/login")
    localStorage.setItem("user", null)
  }

  useEffect(() => {
    setSelected(location.pathname)
  }, [location.pathname])
  const handleTheme = (theme) => {
    setDarkMode(theme)
    localStorage.setItem('theme', theme);
  }
  return (
    <div className='w-full max-w-[300px] 
    bg-white
    dark:bg-bgDark
    tablet:block
    tablet:max-w-[230px]
    tablet:px-4
    tablet:h-svh
    laptop:max-w-[250px]
    laptop:px-8
    laptop2:max-w-[300px]
    h-screen py-5 px-8 border-r border-r-[#c7c8c9] sticky top-0'>
      <div className="flex items-center gap-6 sider-header">
        <IconLogo></IconLogo>
        <p className='text-2xl font-bold text-[#2A304E] dark:text-white'>Task<span className='text-[#27364b] dark:text-[#506788]'>Work</span></p>
      </div>
      <div className="sider-content mt-14 tablet:mt-6 h-[calc(100%-20px-56px-56px-56px)]">
        {action.map((item, index) => {
          return (
            <NavLink key={item.title} to={item.to}>
              <div className="relative w-full h-12 mb-2 rounded-md sider-item">
                <div
                  className="absolute z-10 flex items-center justify-between w-full h-full gap-4 px-4 transition-all rounded-md cursor-pointer">
                  {item.to === selected ? item.iconActive : item.icon}
                  <span
                    className={`text-base font-medium select-none flex-1 ${item.to === selected ? "text-white" : "text-graycustom"}`}>{item.title}</span>
                  {item.to === "/chat" && <div className='bg-[#ED3159] text-white font-semibold p-1 rounded-full text-xs w-5 h-5 flex justify-center items-center leading-5'>{countMessageUnRead ?
                    countMessageUnRead.reduce((total, message, index) => {
                      if (message?.latestMessage) {
                        if (message?.latestMessage.usersRead.includes(currentUser.id) === false) {
                          return total += 1;
                        }
                      }
                      return total
                    }, 0) > 99 ?
                      "99+"
                      : countMessageUnRead.reduce((total, message, index) => {
                        if (message?.latestMessage) {
                          if (message?.latestMessage.usersRead.includes(currentUser.id) === false) {
                            return total += 1;
                          }
                        }
                        return total
                      }, 0)
                    : 0}</div>}
                </div>
                {item.to === selected ?
                  <motion.div
                    layoutId='siderItem'
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex items-center px-4 gap-4 bg-[#2384FF] rounded-md">
                  </motion.div> : null
                }
              </div>
            </NavLink>
          )
        })}
      </div>
      <div className="mt-auto sider-footer">
        <div className="relative w-full h-12 mb-2 rounded-md sider-item">
          <div
            onClick={handleLogout}
            className="absolute z-10 flex items-center w-full h-full gap-4 px-4 cursor-pointer">
            <IconLogout></IconLogout>
            <span
              className={`text-base font-medium select-none text-graycustom`}>Logout</span>
          </div>
        </div>
        <div className="relative w-full h-12 mb-2 rounded-md sider-item">
          {darkMode ? (<div
            onClick={() => handleTheme(false)}
            className="absolute z-10 flex items-center w-full h-full gap-4 px-4 cursor-pointer">
            <IconMoon></IconMoon>
            <span
              className={`text-base font-medium select-none text-graycustom`}>Light mode</span>
          </div>
          ) : (
            <div
              onClick={() => handleTheme(true)}
              className="absolute z-10 flex items-center w-full h-full gap-4 px-4 cursor-pointer">
              <IconSun></IconSun>
              <span
                className={`text-base font-medium select-none text-graycustom`}>Dark mode</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
