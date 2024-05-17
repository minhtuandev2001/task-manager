import React, { useState } from 'react'
import { IconLogo, IconLogout, IconMessage, IconMetting, IconProject, IconSendMail, IconSun, IconTask, IconUsers } from '../icons'
import { motion } from "framer-motion"
import { NavLink } from 'react-router-dom';

const action = [
  {
    id: 0,
    title: "My Project",
    to: "/project",
    icon: <IconProject />,
    iconActive: <IconProject selected={true} />,
  },
  {
    id: 1,
    title: "Chat",
    to: "/chat",
    icon: <IconMessage />,
    iconActive: <IconMessage selected={true} />,
  },
  {
    id: 2,
    title: "Metting",
    to: "/meeting",
    icon: <IconMetting />,
    iconActive: <IconMetting selected={true} />,
  },
  {
    id: 3,
    title: "Tasks",
    to: "/task",
    icon: <IconTask />,
    iconActive: <IconTask selected={true} />,
  },
  {
    id: 4,
    title: "Send Mail",
    to: "/send-mail",
    icon: <IconSendMail />,
    iconActive: <IconSendMail selected={true} />,
  },
  {
    id: 5,
    title: "Friends",
    to: "/friends",
    icon: <IconUsers />,
    iconActive: <IconUsers selected={true} />,
  },
];
export default function Sidebar() {
  const [selected, setSelected] = useState(action[0].id);
  return (
    <div className='w-full max-w-[300px] h-screen py-5 px-8 flex flex-col border-r border-r-[#c7c8c9] sticky top-0 '>
      <div className="flex items-center gap-6 sider-header">
        <IconLogo></IconLogo>
        <p className='text-2xl font-bold text-[#2A304E]'>Task<span className='text-[#2384FF]'>Maker</span></p>
      </div>
      <div className="sider-content mt-14">
        {action.map((item, index) => {
          return (
            <NavLink key={item.title} to={item.to}>
              <div className="relative w-full h-12 mb-2 rounded-md sider-item">
                <div
                  onClick={() => setSelected(item.id)}
                  className="absolute z-10 flex items-center w-full h-full gap-4 px-4 cursor-pointer">
                  {item.id === selected ? item.iconActive : item.icon}
                  <span
                    className={`text-base font-medium select-none ${item.id === selected ? "text-white" : "text-graycustom"}`}>{item.title}</span>
                </div>
                {item.id === selected ?
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
            className="absolute z-10 flex items-center w-full h-full gap-4 px-4 cursor-pointer">
            <IconLogout></IconLogout>
            <span
              className={`text-base font-medium select-none text-graycustom`}>Logout</span>
          </div>
        </div>
        <div className="relative w-full h-12 mb-2 rounded-md sider-item">
          <div
            className="absolute z-10 flex items-center w-full h-full gap-4 px-4 cursor-pointer">
            <IconSun></IconSun>
            <span
              className={`text-base font-medium select-none text-graycustom`}>Dark mode</span>
          </div>
        </div>
      </div>
    </div>
  )
}
