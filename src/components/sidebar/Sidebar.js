import React, { useState } from 'react'
import { IconLogo, IconLogout, IconMessage, IconMetting, IconProject, IconSendMail, IconSun, IconTask } from '../icons'
import { motion } from "framer-motion"
const arr = [0, 1, 2, 3, 4];
const action = [
  {
    id: 0,
    title: "My Project",
    icon: <IconProject />,
    iconActive: <IconProject selected={true} />,
  },
  {
    id: 1,
    title: "Chat",
    icon: <IconMessage />,
    iconActive: <IconMessage selected={true} />,
  },
  {
    id: 2,
    title: "Metting",
    icon: <IconMetting />,
    iconActive: <IconMetting selected={true} />,
  },
  {
    id: 3,
    title: "Tasks",
    icon: <IconTask />,
    iconActive: <IconTask selected={true} />,
  },
  {
    id: 4,
    title: "Send Mail",
    icon: <IconSendMail />,
    iconActive: <IconSendMail selected={true} />,
  },
];
export default function Sidebar() {
  const [selected, setSelected] = useState(action[0].id);
  return (
    <div className='w-full max-w-[300px] h-screen py-5 px-8 flex flex-col border-r border-r-[#c7c8c9] sticky top-0 '>
      <div className="sider-header flex items-center gap-6">
        <IconLogo></IconLogo>
        <p className='text-2xl font-bold text-[#2A304E]'>Task<span className='text-[#2384FF]'>Maker</span></p>
      </div>
      <div className="sider-content mt-14">
        {action.map((item, index) => {
          return (
            <div key={item.title} className="sider-item w-full h-12 rounded-md relative mb-2">
              <div
                onClick={() => setSelected(item.id)}
                className="w-full h-full flex items-center px-4 gap-4 absolute cursor-pointer z-10">
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
          )
        })}
      </div>
      <div className="sider-footer mt-auto">
        <div className="sider-item w-full h-12 rounded-md relative mb-2">
          <div
            className="w-full h-full flex items-center px-4 gap-4 absolute cursor-pointer z-10">
            <IconLogout></IconLogout>
            <span
              className={`text-base font-medium select-none text-graycustom`}>Logout</span>
          </div>
        </div>
        <div className="sider-item w-full h-12 rounded-md relative mb-2">
          <div
            className="w-full h-full flex items-center px-4 gap-4 absolute cursor-pointer z-10">
            <IconSun></IconSun>
            <span
              className={`text-base font-medium select-none text-graycustom`}>Dark mode</span>
          </div>
        </div>
      </div>
    </div>
  )
}
